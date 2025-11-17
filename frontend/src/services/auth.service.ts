import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password })
    return response.data.data
  },

  async logout() {
    try {
      await api.post('/auth/logout')
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

