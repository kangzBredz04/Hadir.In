const normalizePagination = ({
    page,
    limit,
    defaultLimit = 10,
    maxLimit = 100
}) => {
    const parsedPage =
        Number.parseInt(page, 10);

    const parsedLimit =
        Number.parseInt(limit, 10);

    const safePage =
        Number.isInteger(parsedPage) &&
            parsedPage > 0
            ? parsedPage
            : 1;

    const safeLimit =
        Number.isInteger(parsedLimit) &&
            parsedLimit > 0
            ? Math.min(
                parsedLimit,
                maxLimit
            )
            : defaultLimit;

    return {
        page:
            safePage,

        limit:
            safeLimit,

        offset:
            (safePage - 1) *
            safeLimit
    };
};

const buildPagination = ({
    page,
    limit,
    total
}) => {
    return {
        page,

        limit,

        total,

        totalPages:
            total === 0
                ? 0
                : Math.ceil(
                    total / limit
                )
    };
};

export {
    normalizePagination,
    buildPagination
};