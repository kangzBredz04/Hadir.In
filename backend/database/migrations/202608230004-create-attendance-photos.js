'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(
            async (transaction) => {
                await queryInterface.createTable(
                    'attendance_photos',
                    {
                        id: {
                            type: Sequelize.UUID,
                            allowNull: false,
                            primaryKey: true
                        },

                        attendance_id: {
                            type: Sequelize.UUID,
                            allowNull: false,

                            references: {
                                model: 'attendance',
                                key: 'id'
                            },

                            onUpdate: 'CASCADE',

                            onDelete: 'CASCADE'
                        },

                        type: {
                            type: Sequelize.ENUM(
                                'CHECK_IN',
                                'CHECK_OUT'
                            ),

                            allowNull: false
                        },

                        file_url: {
                            type: Sequelize.TEXT,
                            allowNull: false
                        },

                        file_path: {
                            type: Sequelize.TEXT,
                            allowNull: false
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
                    'attendance_photos',
                    ['attendance_id'],
                    {
                        name:
                            'attendance_photos_attendance_id_idx',

                        transaction
                    }
                );

                await queryInterface.addConstraint(
                    'attendance_photos',
                    {
                        fields: [
                            'attendance_id',
                            'type'
                        ],

                        type: 'unique',

                        name:
                            'attendance_photos_attendance_type_unique',

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
                    'attendance_photos',
                    {
                        transaction
                    }
                );

                await queryInterface.sequelize.query(
                    `
                    DROP TYPE IF EXISTS "enum_attendance_photos_type";
                    `,
                    {
                        transaction
                    }
                );
            }
        );
    }
};