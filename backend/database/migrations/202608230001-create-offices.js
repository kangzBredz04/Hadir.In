'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(
            async (transaction) => {
                await queryInterface.createTable(
                    'offices',
                    {
                        id: {
                            type: Sequelize.UUID,
                            allowNull: false,
                            primaryKey: true
                        },

                        name: {
                            type: Sequelize.STRING(150),
                            allowNull: false
                        },

                        address: {
                            type: Sequelize.TEXT,
                            allowNull: false
                        },

                        latitude: {
                            type: Sequelize.DECIMAL(10, 7),
                            allowNull: false
                        },

                        longitude: {
                            type: Sequelize.DECIMAL(10, 7),
                            allowNull: false
                        },

                        radius_meter: {
                            type: Sequelize.INTEGER,
                            allowNull: false
                        },

                        is_active: {
                            type: Sequelize.BOOLEAN,
                            allowNull: false,
                            defaultValue: true
                        },

                        created_at: {
                            type: Sequelize.DATE,
                            allowNull: false,
                            defaultValue:
                                Sequelize.literal(
                                    'CURRENT_TIMESTAMP'
                                )
                        },

                        updated_at: {
                            type: Sequelize.DATE,
                            allowNull: false,
                            defaultValue:
                                Sequelize.literal(
                                    'CURRENT_TIMESTAMP'
                                )
                        }
                    },
                    {
                        transaction
                    }
                );

                await queryInterface.addIndex(
                    'offices',
                    ['is_active'],
                    {
                        name: 'offices_is_active_idx',
                        transaction
                    }
                );

                await queryInterface.sequelize.query(
                    `
                    ALTER TABLE "offices"
                    ADD CONSTRAINT "offices_latitude_range_check"
                    CHECK ("latitude" >= -90 AND "latitude" <= 90)
                    `,
                    {
                        transaction
                    }
                );

                await queryInterface.sequelize.query(
                    `
                    ALTER TABLE "offices"
                    ADD CONSTRAINT "offices_longitude_range_check"
                    CHECK ("longitude" >= -180 AND "longitude" <= 180)
                    `,
                    {
                        transaction
                    }
                );

                await queryInterface.sequelize.query(
                    `
                    ALTER TABLE "offices"
                    ADD CONSTRAINT "offices_radius_positive_check"
                    CHECK ("radius_meter" > 0)
                    `,
                    {
                        transaction
                    }
                );
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable(
            'offices'
        );
    }
};