import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    // TODO: Obtener datos reales de la base de datos
    const stats = {
      totalSales: 125000,
      totalBookings: 342,
      activeTours: 28,
      totalCustomers: 156,
      monthlyGrowth: 12.5,
      bookingGrowth: 8.3
    };

    res.json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener estadísticas'
    });
  }
};

export const getSalesChart = async (req: AuthRequest, res: Response) => {
  try {
    // TODO: Obtener datos reales de la base de datos
    const { period = 'month' } = req.query;
    
    const salesData = {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      data: [25000, 28000, 32000, 29000, 35000, 38000]
    };

    res.json({
      status: 'success',
      data: salesData
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener datos de ventas'
    });
  }
};

export const getRecentActivity = async (req: AuthRequest, res: Response) => {
  try {
    // TODO: Obtener datos reales de la base de datos
    const activities = [
      {
        id: '1',
        type: 'booking',
        message: 'Nueva reserva #1234',
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        type: 'customer',
        message: 'Nuevo cliente registrado',
        timestamp: new Date().toISOString()
      },
      {
        id: '3',
        type: 'tour',
        message: 'Tour actualizado: Machu Picchu',
        timestamp: new Date().toISOString()
      }
    ];

    res.json({
      status: 'success',
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener actividad reciente'
    });
  }
};

