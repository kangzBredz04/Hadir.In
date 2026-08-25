const APP_TIMEZONE =
    'Asia/Jakarta';

export function formatDate(
    value,
    fallback = '-'
) {
    if (!value) {
        return fallback;
    }

    const parts =
        String(value)
            .split('-')
            .map(Number);

    if (
        parts.length !== 3 ||
        parts.some(
            value =>
                !Number.isFinite(value)
        )
    ) {
        return fallback;
    }

    const [
        year,
        month,
        day
    ] = parts;

    const date =
        new Date(
            year,
            month - 1,
            day
        );

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

    const parts =
        String(value)
            .split('-')
            .map(Number);

    if (
        parts.length !== 3
    ) {
        return fallback;
    }

    const [
        year,
        month,
        day
    ] = parts;

    const date =
        new Date(
            year,
            month - 1,
            day
        );

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

export function getTodayDate() {
    const parts =
        new Intl.DateTimeFormat(
            'en-US',
            {
                timeZone:
                    APP_TIMEZONE,

                year:
                    'numeric',

                month:
                    '2-digit',

                day:
                    '2-digit'
            }
        ).formatToParts(
            new Date()
        );

    const values =
        Object.fromEntries(
            parts.map(
                part => [
                    part.type,
                    part.value
                ]
            )
        );

    return [
        values.year,
        values.month,
        values.day
    ].join('-');
}