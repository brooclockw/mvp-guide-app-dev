import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/auth.middleware';

// TODO: Reemplazar con base de datos real
const mockUsers = [
  {
    id: '1',
    email: 'admin@turismo.com',
    password: '$2a$10$rOzJqKJ5QKqKqKqKqKqKqO5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y', // password: admin123
    role: 'admin',
    name: 'Administrador'
  }
];

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email y contraseña son requeridos'
      });
    }

    // TODO: Buscar usuario en base de datos
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas'
      });
    }

    // TODO: Verificar contraseña con bcrypt
    // const isValidPassword = await bcrypt.compare(password, user.password);
    // if (!isValidPassword) {
    //   return res.status(401).json({
    //     status: 'error',
    //     message: 'Credenciales inválidas'
    //   });
    // }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      status: 'success',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al iniciar sesión'
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  // TODO: Invalidar token en base de datos si se usa blacklist
  res.json({
    status: 'success',
    message: 'Sesión cerrada exitosamente'
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  // TODO: Implementar refresh token
  res.status(501).json({
    status: 'error',
    message: 'Funcionalidad en desarrollo'
  });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'No autenticado'
      });
    }

    // TODO: Buscar usuario completo en base de datos
    const user = mockUsers.find(u => u.id === req.user!.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      status: 'success',
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener información del usuario'
    });
  }
};

