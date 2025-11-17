import express from 'express';
import { login, logout, getMe, refreshToken } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.get('/me', authenticateToken, getMe);

export default router;

