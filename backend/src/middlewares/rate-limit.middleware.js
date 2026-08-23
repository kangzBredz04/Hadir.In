import rateLimit from 'express-rate-limit';

const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    limit: 5,

    standardHeaders: 'draft-8',

    legacyHeaders: false,

    skipSuccessfulRequests: true,

    handler: (req, res) => {
        return res.status(429).json({
            success: false,

            message:
                'Terlalu banyak percobaan login. Silakan coba lagi nanti.',

            errors: []
        });
    }
});

export {
    loginRateLimiter
};