import env from '../config/env.js';

const getDateInTimezone = (
    date = new Date(),
    timeZone = env.appTimezone
) => {
    const formatter =
        new Intl.DateTimeFormat(
            'en-US',
            {
                timeZone,

                year:
                    'numeric',

                month:
                    '2-digit',

                day:
                    '2-digit'
            }
        );

    const parts =
        formatter.formatToParts(
            date
        );

    const values = {};

    for (const part of parts) {
        if (
            part.type !== 'literal'
        ) {
            values[part.type] =
                part.value;
        }
    }

    return [
        values.year,
        values.month,
        values.day
    ].join('-');
};

export {
    getDateInTimezone
};