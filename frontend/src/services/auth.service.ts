import axios from 'axios'
import supabase from '../lib/supabase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token de Supabase a las peticiones
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

export const authService = {
  // Nota: El login ahora se maneja directamente con Supabase en AuthContext
  // Estos métodos son para compatibilidad o llamadas adicionales al backend
  
  async logout() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        await api.post('/auth/logout')
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  },

  async getMe() {
    const response = await api.get('/auth/me')
    return response.data.data
  },
}

export default api

