const APP_TIMEZONE =
    'Asia/Jakarta';

export function formatTime(
    value,
    fallback = '--:--'
) {
    if (!value) {
        return fallback;
    }

    const date =
        new Date(value);

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
            timeZone:
                APP_TIMEZONE,

            hour:
                '2-digit',

            minute:
                '2-digit',

            hour12:
                false
        }
    ).format(date);
}

export function getGreeting() {
    const hourText =
        new Intl.DateTimeFormat(
            'en-US',
            {
                timeZone:
                    APP_TIMEZONE,

                hour:
                    '2-digit',

                hour12:
                    false
            }
        ).format(
            new Date()
        );

    const hour =
        Number(hourText) % 24;

    if (hour < 11) {
        return 'Selamat pagi';
    }

    if (hour < 15) {
        return 'Selamat siang';
    }

    if (hour < 18) {
        return 'Selamat sore';
    }

    return 'Selamat malam';
}