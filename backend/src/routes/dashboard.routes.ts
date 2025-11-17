import express from 'express';
import { getStats, getSalesChart, getRecentActivity } from '../controllers/dashboard.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

router.get('/stats', getStats);
router.get('/sales-chart', getSalesChart);
router.get('/recent-activity', getRecentActivity);

export default router;

