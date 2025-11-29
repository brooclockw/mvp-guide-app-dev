import supabase from '../lib/supabase';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  AuthError,
  VerifyOTPRequest,
  VerifyOTPResponse,
  ResendOTPRequest,
  ResendOTPResponse,
  User,
} from '@backoffice-guide/shared';
import { UserRole, UserStatus } from '@backoffice-guide/shared';

/**
 * Función auxiliar para obtener el perfil del usuario desde Supabase
 */
const fetchUserProfile = async (supabaseUser: any): Promise<User> => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

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

/**
 * Servicio de autenticación usando Supabase
 */
class AuthService {
  /**
   * Inicia sesión con email y contraseña
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        const authError: AuthError = {
          code: error.status?.toString() || 'LOGIN_ERROR',
          message: error.message || 'Error al iniciar sesión',
          details: error,
        };
        throw authError;
      }

      if (!data.user || !data.session) {
        throw new Error('No se recibieron datos de usuario o sesión');
      }

      const user = await fetchUserProfile(data.user);

      return {
        user,
        token: data.session.access_token,
        expiresIn: data.session.expires_in || 3600,
      };
    } catch (error: any) {
      const authError: AuthError = {
        code: error.code || 'LOGIN_ERROR',
        message: error.message || 'Error al iniciar sesión',
        details: error.details || error,
      };
      throw authError;
    }
  }

  /**
   * Registra un nuevo usuario
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
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
        throw authErr;
      }

      if (!authData.user) {
        throw new Error('No se recibieron datos de usuario');
      }

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
        status: UserStatus.UNVERIFIED,
      });

      if (profileError) {
        console.error('Error al crear perfil:', profileError);
        // No lanzar error aquí, el usuario ya está registrado en Auth
      }

      const user = await fetchUserProfile(authData.user);

      return {
        user,
        token: authData.session?.access_token || '',
      };
    } catch (error: any) {
      const authError: AuthError = {
        code: error.code || 'REGISTER_ERROR',
        message: error.message || 'Error al registrar usuario',
        details: error.details || error,
      };
      throw authError;
    }
  }

  /**
   * Cierra sesión
   */
  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error al cerrar sesión:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  /**
   * Obtiene la información del usuario actual
   */
  async getCurrentUser(): Promise<User> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      return await fetchUserProfile(user);
    } catch (error: any) {
      const authError: AuthError = {
        code: 'GET_USER_ERROR',
        message: error.message || 'Error al obtener información del usuario',
        details: error,
      };
      throw authError;
    }
  }

  /**
   * Verifica si hay un token guardado (usuario autenticado)
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch {
      return false;
    }
  }

  /**
   * Solicita restablecimiento de contraseña
   */
  async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'guide://reset-password', // Deep link para la app
      });

      if (error) {
        const authError: AuthError = {
          code: 'RESET_PASSWORD_ERROR',
          message: error.message || 'Error al solicitar restablecimiento de contraseña',
          details: error,
        };
        throw authError;
      }
    } catch (error: any) {
      const authError: AuthError = {
        code: 'RESET_PASSWORD_ERROR',
        message: error.message || 'Error al solicitar restablecimiento de contraseña',
        details: error,
      };
      throw authError;
    }
  }

  /**
   * Verifica código OTP para MFA
   * Nota: Supabase maneja OTP automáticamente en el flujo de verificación de email
   */
  async verifyOTP(request: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    try {
      // Supabase usa verifyOtp para verificar códigos de email
      // Si no se proporciona email, intentamos obtenerlo del usuario actual
      let email = request.email;
      if (!email) {
        const { data: { user } } = await supabase.auth.getUser();
        email = user?.email || undefined;
      }

      if (!email) {
        throw new Error('Email requerido para verificar el código OTP');
      }

      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: request.otp,
        type: 'email',
      });

      if (error) {
        const authError: AuthError = {
          code: 'OTP_VERIFICATION_ERROR',
          message: error.message || 'El código ingresado no es válido',
          details: error,
        };
        throw authError;
      }

      if (!data.user || !data.session) {
        throw new Error('No se recibieron datos de usuario o sesión');
      }

      const user = await fetchUserProfile(data.user);

      return {
        user,
        token: data.session.access_token,
        expiresIn: data.session.expires_in || 3600,
      };
    } catch (error: any) {
      const authError: AuthError = {
        code: error.code || 'OTP_VERIFICATION_ERROR',
        message: error.message || 'El código ingresado no es válido',
        details: error.details || error,
      };
      throw authError;
    }
  }

  /**
   * Reenvía código OTP
   * Nota: Para Supabase, necesitamos el email del usuario actual o de la sesión
   */
  async resendOTP(request: ResendOTPRequest): Promise<ResendOTPResponse> {
    try {
      // Obtener el usuario actual para reenviar el código
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.email) {
        throw new Error('No se pudo obtener el email del usuario');
      }

      // Supabase usa resend para reenviar códigos de verificación
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

      if (error) {
        const authError: AuthError = {
          code: 'RESEND_OTP_ERROR',
          message: error.message || 'No se pudo reenviar el código. Intenta nuevamente.',
          details: error,
        };
        throw authError;
      }

      return {
        challengeId: request.challengeId || '',
        message: 'Código reenviado exitosamente',
      };
    } catch (error: any) {
      const authError: AuthError = {
        code: error.code || 'RESEND_OTP_ERROR',
        message: error.message || 'No se pudo reenviar el código. Intenta nuevamente.',
        details: error.details || error,
      };
      throw authError;
    }
  }

  /**
   * Reenvía correo de verificación
   */
  async resendVerificationEmail(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        const authError: AuthError = {
          code: 'RESEND_VERIFICATION_ERROR',
          message: error.message || 'No se pudo reenviar el correo de verificación',
          details: error,
        };
        throw authError;
      }
    } catch (error: any) {
      const authError: AuthError = {
        code: 'RESEND_VERIFICATION_ERROR',
        message: error.message || 'No se pudo reenviar el correo de verificación',
        details: error,
      };
      throw authError;
    }
  }
}

export const authService = new AuthService();
export default authService;
