/**
 * Configuración de variables de entorno
 */

export const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  IS_DEV: __DEV__,
} as const;

