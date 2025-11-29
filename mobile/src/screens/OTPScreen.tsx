import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';
import { authService } from '../services/auth.service';
import type { VerifyOTPRequest, ResendOTPRequest } from '@backoffice-guide/shared';

interface OTPScreenProps {
  route?: {
    params?: {
      challengeId: string;
      email: string;
    };
  };
  navigation?: any;
}

const OTP_LENGTH = 6;
const MAX_ATTEMPTS = 5;
const OTP_TTL_MINUTES = 10;

export const OTPScreen: React.FC<OTPScreenProps> = ({ route, navigation }) => {
  const challengeId = route?.params?.challengeId || '';
  const email = route?.params?.email || '';
  
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(MAX_ATTEMPTS);
  const [isBlocked, setIsBlocked] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(OTP_TTL_MINUTES * 60); // en segundos
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Timer para TTL del OTP
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (value: string, index: number) => {
    // Solo permitir números
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Solo el último carácter
    setOtp(newOtp);

    // Auto-focus al siguiente campo
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== OTP_LENGTH) {
      Alert.alert('Error', 'Por favor, ingresa el código completo de 6 dígitos');
      return;
    }

    if (isBlocked || attemptsRemaining <= 0) {
      Alert.alert('Bloqueado', 'Has excedido el número máximo de intentos. Por favor, solicita un nuevo código.');
      return;
    }

    setIsLoading(true);
    try {
      const request: VerifyOTPRequest = {
        challengeId,
        otp: otpString,
        email,
      };

      const response = await authService.verifyOTP(request);
      
      // Login exitoso, navegar a selección de ciudad
      if (navigation) {
        navigation.replace('CitySelection');
      }
    } catch (error: any) {
      const remaining = attemptsRemaining - 1;
      setAttemptsRemaining(remaining);

      if (remaining <= 0) {
        setIsBlocked(true);
        Alert.alert(
          'Código bloqueado',
          'Has excedido el número máximo de intentos. Por favor, solicita un nuevo código.',
          [
            {
              text: 'Reenviar código',
              onPress: handleResendOTP,
            },
          ]
        );
      } else {
        Alert.alert(
          'Código incorrecto',
          `El código ingresado no es válido. Te quedan ${remaining} intentos.`
        );
        // Limpiar campos
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      const request: ResendOTPRequest = { challengeId };
      await authService.resendOTP(request);
      
      // Resetear estado
      setOtp(Array(OTP_LENGTH).fill(''));
      setAttemptsRemaining(MAX_ATTEMPTS);
      setIsBlocked(false);
      setTimeRemaining(OTP_TTL_MINUTES * 60);
      setCanResend(false);
      inputRefs.current[0]?.focus();
      
      Alert.alert('Código reenviado', 'Se ha enviado un nuevo código a tu correo electrónico.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo reenviar el código. Intenta nuevamente.');
    } finally {
      setIsResending(false);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Verificación de código</Text>
        <Text style={styles.subtitle}>
          Ingresa el código de 6 dígitos que enviamos a{'\n'}
          <Text style={styles.email}>{email}</Text>
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              style={[styles.otpInput, digit && styles.otpInputFilled]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!isLoading && !isBlocked}
              accessibilityLabel={`Campo ${index + 1} del código de verificación`}
            />
          ))}
        </View>

        {timeRemaining > 0 && (
          <Text style={styles.timerText}>
            El código expira en: {formatTime(timeRemaining)}
          </Text>
        )}

        {attemptsRemaining < MAX_ATTEMPTS && attemptsRemaining > 0 && (
          <Text style={styles.attemptsText}>
            Intentos restantes: {attemptsRemaining}
          </Text>
        )}

        {isBlocked && (
          <View style={styles.blockedContainer}>
            <Text style={styles.blockedText}>
              Has excedido el número máximo de intentos.
            </Text>
            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendOTP}
              disabled={isResending}
            >
              {isResending ? (
                <ActivityIndicator color="#007AFF" />
              ) : (
                <Text style={styles.resendButtonText}>Solicitar nuevo código</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            (!isOtpComplete || isLoading || isBlocked) && styles.buttonDisabled,
          ]}
          onPress={handleVerifyOTP}
          disabled={!isOtpComplete || isLoading || isBlocked}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verificar código</Text>
          )}
        </TouchableOpacity>

        {canResend && !isBlocked && (
          <TouchableOpacity
            style={styles.linkButton}
            onPress={handleResendOTP}
            disabled={isResending}
          >
            {isResending ? (
              <ActivityIndicator color="#007AFF" />
            ) : (
              <Text style={styles.linkText}>Reenviar código</Text>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
          disabled={isLoading}
        >
          <Text style={styles.backButtonText}>Volver al inicio de sesión</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
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
  email: {
    fontWeight: '600',
    color: '#007AFF',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  otpInput: {
    flex: 1,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  otpInputFilled: {
    borderColor: '#007AFF',
  },
  timerText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
  },
  attemptsText: {
    textAlign: 'center',
    color: '#dc3545',
    fontSize: 14,
    marginBottom: 16,
    fontWeight: '600',
  },
  blockedContainer: {
    backgroundColor: '#fee',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fcc',
  },
  blockedText: {
    color: '#c33',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
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
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  resendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  resendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    color: '#666',
  },
});

