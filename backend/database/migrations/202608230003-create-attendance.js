'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(
            async (transaction) => {
                await queryInterface.createTable(
                    'attendance',
                    {
                        id: {
                            type: Sequelize.UUID,
                            allowNull: false,
                            primaryKey: true
                        },

                        user_id: {
                            type: Sequelize.UUID,
                            allowNull: false,

                            references: {
                                model: 'users',
                                key: 'id'
                            },

                            onUpdate: 'CASCADE',

                            onDelete: 'RESTRICT'
                        },

                        office_id: {
                            type: Sequelize.UUID,
                            allowNull: false,

                            references: {
                                model: 'offices',
                                key: 'id'
                            },

                            onUpdate: 'CASCADE',

                            onDelete: 'RESTRICT'
                        },

                        attendance_date: {
                            type: Sequelize.DATEONLY,
                            allowNull: false
                        },

                        check_in_time: {
                            type: Sequelize.DATE,
                            allowNull: true
                        },

                        check_in_latitude: {
                            type: Sequelize.DECIMAL(
                                10,
                                7
                            ),
                            allowNull: true
                        },

                        check_in_longitude: {
                            type: Sequelize.DECIMAL(
                                10,
                                7
                            ),
                            allowNull: true
                        },

                        check_in_distance: {
                            type: Sequelize.DECIMAL(
                                10,
                                2
                            ),
                            allowNull: true
                        },

                        check_out_time: {
                            type: Sequelize.DATE,
                            allowNull: true
                        },

                        check_out_latitude: {
                            type: Sequelize.DECIMAL(
                                10,
                                7
                            ),
                            allowNull: true
                        },

                        check_out_longitude: {
                            type: Sequelize.DECIMAL(
                                10,
                                7
                            ),
                            allowNull: true
                        },

                        check_out_distance: {
                            type: Sequelize.DECIMAL(
                                10,
                                2
                            ),
                            allowNull: true
                        },

                        status: {
                            type: Sequelize.ENUM(
                                'PRESENT',
                                'LATE',
                                'ABSENT'
                            ),
                            allowNull: false,
                            defaultValue: 'PRESENT'
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

                // Satu employee hanya memiliki satu
                // attendance per tanggal.
                await queryInterface.addConstraint(
                    'attendance',
                    {
                        fields: [
                            'user_id',
                            'attendance_date'
                        ],

                        type: 'unique',

                        name:
                            'attendance_user_date_unique',

                        transaction
                    }
                );

                await queryInterface.addIndex(
                    'attendance',
                    ['user_id'],
                    {
                        name: 'attendance_user_id_idx',
                        transaction
                    }
                );

                await queryInterface.addIndex(
                    'attendance',
                    ['office_id'],
                    {
                        name:
                            'attendance_office_id_idx',

                        transaction
                    }
                );

                await queryInterface.addIndex(
                    'attendance',
                    ['attendance_date'],
                    {
                        name:
                            'attendance_date_idx',

                        transaction
                    }
                );

                await queryInterface.addIndex(
                    'attendance',
                    [
                        'office_id',
                        'attendance_date'
                    ],
                    {
                        name:
                            'attendance_office_date_idx',

                        transaction
                    }
                );

                await queryInterface.addIndex(
                    'attendance',
                    ['status'],
                    {
                        name:
                            'attendance_status_idx',

                        transaction
                    }
                );

                await queryInterface.sequelize.query(
                    `
                    ALTER TABLE "attendance"
                    ADD CONSTRAINT "attendance_check_in_latitude_check"
                    CHECK (
                        "check_in_latitude" IS NULL
                        OR (
                            "check_in_latitude" >= -90
                            AND "check_in_latitude" <= 90
                        )
                    )
                    `,
                    {
                        transaction
                    }
                );

                await queryInterface.sequelize.query(
                    `
                    ALTER TABLE "attendance"
                    ADD CONSTRAINT "attendance_check_in_longitude_check"
                    CHECK (
                        "check_in_longitude" IS NULL
                        OR (
                            "check_in_longitude" >= -180
                            AND "check_in_longitude" <= 180
                        )
                    )
                    `,
                    {
                        transaction
                    }
                );

                await queryInterface.sequelize.query(
                    `
                    ALTER TABLE "attendance"
                    ADD CONSTRAINT "attendance_check_out_latitude_check"
                    CHECK (
                        "check_out_latitude" IS NULL
                        OR (
                            "check_out_latitude" >= -90
                            AND "check_out_latitude" <= 90
                        )
                    )
                    `,
                    {
                        transaction
                    }
                );

                await queryInterface.sequelize.query(
                    `
                    ALTER TABLE "attendance"
                    ADD CONSTRAINT "attendance_check_out_longitude_check"
                    CHECK (
                        "check_out_longitude" IS NULL
                        OR (
                            "check_out_longitude" >= -180
                            AND "check_out_longitude" <= 180
                        )
                    )
                    `,
                    {
                        transaction
                    }
                );

                await queryInterface.sequelize.query(
                    `
                    ALTER TABLE "attendance"
                    ADD CONSTRAINT "attendance_check_in_distance_check"
                    CHECK (
                        "check_in_distance" IS NULL
                        OR "check_in_distance" >= 0
                    )
                    `,
                    {
                        transaction
                    }
                );

                await queryInterface.sequelize.query(
                    `
                    ALTER TABLE "attendance"
                    ADD CONSTRAINT "attendance_check_out_distance_check"
                    CHECK (
                        "check_out_distance" IS NULL
                        OR "check_out_distance" >= 0
                    )
                    `,
                    {
                        transaction
                    }
                );
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.sequelize.transaction(
            async (transaction) => {
                await queryInterface.dropTable(
                    'attendance',
                    {
                        transaction
                    }
                );

                await queryInterface.sequelize.query(
                    `
                    DROP TYPE IF EXISTS "enum_attendance_status";
                    `,
                    {
                        transaction
                    }
                );
            }
        );
    }
};