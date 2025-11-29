/**
 * Configuración de la API
 */
import { ENV } from './env';

// URL base de la API
// Para desarrollo con dispositivo físico, usar la IP de tu máquina
// Ejemplo: 'http://192.168.1.100:3000'
// Para emulador Android: 'http://10.0.2.2:3000'
// Para emulador iOS: 'http://localhost:3000'
export const API_URL = ENV.API_URL;

export const API_TIMEOUT = 30000; // 30 segundos

export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};
