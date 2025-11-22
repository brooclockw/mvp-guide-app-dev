import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { User, UserRole, UserStatus } from '@backoffice-guide/shared';

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      status: 'error', 
      message: 'Token de acceso requerido' 
    });
  }

  try {
    // Verificar token con Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(403).json({ 
        status: 'error', 
        message: 'Token inválido o expirado' 
      });
    }

    // Obtener perfil con rol
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    req.user = {
      id: user.id,
      email: user.email || '',
      role: (profile?.role as UserRole) || UserRole.USUARIO_FINAL,
      status: UserStatus.ACTIVE,
      createdAt: user.created_at || new Date().toISOString(),
      updatedAt: user.updated_at || new Date().toISOString()
    };
    
    next();
  } catch (error) {
    return res.status(403).json({ 
      status: 'error', 
      message: 'Token inválido o expirado' 
    });
  }
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'No autenticado' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        status: 'error', 
        message: 'Permisos insuficientes' 
      });
    }

    next();
  };
};

