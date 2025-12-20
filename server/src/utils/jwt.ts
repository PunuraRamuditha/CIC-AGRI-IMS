// import jwt from 'jsonwebtoken';

// export interface TokenPayload {
//   userId: number;
//   username: string;
//   role: string;
//   department: string;
// }

// // Generate JWT token
// export const generateToken = (payload: TokenPayload): string => {
//   return jwt.sign(payload, process.env.JWT_SECRET!, {
//     expiresIn: process.env.JWT_EXPIRES_IN || '7d', // Default to 7 days
//     issuer: process.env.JWT_ISSUER || 'cic-ims',
//     audience: process.env.JWT_AUDIENCE || 'cic-ims-users'
//   });
// };

// // Generate refresh token
// export const generateRefreshToken = (payload: TokenPayload): string => {
//   return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!, {
//     expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '1d', // Default to 30 days
//     issuer: process.env.JWT_ISSUER || 'cic-ims',
//     audience: process.env.JWT_AUDIENCE || 'cic-ims-users'
//   });
// };

// // Verify JWT token
// export const verifyToken = (token: string): any => {
//   return jwt.verify(token, process.env.JWT_SECRET!);
// };

// // Verify refresh token
// export const verifyRefreshToken = (token: string): any => {
//   return jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!);
// };

// // Extract token payload without verification (for debugging)
// export const decodeToken = (token: string): any => {
//   return jwt.decode(token);
// };

import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export interface TokenPayload {
  userId: number;
  username: string;
  role: string;
  department: string;
}

/* ============================
   ENV NORMALIZATION
============================ */

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET =
  (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET) as string;

const JWT_ISSUER: string | undefined = process.env.JWT_ISSUER || undefined;
const JWT_AUDIENCE: string | undefined = process.env.JWT_AUDIENCE || undefined;

/* ============================
   SIGN OPTIONS
============================ */

const SIGN_OPTIONS: SignOptions = {
  issuer: JWT_ISSUER,
  audience: JWT_AUDIENCE
};

/* ============================
   TOKEN GENERATION
============================ */

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    ...SIGN_OPTIONS,
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn']
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    ...SIGN_OPTIONS,
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '30d') as SignOptions['expiresIn']
  });
};

/* ============================
   TOKEN VERIFICATION
============================ */

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET, {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE
  }) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET, {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE
  }) as JwtPayload;
};

/* ============================
   DECODE (NO VERIFY)
============================ */

export const decodeToken = (token: string): JwtPayload | null => {
  return jwt.decode(token) as JwtPayload | null;
};
