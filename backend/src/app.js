import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import routes from './routes/index.routes.js';

import openApiSpec from './docs/openapi.js';

import {
    notFoundHandler,
    errorHandler
} from './middlewares/error.middleware.js';

const app = express();

/*
 * Vercel reverse proxy
 */
app.set(
    'trust proxy',
    1
);

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

/*
 * ==============================
 * API DOCUMENTATION
 * ==============================
 */

app.get(
    '/openapi.json',
    (req, res) => {
        return res.json(
            openApiSpec
        );
    }
);

app.use(
    '/api-docs',

    swaggerUi.serve,

    swaggerUi.setup(
        openApiSpec,
        {
            customSiteTitle:
                'Hadir.In API Documentation',

            swaggerOptions: {
                persistAuthorization:
                    true
            }
        }
    )
);

/*
 * ==============================
 * RATE LIMIT
 * ==============================
 */

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

            errors: []
        }
    });

app.use(
    '/api',
    apiLimiter
);

/*
 * ==============================
 * API ROUTES
 * ==============================
 */

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