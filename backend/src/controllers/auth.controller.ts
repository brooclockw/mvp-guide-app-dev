import { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { AuthRequest } from '../middleware/auth.middleware';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email y contraseña son requeridos'
      });
    }

    // Autenticar con Supabase
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return res.status(401).json({
        status: 'error',
        message: error?.message || 'Credenciales inválidas'
      });
    }

    // Obtener información adicional del usuario desde la base de datos
    // Nota: Puedes crear una tabla 'profiles' en Supabase para almacenar roles y otros datos
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    res.json({
      status: 'success',
      data: {
        token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        user: {
          id: data.user.id,
          email: data.user.email,
          role: profile?.role || 'user',
          name: profile?.name || data.user.email?.split('@')[0] || 'Usuario'
        }
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al iniciar sesión'
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      // Invalidar sesión en Supabase
      await supabaseAdmin.auth.signOut(token);
    }

    res.json({
      status: 'success',
      message: 'Sesión cerrada exitosamente'
    });
  } catch (error) {
    res.json({
      status: 'success',
      message: 'Sesión cerrada exitosamente'
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        status: 'error',
        message: 'Refresh token es requerido'
      });
    }

    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token
    });

    if (error || !data.session) {
      return res.status(401).json({
        status: 'error',
        message: error?.message || 'Token de refresco inválido'
      });
    }

    res.json({
      status: 'success',
      data: {
        token: data.session.access_token,
        refresh_token: data.session.refresh_token
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al refrescar token'
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'No autenticado'
      });
    }

    // Obtener usuario de Supabase
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(req.user.id);

    if (userError || !userData.user) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
    }

    // Obtener perfil adicional
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    res.json({
      status: 'success',
      data: {
        id: userData.user.id,
        email: userData.user.email,
        role: profile?.role || 'user',
        name: profile?.name || userData.user.email?.split('@')[0] || 'Usuario'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener información del usuario'
    });
  }
};

