import {
    Router
} from 'express';

import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import adminRoutes from './admin.routes.js';
import attendanceRoutes from './attendance.routes.js';

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
    authRoutes
);

router.use(
    '/users',
    userRoutes
);

router.use(
    '/attendance',
    attendanceRoutes
);

router.use(
    '/admin',
    adminRoutes
);

export default router;