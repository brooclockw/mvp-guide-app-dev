import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import supabase from '../lib/supabase'
import type { User as SupabaseUser, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { UserProfile, UserRole, UserStatus } from '@backoffice-guide/shared'

interface AuthContextType {
  user: UserProfile | null
  session: Session | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Función para obtener el perfil del usuario
  const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<UserProfile | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error al obtener perfil:', error)
      }

      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        role: (profile?.role as UserRole) || UserRole.USUARIO_FINAL,
        status: UserStatus.ACTIVE,
        createdAt: supabaseUser.created_at || new Date().toISOString(),
        updatedAt: supabaseUser.updated_at || new Date().toISOString(),
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        phoneNumber: profile?.phoneNumber,
        avatarUrl: profile?.avatarUrl
      }
    } catch (error) {
      console.error('Error al obtener perfil:', error)
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        role: UserRole.USUARIO_FINAL,
        status: UserStatus.ACTIVE,
        createdAt: supabaseUser.created_at || new Date().toISOString(),
        updatedAt: supabaseUser.updated_at || new Date().toISOString()
      }
    }
  }

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        fetchUserProfile(session.user).then(setUser)
      }
      setIsLoading(false)
    })

    // Escuchar cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      setSession(session)
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user)
        setUser(userProfile)
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        const userProfile = await fetchUserProfile(data.user)
        setUser(userProfile)
        setSession(data.session)
      }
    } catch (error: any) {
      throw new Error(error.message || 'Error al iniciar sesión')
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setSession(null)
    } catch (error: any) {
      throw new Error(error.message || 'Error al cerrar sesión')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        login,
        logout,
        isLoading,
        isAuthenticated: !!user && !!session,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

