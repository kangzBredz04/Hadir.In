export function formatDate(
    value,
    fallback = '-'
) {
    if (!value) {
        return fallback;
    }

    const date =
        new Date(
            `${value}T00:00:00`
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return fallback;
    }

    return new Intl.DateTimeFormat(
        'id-ID',
        {
            day:
                '2-digit',

            month:
                'long',

            year:
                'numeric'
        }
    ).format(date);
}

export function formatShortDate(
    value,
    fallback = '-'
) {
    if (!value) {
        return fallback;
    }

    const date =
        new Date(
            `${value}T00:00:00`
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return fallback;
    }

    return new Intl.DateTimeFormat(
        'id-ID',
        {
            weekday:
                'long',

            day:
                'numeric',

            month:
                'long'
        }
    ).format(date);
}