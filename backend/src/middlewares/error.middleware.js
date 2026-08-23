const notFoundHandler = (req, res) => {
    return res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} tidak ditemukan`,
        errors: []
    });
};

const errorHandler = (err, req, res, next) => {
    console.error(err);

    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message:
            statusCode === 500
                ? 'Terjadi kesalahan pada server'
                : err.message,
        errors: err.errors || []
    });
};

export {
    notFoundHandler,
    errorHandler
};