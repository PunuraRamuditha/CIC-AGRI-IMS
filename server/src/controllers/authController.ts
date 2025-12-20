import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { sendResponse } from '../utils/response';

const prisma = new PrismaClient();

interface LoginRequest {
  username: string;
  password: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

// Login controller
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password }: LoginRequest = req.body;

    if (!username || !password) {
      sendResponse(res, 400, false, 'Username and password are required', null);
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email: username }],
        status: 'active'
      }
    });

    if (!user) {
      sendResponse(res, 401, false, 'Invalid credentials', null);
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      sendResponse(res, 401, false, 'Invalid credentials', null);
      return;
    }

    const tokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      department: user.department
    };

    const token = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    sendResponse(res, 200, true, 'Login successful', {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    sendResponse(res, 500, false, 'Internal server error', null);
  }
};


// Logout controller
export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Clear cookies
    res.clearCookie('token');
    res.clearCookie('refreshToken');

    sendResponse(res, 200, true, 'Logout successful', null);
  } catch (error) {
    console.error('Logout error:', error);
    sendResponse(res, 500, false, 'Internal server error', null);
  }
};

// Refresh token controller
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken }: RefreshTokenRequest = req.body;

    if (!refreshToken) {
      sendResponse(res, 401, false, 'Refresh token required', null);
      return;
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Find user to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        role: true,
        department: true,
        status: true
      }
    });

    if (!user || user.status !== 'active') {
      sendResponse(res, 401, false, 'Invalid refresh token', null);
      return;
    }

    // Generate new tokens
    const tokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      department: user.department
    };

    const newToken = generateToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    // Set new cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    };

    const refreshCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/'
    };

    res.cookie('token', newToken, cookieOptions);
    res.cookie('refreshToken', newRefreshToken, refreshCookieOptions);

    sendResponse(res, 200, true, 'Token refreshed successfully', {
      token: newToken
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    sendResponse(res, 401, false, 'Invalid refresh token', null);
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendResponse(res, 401, false, 'Authentication required', null);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        department: true,
        status: true,
        phone: true,
        joinDate: true,
        lastLogin: true,
        permissions: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      sendResponse(res, 404, false, 'User not found', null);
      return;
    }

    sendResponse(res, 200, true, 'Profile retrieved successfully', user);

  } catch (error) {
    console.error('Get profile error:', error);
    sendResponse(res, 500, false, 'Internal server error', null);
  }
};

// Change password
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendResponse(res, 401, false, 'Authentication required', null);
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      sendResponse(res, 400, false, 'Current password and new password are required', null);
      return;
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      sendResponse(res, 404, false, 'User not found', null);
      return;
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      sendResponse(res, 400, false, 'Current password is incorrect', null);
      return;
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedNewPassword }
    });

    sendResponse(res, 200, true, 'Password changed successfully', null);

  } catch (error) {
    console.error('Change password error:', error);
    sendResponse(res, 500, false, 'Internal server error', null);
  }
};