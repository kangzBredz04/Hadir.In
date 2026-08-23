const successResponse = (
    res,
    {
        statusCode = 200,
        message = 'Request berhasil',
        data = null
    }
) => {
    return res
        .status(statusCode)
        .json({
            success: true,
            message,
            data
        });
};

export {
    successResponse
};