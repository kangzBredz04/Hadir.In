import {
    Router
} from 'express';

import {
    login
} from '../controllers/auth.controller.js';

import {
    validateLogin
} from '../middlewares/validation.middleware.js';

import {
    loginRateLimiter
} from '../middlewares/rate-limit.middleware.js';

const router = Router();

router.post(
    '/login',

    loginRateLimiter,

    validateLogin,

    login
);

export default router;