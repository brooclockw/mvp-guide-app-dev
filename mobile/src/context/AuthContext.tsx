import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import supabase from '../lib/supabase';
import type { User as SupabaseUser, Session, AuthChangeEvent } from '@supabase/supabase-js';
import type { User, LoginRequest, RegisterRequest, AuthError } from '@backoffice-guide/shared';
import { UserRole, UserStatus } from '@backoffice-guide/shared';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  error: AuthError | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Función para obtener el perfil del usuario desde Supabase
 */
const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
  try {
    // Intentar obtener el perfil desde la tabla profiles
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned (perfil no existe aún)
      console.error('Error al obtener perfil:', error);
    }

    // Mapear datos de Supabase a nuestro tipo User
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      role: (profile?.role as UserRole) || UserRole.USUARIO_FINAL,
      status: (profile?.status as UserStatus) || UserStatus.ACTIVE,
      createdAt: supabaseUser.created_at || new Date().toISOString(),
      updatedAt: supabaseUser.updated_at || new Date().toISOString(),
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      username: profile?.username,
      dni: profile?.dni,
      gender: profile?.gender,
      birthDate: profile?.birthDate,
    };
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    // Retornar usuario básico si no se puede obtener el perfil
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      role: UserRole.USUARIO_FINAL,
      status: UserStatus.ACTIVE,
      createdAt: supabaseUser.created_at || new Date().toISOString(),
      updatedAt: supabaseUser.updated_at || new Date().toISOString(),
    };
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  /**
   * Verifica si el usuario está autenticado al cargar la app
   */
  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user).then(setUser);
      }
      setIsLoading(false);
    });

    // Escuchar cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user);
        setUser(userProfile);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) {
        const authErr: AuthError = {
          code: authError.status?.toString() || 'LOGIN_ERROR',
          message: authError.message || 'Error al iniciar sesión',
          details: authError,
        };
        setError(authErr);
        throw authErr;
      }

      if (data.user && data.session) {
        const userProfile = await fetchUserProfile(data.user);
        setUser(userProfile);
        setSession(data.session);
      }
    } catch (err: any) {
      const authError: AuthError = {
        code: err.code || 'LOGIN_ERROR',
        message: err.message || 'Error al iniciar sesión',
        details: err.details || err,
      };
      setError(authError);
      throw authError;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      // Registrar usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            dni: data.dni,
            gender: data.gender,
            birthDate: data.birthDate,
          },
        },
      });

      if (authError) {
        const authErr: AuthError = {
          code: authError.status?.toString() || 'REGISTER_ERROR',
          message: authError.message || 'Error al registrar usuario',
          details: authError,
        };
        setError(authErr);
        throw authErr;
      }

      // Si el usuario se registró exitosamente, crear perfil en la tabla profiles
      if (authData.user) {
        // Crear perfil en la tabla profiles
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          dni: data.dni,
          gender: data.gender,
          birthDate: data.birthDate,
          role: UserRole.USUARIO_FINAL,
          status: UserStatus.UNVERIFIED, // Usuario no verificado hasta que confirme email
        });

        if (profileError) {
          console.error('Error al crear perfil:', profileError);
          // No lanzar error aquí, el usuario ya está registrado en Auth
        }

        // Obtener perfil completo
        const userProfile = await fetchUserProfile(authData.user);
        setUser(userProfile);
        setSession(authData.session);
      }
    } catch (err: any) {
      const authError: AuthError = {
        code: err.code || 'REGISTER_ERROR',
        message: err.message || 'Error al registrar usuario',
        details: err.details || err,
      };
      setError(authError);
      throw authError;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error: authError } = await supabase.auth.signOut();
      if (authError) {
        console.error('Error al cerrar sesión:', authError);
      }
      setUser(null);
      setSession(null);
      setError(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Aún así, limpiar el estado local
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user && !!session,
    login,
    register,
    logout,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook para usar el contexto de autenticación
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
