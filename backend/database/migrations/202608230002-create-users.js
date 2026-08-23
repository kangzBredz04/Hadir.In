'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(
            async (transaction) => {
                await queryInterface.createTable(
                    'users',
                    {
                        id: {
                            type: Sequelize.UUID,
                            allowNull: false,
                            primaryKey: true
                        },

                        employee_id: {
                            type: Sequelize.STRING(50),
                            allowNull: false,
                            unique: true
                        },

                        name: {
                            type: Sequelize.STRING(150),
                            allowNull: false
                        },

                        email: {
                            type: Sequelize.STRING(255),
                            allowNull: false,
                            unique: true
                        },

                        password: {
                            type: Sequelize.STRING(255),
                            allowNull: false
                        },

                        role: {
                            type: Sequelize.ENUM(
                                'ADMIN',
                                'EMPLOYEE'
                            ),
                            allowNull: false,
                            defaultValue: 'EMPLOYEE'
                        },

                        office_id: {
                            type: Sequelize.UUID,
                            allowNull: true,

                            references: {
                                model: 'offices',
                                key: 'id'
                            },

                            onUpdate: 'CASCADE',

                            onDelete: 'SET NULL'
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
                    'users',
                    ['office_id'],
                    {
                        name: 'users_office_id_idx',
                        transaction
                    }
                );

                await queryInterface.addIndex(
                    'users',
                    ['role'],
                    {
                        name: 'users_role_idx',
                        transaction
                    }
                );

                await queryInterface.addIndex(
                    'users',
                    ['is_active'],
                    {
                        name: 'users_is_active_idx',
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
                    'users',
                    {
                        transaction
                    }
                );

                await queryInterface.sequelize.query(
                    `
                    DROP TYPE IF EXISTS "enum_users_role";
                    `,
                    {
                        transaction
                    }
                );
            }
        );
    }
};