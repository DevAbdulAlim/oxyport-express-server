import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const checkAdminRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Ensure that req.user exists and has a 'role' property
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: User does not have admin privileges.',
      });
    }
  } catch (error) {
    console.error('Error while checking admin role:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
