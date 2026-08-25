import crypto from 'node:crypto';

export function requestLogger(
    req,
    res,
    next
) {
    const startedAt =
        Date.now();

    const requestId =
        req.headers[
        'x-vercel-id'
        ] ??
        crypto.randomUUID();

    res.on(
        'finish',
        () => {
            const durationMs =
                Date.now() -
                startedAt;

            console.log(
                '[API]',
                {
                    requestId,

                    method:
                        req.method,

                    path:
                        req.originalUrl,

                    status:
                        res.statusCode,

                    durationMs
                }
            );
        }
    );

    next();
}