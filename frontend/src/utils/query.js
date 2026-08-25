export function buildQueryString(
    values = {}
) {
    const params =
        new URLSearchParams();

    Object.entries(
        values
    ).forEach(
        ([key, value]) => {
            if (
                value === undefined ||
                value === null ||
                value === ''
            ) {
                return;
            }

            params.set(
                key,
                String(value)
            );
        }
    );

    const query =
        params.toString();

    return query
        ? `?${query}`
        : '';
}