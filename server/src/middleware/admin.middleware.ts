import { Request, Response, NextFunction } from 'express';

// Assuming your authentication middleware attaches a user with a "role" property.
export const adminMiddleware = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  if (!req.user || (req.user as any).role !== 'admin') {
    res.status(403).json({ message: 'Admin access required' });
    return; // Do not return the response—simply exit.
  }
  next();
};
