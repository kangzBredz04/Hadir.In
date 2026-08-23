import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import routes from './routes/index.routes.js';

import {
    notFoundHandler,
    errorHandler
} from './middlewares/error.middleware.js';

const app = express();

app.use(
    helmet()
);

app.use(
    cors({
        origin: true,
        credentials: true
    })
);

app.use(
    express.json({
        limit: '1mb'
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: '1mb'
    })
);

const apiLimiter =
    rateLimit({
        windowMs:
            15 * 60 * 1000,

        limit:
            100,

        standardHeaders:
            'draft-8',

        legacyHeaders:
            false,

        message: {
            success:
                false,

            message:
                'Terlalu banyak request. Silakan coba lagi nanti.',

            errors:
                []
        }
    });

app.use(
    '/api',
    apiLimiter
);

app.use(
    '/api',
    routes
);

app.use(
    notFoundHandler
);

app.use(
    errorHandler
);

export default app;