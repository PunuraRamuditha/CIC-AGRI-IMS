import { Router } from 'express';
import {login, refreshToken, logout, getProfile, changePassword } from '../controllers/authController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// Public routes
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// Protected routes
router.post('/logout', authenticateToken, logout);
router.get('/profile', authenticateToken, getProfile);
router.put('/change-password', authenticateToken, changePassword);

export default router;
