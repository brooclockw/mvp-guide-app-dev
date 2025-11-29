import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// Variables de entorno para Supabase
// En Expo, las variables deben empezar con EXPO_PUBLIC_ para estar disponibles en el cliente
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() || '';

// Validar que las variables estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('EXPO_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('EXPO_PUBLIC_SUPABASE_ANON_KEY');

  const errorMessage = 
    `❌ Faltan variables de entorno de Supabase: ${missingVars.join(', ')}\n\n` +
    `📝 Para solucionarlo:\n` +
    `1. Crea un archivo .env en la carpeta mobile/ con:\n` +
    `   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co\n` +
    `   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here\n\n` +
    `2. Obtén estos valores desde tu proyecto de Supabase:\n` +
    `   - Ve a Settings > API en tu proyecto de Supabase\n` +
    `   - Copia la URL del proyecto y la Anon/Public key\n\n` +
    `3. Reinicia el servidor de Expo después de crear/editar .env\n` +
    `   npm start -- --clear`;

  console.error(errorMessage);
  throw new Error(errorMessage);
}

// Validar formato de URL
if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  throw new Error(
    `❌ EXPO_PUBLIC_SUPABASE_URL debe ser una URL válida (debe empezar con http:// o https://)\n` +
    `   Valor actual: "${supabaseUrl}"`
  );
}

// Custom storage adapter para React Native usando SecureStore
const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error obteniendo item de SecureStore:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error guardando item en SecureStore:', error);
      throw error;
    }
  },
  removeItem: async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error eliminando item de SecureStore:', error);
      throw error;
    }
  },
};

// Crear cliente de Supabase con almacenamiento seguro
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // No necesario en React Native
  },
});

export default supabase;

