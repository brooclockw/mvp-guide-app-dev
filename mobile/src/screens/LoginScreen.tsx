import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword } from '../utils/validation';
import { authService } from '../services/auth.service';
import type { LoginResponse } from '@backoffice-guide/shared';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REMEMBER_ME_KEY = '@remember_me';
const REMEMBER_ME_DURATION_DAYS = 7;

export const LoginScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { login, error, clearError, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLocked, setIsLocked] = useState(false);
  const [lockUntil, setLockUntil] = useState<Date | null>(null);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

  // Verificar si hay un bloqueo activo
  useEffect(() => {
    checkLockStatus();
  }, []);

  // Timer para el bloqueo
  useEffect(() => {
    if (isLocked && lockUntil) {
      const timer = setInterval(() => {
        const now = new Date();
        const remaining = Math.max(0, Math.floor((lockUntil.getTime() - now.getTime()) / 1000));
        setLockTimeRemaining(remaining);

        if (remaining <= 0) {
          setIsLocked(false);
          setLockUntil(null);
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLocked, lockUntil]);

  const checkLockStatus = async () => {
    try {
      const lockData = await AsyncStorage.getItem('@login_lock');
      if (lockData) {
        const { until } = JSON.parse(lockData);
        const lockDate = new Date(until);
        const now = new Date();
        
        if (lockDate > now) {
          setIsLocked(true);
          setLockUntil(lockDate);
          setLockTimeRemaining(Math.floor((lockDate.getTime() - now.getTime()) / 1000));
        } else {
          await AsyncStorage.removeItem('@login_lock');
        }
      }
    } catch (error) {
      console.error('Error checking lock status:', error);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    if (fieldName === 'email') {
      setEmail(value);
    } else if (fieldName === 'password') {
      setPassword(value);
    }

    clearError();
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });

    if (touched[fieldName]) {
      validateField(fieldName, value);
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const value = fieldName === 'email' ? email : password;
    validateField(fieldName, value);
  };

  const validateField = (fieldName: string, value: string) => {
    let result;
    
    if (fieldName === 'email') {
      result = validateEmail(value);
    } else if (fieldName === 'password') {
      result = validatePassword(value, false);
    } else {
      result = { isValid: true };
    }

    if (!result.isValid) {
      setErrors((prev) => ({ ...prev, [fieldName]: result.error || '' }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }

    return result.isValid;
  };

  const handleLogin = async () => {
    if (isLocked) {
      Alert.alert(
        'Cuenta bloqueada',
        `Tu cuenta está temporalmente bloqueada. Intenta nuevamente en ${formatTime(lockTimeRemaining)}.`
      );
      return;
    }

    setTouched({ email: true, password: true });

    const emailValid = validateField('email', email);
    const passwordValid = validateField('password', password);

    if (!emailValid || !passwordValid) {
      Alert.alert('Error de validación', 'Por favor, corrige los errores en el formulario');
      return;
    }

    try {
      clearError();
      setErrors({});
      
      // Llamar al servicio directamente para manejar MFA
      const response: LoginResponse = await authService.login({
        email: email.trim(),
        password,
        rememberMe,
      });

      // Si requiere MFA, navegar a pantalla de OTP
      if (response.requiresMFA && response.mfaChallengeId) {
        if (navigation) {
          navigation.navigate('OTP', {
            challengeId: response.mfaChallengeId,
            email: email.trim(),
          });
        }
        return;
      }

      // Si tiene token, guardarlo con duración según rememberMe
      if (response.token) {
        const { apiService } = await import('../services/api.service');
        await apiService.setToken(response.token);
        
        if (rememberMe) {
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + REMEMBER_ME_DURATION_DAYS);
          await AsyncStorage.setItem(REMEMBER_ME_KEY, JSON.stringify({ expiresAt }));
        }
      }

      // Registrar evento de login exitoso (analytics)
      // analyticsService.track('login_success', { userId: response.user.id });

      // Actualizar el contexto de autenticación usando el método del contexto
      // Esto actualizará el estado de user en el contexto
      await login({ email: email.trim(), password, rememberMe });

      // Navegar a selección de ciudad
      if (navigation) {
        navigation.replace('CitySelection');
      }
    } catch (err: any) {
      // Manejar diferentes tipos de errores según los criterios de aceptación
      const errorCode = err.code || err.details?.code;
      const errorMessage = err.message || 'Error al iniciar sesión';

      switch (errorCode) {
        case 'UNVERIFIED_ACCOUNT':
        case 'EMAIL_NOT_VERIFIED':
          // Usuario no verificado
          Alert.alert(
            'Cuenta no verificada',
            'Tu cuenta no ha sido verificada. ¿Deseas que reenviemos el correo de verificación?',
            [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Reenviar correo',
                onPress: async () => {
                  try {
                    await authService.resendVerificationEmail(email.trim());
                    Alert.alert(
                      'Correo enviado',
                      'Se ha reenviado el correo de verificación. Revisa tu bandeja de entrada.'
                    );
                  } catch (error: any) {
                    Alert.alert('Error', error.message || 'No se pudo reenviar el correo');
                  }
                },
              },
            ]
          );
          break;

        case 'ACCOUNT_DISABLED':
        case 'ACCOUNT_SUSPENDED':
          // Usuario desactivado
          Alert.alert(
            'Cuenta desactivada',
            'Tu cuenta ha sido desactivada. Por favor, contacta con soporte para más información.',
            [{ text: 'OK' }]
          );
          // Registrar evento disabled_account
          // analyticsService.track('disabled_account', { email: email.trim() });
          break;

        case 'ACCOUNT_LOCKED':
          // Cuenta bloqueada por intentos fallidos
          const lockDuration = err.details?.lockDuration || 10;
          const lockedUntil = err.details?.lockedUntil;
          
          if (lockedUntil) {
            const lockDate = new Date(lockedUntil);
            setIsLocked(true);
            setLockUntil(lockDate);
            setLockTimeRemaining(Math.floor((lockDate.getTime() - new Date().getTime()) / 1000));
            
            await AsyncStorage.setItem('@login_lock', JSON.stringify({ until: lockedUntil }));
          }
          
          Alert.alert(
            'Cuenta bloqueada',
            `Has excedido el número máximo de intentos. Tu cuenta está bloqueada por ${lockDuration} minutos.`
          );
          // Registrar evento locked_account
          // analyticsService.track('locked_account', { email: email.trim() });
          break;

        case 'RATE_LIMIT_EXCEEDED':
          // Rate limit
          const retryAfter = err.details?.retryAfter || 60;
          Alert.alert(
            'Demasiados intentos',
            `Has realizado demasiadas solicitudes. Intenta nuevamente en ${retryAfter} segundos.`
          );
          break;

        case 'INVALID_CREDENTIALS':
        case 'UNAUTHORIZED':
        default:
          // Credenciales inválidas - mensaje genérico
          Alert.alert('Error de inicio de sesión', 'Email o contraseña incorrectos.');
          break;
      }
    }
  };

  const displayError = error?.message;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title} accessibilityRole="header">Iniciar Sesión</Text>
          <Text style={styles.subtitle} accessibilityRole="text">
            Bienvenido de nuevo
          </Text>

          {isLocked && (
            <View style={styles.lockContainer}>
              <Text style={styles.lockText}>
                Tu cuenta está bloqueada temporalmente.
              </Text>
              <Text style={styles.lockTimer}>
                Intenta nuevamente en: {formatTime(lockTimeRemaining)}
              </Text>
            </View>
          )}

          {displayError && !isLocked && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{displayError}</Text>
            </View>
          )}

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Email <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  touched.email && errors.email && styles.inputError,
                ]}
                placeholder="tu@email.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={(text) => handleFieldChange('email', text)}
                onBlur={() => handleBlur('email')}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading && !isLocked}
                accessibilityLabel="Campo de email"
                accessibilityHint="Ingresa tu dirección de correo electrónico"
              />
              {touched.email && errors.email && (
                <Text style={styles.fieldError} accessibilityRole="alert">
                  {errors.email}
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Contraseña <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  touched.password && errors.password && styles.inputError,
                ]}
                placeholder="••••••••"
                placeholderTextColor="#999"
                value={password}
                onChangeText={(text) => handleFieldChange('password', text)}
                onBlur={() => handleBlur('password')}
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading && !isLocked}
                accessibilityLabel="Campo de contraseña"
                accessibilityHint="Ingresa tu contraseña"
              />
              {touched.password && errors.password && (
                <Text style={styles.fieldError} accessibilityRole="alert">
                  {errors.password}
                </Text>
              )}
            </View>

            <View style={styles.rememberMeContainer}>
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                disabled={isLoading || isLocked}
                accessibilityLabel="Recordar sesión"
                accessibilityHint="Activa esta opción para mantener tu sesión iniciada por 7 días"
              />
              <Text style={styles.rememberMeText}>Recordar sesión</Text>
            </View>

            <TouchableOpacity
              style={[styles.button, (isLoading || isLocked) && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading || isLocked}
              accessibilityRole="button"
              accessibilityLabel="Botón de inicio de sesión"
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() => navigation?.navigate('ForgotPassword')}
              disabled={isLoading || isLocked}
              accessibilityRole="button"
              accessibilityLabel="Olvidé mi contraseña"
            >
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            {navigation && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => navigation.navigate('Register')}
                disabled={isLoading || isLocked}
                accessibilityRole="button"
                accessibilityLabel="Ir a registro"
              >
                <Text style={styles.linkText}>
                  ¿No tienes cuenta? <Text style={styles.linkTextBold}>Regístrate</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#dc3545',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  fieldError: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  rememberMeText: {
    fontSize: 14,
    color: '#333',
  },
  errorContainer: {
    backgroundColor: '#fee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fcc',
  },
  errorText: {
    color: '#c33',
    fontSize: 14,
    textAlign: 'center',
  },
  lockContainer: {
    backgroundColor: '#fff3cd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  lockText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  lockTimer: {
    color: '#856404',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#666',
  },
  linkTextBold: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
