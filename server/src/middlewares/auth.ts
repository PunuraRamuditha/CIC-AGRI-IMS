import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        email: string;
        role: string;
        department: string;
        name: string;
      };
    }
  }
}

interface JwtPayload {
  userId: number;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

// JWT Authentication Middleware
export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from cookies
    const token = req.cookies?.token;
    
    if (!token) {
      res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    // Get user from database to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        department: true,
        name: true,
        status: true
      }
    });

    if (!user || user.status !== 'active') {
      res.status(401).json({ 
        success: false, 
        message: 'User not found or inactive.' 
      });
      return;
    }

    // Attach user to request object
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      department: user.department,
      name: user.name
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
      return;
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        success: false, 
        message: 'Token expired.' 
      });
      return;
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error.' 
    });
  }
};

// Role-based authorization middleware
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required.' 
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        success: false, 
        message: 'Access denied. Insufficient permissions.' 
      });
      return;
    }

    next();
  };
};

// Department-based authorization middleware
export const authorizeDepartment = (...allowedDepartments: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required.' 
      });
      return;
    }

    if (!allowedDepartments.includes(req.user.department)) {
      res.status(403).json({ 
        success: false, 
        message: 'Access denied. Department not authorized.' 
      });
      return;
    }

    next();
  };
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies?.token;
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          department: true,
          name: true,
          status: true
        }
      });

      if (user && user.status === 'active') {
        req.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          department: user.department,
          name: user.name
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};