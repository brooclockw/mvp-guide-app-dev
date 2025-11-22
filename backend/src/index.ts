// Cargar variables de entorno PRIMERO, antes de cualquier otra importación
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { API_ROUTES, API_BASE_PATHS } from '@backoffice-guide/shared';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import dashboardRoutes from './routes/dashboard.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get(API_ROUTES.HEALTH, (req, res) => {
  res.json({ status: 'OK', message: 'Backoffice Turismo API is running' });
});

app.use(API_BASE_PATHS.AUTH, authRoutes);
app.use(API_BASE_PATHS.DASHBOARD, dashboardRoutes);

// Error handler
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}/api`);
});

export default app;

