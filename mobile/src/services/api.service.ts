import { API_URL, API_TIMEOUT, API_HEADERS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';

/**
 * Servicio base para realizar peticiones HTTP
 */
class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_URL;
    this.timeout = API_TIMEOUT;
  }

  /**
   * Obtiene el token de autenticación almacenado
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error obteniendo token:', error);
      return null;
    }
  }

  /**
   * Guarda el token de autenticación
   */
  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error guardando token:', error);
      throw error;
    }
  }

  /**
   * Elimina el token de autenticación
   */
  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error eliminando token:', error);
      throw error;
    }
  }

  /**
   * Construye los headers con autenticación si existe token
   */
  private async buildHeaders(customHeaders?: Record<string, string>): Promise<HeadersInit> {
    const token = await this.getToken();
    const headers: Record<string, string> = {
      ...API_HEADERS,
      ...customHeaders,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Realiza una petición HTTP
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.buildHeaders(options.headers as Record<string, string>);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Si la respuesta no es exitosa, lanzar error
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `Error ${response.status}: ${response.statusText}`,
        }));
        throw new Error(errorData.message || 'Error en la petición');
      }

      // Si la respuesta está vacía, retornar null
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return null as T;
      }

      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('La petición tardó demasiado tiempo');
      }

      if (error.message) {
        throw error;
      }

      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers,
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers,
    });
  }
}

export const apiService = new ApiService();
export default apiService;

