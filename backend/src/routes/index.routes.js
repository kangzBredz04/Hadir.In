import {
    Router
} from 'express';

import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import adminRoutes from './admin.routes.js';
import attendanceRoutes from './attendance.routes.js';
import { apiLimiter } from '../middlewares/rate-limit.middleware.js';

const router = Router();

router.get(
    '/health',
    (req, res) => {
        return res
            .status(200)
            .json({
                success: true,

                message:
                    'Attendance API is running',

                data: {
                    status:
                        'UP',

                    timestamp:
                        new Date()
                            .toISOString()
                }
            });
    }
);

router.use(
    '/auth',
    authRoutes,
    apiLimiter
);

router.use(
    '/users',
    userRoutes,
    apiLimiter
);

router.use(
    '/attendance',
    attendanceRoutes,
    apiLimiter
);

router.use(
    '/admin',
    adminRoutes,
    apiLimiter
);

export default router;