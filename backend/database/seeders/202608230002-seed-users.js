'use strict';

const argon2 = require('argon2');

const OFFICE_ID =
    '11111111-1111-4111-8111-111111111111';

const ADMIN_ID =
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

const EMPLOYEE_1_ID =
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

const EMPLOYEE_2_ID =
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc';

const EMPLOYEE_3_ID =
    'dddddddd-dddd-4ddd-8ddd-dddddddddddd';

module.exports = {
    async up(queryInterface) {
        const now = new Date();

        const adminPassword =
            await argon2.hash(
                'Admin123!',
                {
                    type: argon2.argon2id
                }
            );

        const employeePassword =
            await argon2.hash(
                'Employee123!',
                {
                    type: argon2.argon2id
                }
            );

        await queryInterface.bulkInsert(
            'users',
            [
                {
                    id: ADMIN_ID,

                    employee_id: 'ADM001',

                    name: 'Administrator',

                    email:
                        'admin@hadir.in',

                    password:
                        adminPassword,

                    role: 'ADMIN',

                    office_id: null,

                    is_active: true,

                    created_at: now,

                    updated_at: now
                },

                {
                    id: EMPLOYEE_1_ID,

                    employee_id: 'EMP001',

                    name:
                        'Employee Satu',

                    email:
                        'employee1@hadir.in',

                    password:
                        employeePassword,

                    role: 'EMPLOYEE',

                    office_id: OFFICE_ID,

                    is_active: true,

                    created_at: now,

                    updated_at: now
                },

                {
                    id: EMPLOYEE_2_ID,

                    employee_id: 'EMP002',

                    name:
                        'Employee Dua',

                    email:
                        'employee2@hadir.in',

                    password:
                        employeePassword,

                    role: 'EMPLOYEE',

                    office_id: OFFICE_ID,

                    is_active: true,

                    created_at: now,

                    updated_at: now
                },

                {
                    id: EMPLOYEE_3_ID,

                    employee_id: 'EMP003',

                    name:
                        'Employee Tiga',

                    email:
                        'employee3@hadir.in',

                    password:
                        employeePassword,

                    role: 'EMPLOYEE',

                    office_id: OFFICE_ID,

                    is_active: true,

                    created_at: now,

                    updated_at: now
                }
            ]
        );
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete(
            'users',
            {
                id: [
                    ADMIN_ID,
                    EMPLOYEE_1_ID,
                    EMPLOYEE_2_ID,
                    EMPLOYEE_3_ID
                ]
            }
        );
    }
};