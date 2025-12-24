/**
 * Utilidades de validación de campos
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Valida formato de email
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim().length === 0) {
    return {
      isValid: false,
      error: 'Este campo es obligatorio',
    };
  }

  // Validar longitud máxima (70 caracteres según criterios de aceptación)
  if (email.length > 70) {
    return {
      isValid: false,
      error: 'El email no debe superar los 70 caracteres',
    };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return {
      isValid: false,
      error: 'Por favor, ingrese un email válido',
    };
  }

  return { isValid: true };
};

/**
 * Valida contraseña
 * Según criterios de aceptación E01-H02:
 * - Al menos 8 caracteres
 * - Al menos una letra mayúscula
 * - Al menos un número
 * - Al menos un carácter especial
 */
export const validatePassword = (password: string, isRegister = false): ValidationResult => {
  if (!password || password.length === 0) {
    return {
      isValid: false,
      error: 'Este campo es obligatorio',
    };
  }

  // Para registro, validaciones más estrictas según criterios de aceptación
  if (isRegister) {
    // Validar longitud mínima
    if (password.length < 8) {
      return {
        isValid: false,
        error: 'La contraseña debe tener al menos 8 caracteres',
      };
    }

    // Validar longitud máxima
    if (password.length > 128) {
      return {
        isValid: false,
        error: 'La contraseña no puede exceder 128 caracteres',
      };
    }

    // Validar que tenga al menos una letra mayúscula
    const hasUpperCase = /[A-Z]/.test(password);
    if (!hasUpperCase) {
      return {
        isValid: false,
        error: 'La contraseña debe contener al menos una letra mayúscula',
      };
    }

    // Validar que tenga al menos un número
    const hasNumber = /[0-9]/.test(password);
    if (!hasNumber) {
      return {
        isValid: false,
        error: 'La contraseña debe contener al menos un número',
      };
    }

    // Validar que tenga al menos un carácter especial
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    if (!hasSpecialChar) {
      return {
        isValid: false,
        error: 'La contraseña debe contener al menos un carácter especial',
      };
    }
  } else {
    // Para login, solo verificar que no esté vacía
    if (password.length < 1) {
      return {
        isValid: false,
        error: 'La contraseña es requerida',
      };
    }
  }

  return { isValid: true };
};

/**
 * Valida confirmación de contraseña
 */
export const validatePasswordConfirmation = (
  password: string,
  confirmation: string
): ValidationResult => {
  if (!confirmation || confirmation.length === 0) {
    return {
      isValid: false,
      error: 'Este campo es obligatorio',
    };
  }

  if (password !== confirmation) {
    return {
      isValid: false,
      error: 'Las contraseñas no coinciden',
    };
  }

  return { isValid: true };
};

/**
 * Valida nombre, nombre de usuario y apellido
 * Según criterios de aceptación E03-H02: 3-50 caracteres
 */
export const validateName = (name: string, fieldName = 'Nombre'): ValidationResult => {
  // Si está vacío, es válido (campo opcional)
  if (!name || name.trim().length === 0) {
    return { isValid: true };
  }

  // Si se proporciona, validar longitud según criterios
  if (name.trim().length < 3) {
    return {
      isValid: false,
      error: `${fieldName} debe tener al menos 3 caracteres`,
    };
  }

  if (name.length > 50) {
    return {
      isValid: false,
      error: `${fieldName} no puede exceder 50 caracteres`,
    };
  }

  // Validar que solo contenga letras, espacios y algunos caracteres especiales
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/;
  if (!nameRegex.test(name.trim())) {
    return {
      isValid: false,
      error: `${fieldName} solo puede contener letras, espacios y guiones`,
    };
  }

  return { isValid: true };
};

/**
 * Valida nombre de usuario
 * Según criterios de aceptación E03-H02: 3-50 caracteres
 */
export const validateUsername = (username: string): ValidationResult => {
  // Si está vacío, es válido (campo opcional)
  if (!username || username.trim().length === 0) {
    return { isValid: true };
  }

  // Validar longitud según criterios
  if (username.trim().length < 3) {
    return {
      isValid: false,
      error: 'El nombre de usuario debe tener al menos 3 caracteres',
    };
  }

  if (username.length > 50) {
    return {
      isValid: false,
      error: 'El nombre de usuario no puede exceder 50 caracteres',
    };
  }

  return { isValid: true };
};

/**
 * Valida DNI
 * Según criterios de aceptación E03-H02: 6-13 caracteres
 */
export const validateDNI = (dni: string): ValidationResult => {
  // Si está vacío, es válido (campo opcional)
  if (!dni || dni.trim().length === 0) {
    return { isValid: true };
  }

  // Validar longitud según criterios
  if (dni.trim().length < 6) {
    return {
      isValid: false,
      error: 'El DNI debe tener al menos 6 caracteres',
    };
  }

  if (dni.length > 13) {
    return {
      isValid: false,
      error: 'El DNI no puede exceder 13 caracteres',
    };
  }

  // Validar que solo contenga números y letras
  const dniRegex = /^[a-zA-Z0-9]+$/;
  if (!dniRegex.test(dni.trim())) {
    return {
      isValid: false,
      error: 'El DNI solo puede contener números y letras',
    };
  }

  return { isValid: true };
};

/**
 * Valida fecha de nacimiento y edad mínima
 * Según criterios de aceptación E03-H02: edad mínima de 16 años
 */
export const validateBirthDate = (birthDate: string): ValidationResult => {
  // Si está vacío, es válido (campo opcional)
  if (!birthDate || birthDate.trim().length === 0) {
    return { isValid: true };
  }

  const date = new Date(birthDate);
  const today = new Date();
  
  // Validar que sea una fecha válida
  if (isNaN(date.getTime())) {
    return {
      isValid: false,
      error: 'Por favor, ingrese una fecha válida',
    };
  }

  // Validar que no sea una fecha futura
  if (date > today) {
    return {
      isValid: false,
      error: 'La fecha de nacimiento no puede ser futura',
    };
  }

  // Calcular edad
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  const dayDiff = today.getDate() - date.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  // Validar edad mínima de 16 años
  if (age < 16) {
    return {
      isValid: false,
      error: 'No se permite el registro de usuarios menores de 16 años',
    };
  }

  return { isValid: true };
};

/**
 * Valida campo Sexo
 * Según criterios de aceptación E03-H02: opciones específicas
 */
export const validateGender = (gender: string): ValidationResult => {
  // Si está vacío, es válido (campo opcional)
  if (!gender || gender.trim().length === 0) {
    return { isValid: true };
  }

  const validGenders = ['prefiero_no_especificar', 'masculino', 'femenino', 'no_binario'];
  
  if (!validGenders.includes(gender)) {
    return {
      isValid: false,
      error: 'Por favor, seleccione una opción válida',
    };
  }

  return { isValid: true };
};

/**
 * Valida aceptación de términos y condiciones
 * Según criterios de aceptación E02-H02: mensaje claro y visible
 */
export const validateTermsAcceptance = (accepted: boolean): ValidationResult => {
  if (!accepted) {
    return {
      isValid: false,
      error: 'Es necesario aceptar los Términos y Condiciones y la Política de Privacidad para proceder con el registro',
    };
  }

  return { isValid: true };
};

/**
 * Valida un campo genérico
 */
export const validateField = (
  value: string,
  rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    customValidator?: (value: string) => ValidationResult;
  }
): ValidationResult => {
  // Validar requerido
  if (rules.required && (!value || value.trim().length === 0)) {
    return {
      isValid: false,
      error: 'Este campo es requerido',
    };
  }

  // Si no es requerido y está vacío, es válido
  if (!rules.required && (!value || value.trim().length === 0)) {
    return { isValid: true };
  }

  // Validar longitud mínima
  if (rules.minLength && value.length < rules.minLength) {
    return {
      isValid: false,
      error: `Este campo debe tener al menos ${rules.minLength} caracteres`,
    };
  }

  // Validar longitud máxima
  if (rules.maxLength && value.length > rules.maxLength) {
    return {
      isValid: false,
      error: `Este campo no puede exceder ${rules.maxLength} caracteres`,
    };
  }

  // Validar patrón
  if (rules.pattern && !rules.pattern.test(value)) {
    return {
      isValid: false,
      error: 'El formato de este campo no es válido',
    };
  }

  // Validación personalizada
  if (rules.customValidator) {
    return rules.customValidator(value);
  }

  return { isValid: true };
};

