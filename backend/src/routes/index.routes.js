import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Attendance API is running',
        data: {
            status: 'UP',
            timestamp: new Date().toISOString()
        }
    });
});

export default router;