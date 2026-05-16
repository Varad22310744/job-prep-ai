import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import { getDashboardData } from './dashboard.service';

export const getDashboard = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const data = await getDashboardData(req.userId!);
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};