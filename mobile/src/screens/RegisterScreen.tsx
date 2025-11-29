import React, { useState } from 'react';
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
  Linking,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validateName,
  validateUsername,
  validateDNI,
  validateBirthDate,
  validateGender,
  validateTermsAcceptance,
} from '../utils/validation';

export const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { register, error, clearError, isLoading } = useAuth();
  
  // Campos requeridos
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Campos opcionales
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [dni, setDni] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  
  // Estados de validación
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showGenderPicker, setShowGenderPicker] = useState(false);

  /**
   * Valida un campo específico
   */
  const validateField = (fieldName: string, value: string) => {
    let result;
    
    switch (fieldName) {
      case 'email':
        result = validateEmail(value);
        break;
      case 'password':
        result = validatePassword(value, true);
        break;
      case 'passwordConfirmation':
        result = validatePasswordConfirmation(password, value);
        break;
      case 'firstName':
        result = validateName(value, 'Nombre');
        break;
      case 'lastName':
        result = validateName(value, 'Apellido');
        break;
      case 'username':
        result = validateUsername(value);
        break;
      case 'dni':
        result = validateDNI(value);
        break;
      case 'birthDate':
        result = validateBirthDate(value);
        break;
      case 'gender':
        result = validateGender(value);
        break;
      default:
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

  /**
   * Maneja el cambio de un campo
   */
  const handleFieldChange = (fieldName: string, value: string) => {
    // Actualizar el valor
    switch (fieldName) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        // Si cambia la contraseña, revalidar la confirmación
        if (touched.passwordConfirmation) {
          validateField('passwordConfirmation', passwordConfirmation);
        }
        break;
      case 'passwordConfirmation':
        setPasswordConfirmation(value);
        break;
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'username':
        setUsername(value);
        break;
      case 'dni':
        setDni(value);
        break;
      case 'birthDate':
        setBirthDate(value);
        break;
      case 'gender':
        setGender(value);
        break;
    }

    // Limpiar errores del contexto
    clearError();

    // Si el campo ya fue tocado, validar en tiempo real
    if (touched[fieldName]) {
      validateField(fieldName, value);
    }
  };

  /**
   * Marca un campo como tocado
   */
  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const value = 
      fieldName === 'email' ? email :
      fieldName === 'password' ? password :
      fieldName === 'passwordConfirmation' ? passwordConfirmation :
      fieldName === 'firstName' ? firstName :
      fieldName === 'lastName' ? lastName :
      fieldName === 'username' ? username :
      fieldName === 'dni' ? dni :
      fieldName === 'birthDate' ? birthDate :
      fieldName === 'gender' ? gender : '';
    validateField(fieldName, value);
  };

  /**
   * Valida todos los campos antes de enviar
   */
  const validateAll = (): boolean => {
    // Marcar todos como tocados
    const allFields = ['email', 'password', 'passwordConfirmation', 'firstName', 'lastName', 'username', 'dni', 'birthDate', 'gender'];
    allFields.forEach((field) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
    });

    // Validar términos
    const termsResult = validateTermsAcceptance(termsAccepted);
    if (!termsResult.isValid) {
      setErrors((prev) => ({ ...prev, terms: termsResult.error || '' }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.terms;
        return newErrors;
      });
    }

    // Validar todos los campos
    const emailValid = validateField('email', email);
    const passwordValid = validateField('password', password);
    const passwordConfirmationValid = validateField('passwordConfirmation', passwordConfirmation);
    const firstNameValid = validateField('firstName', firstName);
    const lastNameValid = validateField('lastName', lastName);
    const usernameValid = validateField('username', username);
    const dniValid = validateField('dni', dni);
    const birthDateValid = validateField('birthDate', birthDate);
    const genderValid = validateField('gender', gender);

    return emailValid && passwordValid && passwordConfirmationValid && 
           firstNameValid && lastNameValid && usernameValid && dniValid && 
           birthDateValid && genderValid && termsResult.isValid;
  };

  /**
   * Maneja el registro
   */
  const handleRegister = async () => {
    // Validar todos los campos (esto marca todos como tocados)
    if (!validateAll()) {
      // Verificar si hay campos requeridos vacíos para mostrar mensaje específico
      const requiredFieldsEmpty = [];
      if (!email || email.trim().length === 0) requiredFieldsEmpty.push('Email');
      if (!password || password.length === 0) requiredFieldsEmpty.push('Contraseña');
      if (!passwordConfirmation || passwordConfirmation.length === 0) requiredFieldsEmpty.push('Confirmar Contraseña');
      if (!termsAccepted) requiredFieldsEmpty.push('Términos y Condiciones');

      if (requiredFieldsEmpty.length > 0) {
        Alert.alert(
          'Campos obligatorios incompletos',
          `Por favor, completa los siguientes campos obligatorios: ${requiredFieldsEmpty.join(', ')}`
        );
      } else {
        Alert.alert('Error de validación', 'Por favor, corrige los errores en el formulario');
      }
      return;
    }

    try {
      clearError();
      setErrors({});
      
      const registerData = {
        email: email.trim(),
        password,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      };

      await register(registerData);
      
      // Navegar a pantalla de bienvenida del Onboarding según criterios de aceptación
      if (navigation) {
        navigation.replace('OnboardingWelcome');
      }
    } catch (err: any) {
      // Manejar diferentes tipos de errores según los criterios de aceptación
      const errorCode = err.code || err.details?.code;
      const errorMessage = err.message || 'Error al registrar usuario';

      // Error específico: email ya registrado
      if (errorCode === 'EMAIL_ALREADY_EXISTS' || errorMessage.includes('ya está registrado') || errorMessage.includes('already exists')) {
        setErrors((prev) => ({ ...prev, email: 'El email ya está registrado.' }));
        Alert.alert('Error', 'El email ya está registrado.');
        return;
      }

      // Otros errores
      Alert.alert('Error', errorMessage);
    }
  };

  /**
   * Abre los términos y condiciones en modal
   */
  const openTerms = () => {
    if (navigation) {
      navigation.navigate('TermsAndConditions');
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
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Regístrate para comenzar</Text>

          {displayError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{displayError}</Text>
            </View>
          )}

          <View style={styles.form}>
            {/* Información sobre campos requeridos y opcionales */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                <Text style={styles.required}>*</Text> Campos obligatorios
              </Text>
              <Text style={styles.infoText}>
                Los campos marcados con <Text style={styles.optional}>(Opcional)</Text> no son necesarios para completar el registro
              </Text>
            </View>

            {/* Campos opcionales */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Nombre <Text style={styles.optional}>(Opcional)</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  touched.firstName && errors.firstName && styles.inputError,
                ]}
                placeholder="Tu nombre"
                placeholderTextColor="#999"
                value={firstName}
                onChangeText={(text) => handleFieldChange('firstName', text)}
                onBlur={() => handleBlur('firstName')}
                autoCapitalize="words"
                editable={!isLoading}
                accessibilityLabel="Campo de nombre"
              />
              {touched.firstName && errors.firstName && (
                <Text style={styles.fieldError}>{errors.firstName}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Apellido <Text style={styles.optional}>(Opcional)</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  touched.lastName && errors.lastName && styles.inputError,
                ]}
                placeholder="Tu apellido"
                placeholderTextColor="#999"
                value={lastName}
                onChangeText={(text) => handleFieldChange('lastName', text)}
                onBlur={() => handleBlur('lastName')}
                autoCapitalize="words"
                editable={!isLoading}
                accessibilityLabel="Campo de apellido"
              />
              {touched.lastName && errors.lastName && (
                <Text style={styles.fieldError}>{errors.lastName}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Nombre de usuario <Text style={styles.optional}>(Opcional)</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  touched.username && errors.username && styles.inputError,
                ]}
                placeholder="Tu nombre de usuario"
                placeholderTextColor="#999"
                value={username}
                onChangeText={(text) => handleFieldChange('username', text)}
                onBlur={() => handleBlur('username')}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                accessibilityLabel="Campo de nombre de usuario"
              />
              {touched.username && errors.username && (
                <Text style={styles.fieldError}>{errors.username}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                DNI <Text style={styles.optional}>(Opcional)</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  touched.dni && errors.dni && styles.inputError,
                ]}
                placeholder="12345678"
                placeholderTextColor="#999"
                value={dni}
                onChangeText={(text) => handleFieldChange('dni', text)}
                onBlur={() => handleBlur('dni')}
                keyboardType="default"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                accessibilityLabel="Campo de DNI"
              />
              {touched.dni && errors.dni && (
                <Text style={styles.fieldError}>{errors.dni}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Sexo <Text style={styles.optional}>(Opcional)</Text>
              </Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  styles.pickerButton,
                  touched.gender && errors.gender && styles.inputError,
                ]}
                onPress={() => setShowGenderPicker(!showGenderPicker)}
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel="Seleccionar sexo"
              >
                <Text style={[styles.pickerText, !gender && styles.pickerPlaceholder]}>
                  {gender 
                    ? gender === 'prefiero_no_especificar' ? 'Prefiero no especificar'
                    : gender === 'masculino' ? 'Masculino'
                    : gender === 'femenino' ? 'Femenino'
                    : gender === 'no_binario' ? 'No-binario'
                    : gender
                    : 'Selecciona una opción'}
                </Text>
                <Text style={styles.pickerArrow}>▼</Text>
              </TouchableOpacity>
              {showGenderPicker && (
                <View style={styles.pickerOptions}>
                  {[
                    { value: 'prefiero_no_especificar', label: 'Prefiero no especificar' },
                    { value: 'masculino', label: 'Masculino' },
                    { value: 'femenino', label: 'Femenino' },
                    { value: 'no_binario', label: 'No-binario' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.pickerOption,
                        gender === option.value && styles.pickerOptionSelected,
                      ]}
                      onPress={() => {
                        const newGender = option.value;
                        setGender(newGender);
                        setShowGenderPicker(false);
                        setTouched((prev) => ({ ...prev, gender: true }));
                        validateField('gender', newGender);
                      }}
                    >
                      <Text
                        style={[
                          styles.pickerOptionText,
                          gender === option.value && styles.pickerOptionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {touched.gender && errors.gender && (
                <Text style={styles.fieldError}>{errors.gender}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Fecha de nacimiento <Text style={styles.optional}>(Opcional)</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  touched.birthDate && errors.birthDate && styles.inputError,
                ]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#999"
                value={birthDate}
                onChangeText={(text) => handleFieldChange('birthDate', text)}
                onBlur={() => handleBlur('birthDate')}
                keyboardType="default"
                editable={!isLoading}
                accessibilityLabel="Campo de fecha de nacimiento"
                accessibilityHint="Formato: AAAA-MM-DD"
              />
              {touched.birthDate && errors.birthDate && (
                <Text style={styles.fieldError}>{errors.birthDate}</Text>
              )}
              <Text style={styles.helpText}>
                Formato: AAAA-MM-DD (debe tener al menos 16 años)
              </Text>
            </View>

            {/* Campos requeridos */}
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
                editable={!isLoading}
              />
              {touched.email && errors.email && (
                <Text style={styles.fieldError}>{errors.email}</Text>
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
                placeholder="Mínimo 8 caracteres"
                placeholderTextColor="#999"
                value={password}
                onChangeText={(text) => handleFieldChange('password', text)}
                onBlur={() => handleBlur('password')}
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              {touched.password && errors.password && (
                <Text style={styles.fieldError}>{errors.password}</Text>
              )}
              <Text style={styles.helpText}>
                Debe contener al menos 8 caracteres, una mayúscula, un número y un carácter especial
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Confirmar Contraseña <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  touched.passwordConfirmation && errors.passwordConfirmation && styles.inputError,
                ]}
                placeholder="Repite tu contraseña"
                placeholderTextColor="#999"
                value={passwordConfirmation}
                onChangeText={(text) => handleFieldChange('passwordConfirmation', text)}
                onBlur={() => handleBlur('passwordConfirmation')}
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              {touched.passwordConfirmation && errors.passwordConfirmation && (
                <Text style={styles.fieldError}>{errors.passwordConfirmation}</Text>
              )}
            </View>

            {/* Términos y condiciones */}
            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setTermsAccepted(!termsAccepted)}
                disabled={isLoading}
              >
                <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                  {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.termsText}>
                  Acepto los{' '}
                  <Text style={styles.termsLink} onPress={openTerms}>
                    términos y condiciones
                  </Text>
                  {' '}y la{' '}
                  <Text style={styles.termsLink} onPress={openTerms}>
                    política de privacidad
                  </Text>
                  {' '}<Text style={styles.required}>*</Text>
                </Text>
              </TouchableOpacity>
              {errors.terms && (
                <Text style={styles.fieldError}>{errors.terms}</Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Crear Cuenta</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate('Login')}
              disabled={isLoading}
            >
              <Text style={styles.linkText}>
                ¿Ya tienes cuenta? <Text style={styles.linkTextBold}>Inicia sesión</Text>
              </Text>
            </TouchableOpacity>
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
    padding: 20,
    paddingTop: 40,
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
  optional: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'normal',
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
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 12,
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  pickerPlaceholder: {
    color: '#999',
  },
  pickerArrow: {
    fontSize: 12,
    color: '#666',
  },
  pickerOptions: {
    marginTop: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pickerOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerOptionSelected: {
    backgroundColor: '#f0f7ff',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#333',
  },
  pickerOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  helpText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  infoContainer: {
    backgroundColor: '#f0f7ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#cce7ff',
  },
  infoText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
    marginBottom: 4,
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
  termsContainer: {
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  termsLink: {
    color: '#007AFF',
    textDecorationLine: 'underline',
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
    color: '#666',
  },
  linkTextBold: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

