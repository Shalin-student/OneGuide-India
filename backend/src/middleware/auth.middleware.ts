import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../modules/users/user.model';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    res.status(401).json({ status: 'error', message: 'Not authorized to access this route' });
    return;
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Not authorized to access this route' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        status: 'error',
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
      return;
    }
    next();
  };
};

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next();
  }
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = await User.findById(decoded.id).select('-password');
  } catch (error) {
    // Ignore verification errors for optional auth
  }
  next();
};
