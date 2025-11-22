import { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { AuthRequest } from '../middleware/auth.middleware';
import { ApiResponse, LoginRequest, LoginResponse, User, UserRole, UserStatus } from '@backoffice-guide/shared';

export const login = async (req: Request<{}, ApiResponse<LoginResponse>, LoginRequest>, res: Response<ApiResponse<LoginResponse>>) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email y contraseña son requeridos'
        }
      });
    }

    // Autenticar con Supabase
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: error?.message || 'Credenciales inválidas'
        }
      });
    }

    // Obtener información adicional del usuario desde la base de datos
    // Nota: Puedes crear una tabla 'profiles' en Supabase para almacenar roles y otros datos
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const user: User = {
      id: data.user.id,
      email: data.user.email || '',
      role: (profile?.role as UserRole) || UserRole.USUARIO_FINAL,
      status: UserStatus.ACTIVE,
      createdAt: data.user.created_at || new Date().toISOString(),
      updatedAt: data.user.updated_at || new Date().toISOString()
    };

    const response: ApiResponse<LoginResponse> = {
      success: true,
      data: {
        user,
        token: data.session?.access_token || '',
        expiresIn: data.session?.expires_in || 3600
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al iniciar sesión'
      }
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      // Invalidar la sesión usando el JWT token
      // La API de administración signOut espera un JWT token como primer parámetro
      await supabaseAdmin.auth.admin.signOut(token);
    }

    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  } catch (error) {
    // Aún así respondemos con éxito, ya que el logout del frontend ya se ejecutó
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Refresh token es requerido'
        }
      });
    }

    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token
    });

    if (error || !data.session) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: error?.message || 'Token de refresco inválido'
        }
      });
    }

    res.json({
      success: true,
      data: {
        token: data.session.access_token,
        refresh_token: data.session.refresh_token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al refrescar token'
      }
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: 'No autenticado'
        }
      });
    }

    // Obtener usuario de Supabase
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(req.user.id);

    if (userError || !userData.user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Usuario no encontrado'
        }
      });
    }

    // Obtener perfil adicional
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al obtener información del usuario'
      }
    });
  }
};

