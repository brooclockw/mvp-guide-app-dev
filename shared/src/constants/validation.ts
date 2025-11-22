export const VALIDATION_RULES = {
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "El email no es válido",
  },
  PASSWORD: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message:
      "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
  },
  PHONE: {
    pattern: /^\+?[\d\s-()]+$/,
    message: "El número de teléfono no es válido",
  },
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;
