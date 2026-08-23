'use strict';

const OFFICE_ID =
    '11111111-1111-4111-8111-111111111111';

module.exports = {
    async up(queryInterface) {
        const now = new Date();

        await queryInterface.bulkInsert(
            'offices',
            [
                {
                    id: OFFICE_ID,

                    name: 'Kantor Pusat Hadir.In',

                    address:
                        'Jakarta, Indonesia',

                    latitude: -6.2000000,

                    longitude: 106.8166667,

                    radius_meter: 100,

                    is_active: true,

                    created_at: now,

                    updated_at: now
                }
            ]
        );
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete(
            'offices',
            {
                id: OFFICE_ID
            }
        );
    }
};