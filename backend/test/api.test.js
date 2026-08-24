import {
    after,
    test
} from 'node:test';

import assert from 'node:assert/strict';

import request from 'supertest';

import app from '../src/app.js';

import {
    sequelize
} from '../src/models/index.js';

const adminEmail =
    process.env.TEST_ADMIN_EMAIL;

const adminPassword =
    process.env.TEST_ADMIN_PASSWORD;

const employeeEmail =
    process.env.TEST_EMPLOYEE_EMAIL;

const employeePassword =
    process.env.TEST_EMPLOYEE_PASSWORD;

const ensureTestCredentials = () => {
    const missing = [];

    if (!adminEmail) {
        missing.push(
            'TEST_ADMIN_EMAIL'
        );
    }

    if (!adminPassword) {
        missing.push(
            'TEST_ADMIN_PASSWORD'
        );
    }

    if (!employeeEmail) {
        missing.push(
            'TEST_EMPLOYEE_EMAIL'
        );
    }

    if (!employeePassword) {
        missing.push(
            'TEST_EMPLOYEE_PASSWORD'
        );
    }

    if (missing.length > 0) {
        throw new Error(
            `Environment test belum lengkap: ${missing.join(', ')}`
        );
    }
};

ensureTestCredentials();

test(
    'GET /api/health harus berhasil',
    async () => {
        const response =
            await request(app)
                .get(
                    '/api/health'
                );

        assert.equal(
            response.status,
            200
        );

        assert.equal(
            response.body.success,
            true
        );

        assert.equal(
            response.body.data.status,
            'UP'
        );
    }
);

test(
    'Admin dapat login',
    async () => {
        const response =
            await request(app)
                .post(
                    '/api/auth/login'
                )
                .send({
                    email:
                        adminEmail,

                    password:
                        adminPassword
                });

        assert.equal(
            response.status,
            200
        );

        assert.equal(
            response.body.success,
            true
        );

        assert.ok(
            response.body.data.token
        );

        assert.equal(
            response.body.data.user.role,
            'ADMIN'
        );

        assert.equal(
            response.body.data.user.password,
            undefined
        );
    }
);

test(
    'Login dengan password salah harus ditolak',
    async () => {
        const response =
            await request(app)
                .post(
                    '/api/auth/login'
                )
                .send({
                    email:
                        adminEmail,

                    password:
                        'password-yang-salah'
                });

        assert.equal(
            response.status,
            401
        );

        assert.equal(
            response.body.success,
            false
        );
    }
);

test(
    'GET /api/users/me tanpa token harus 401',
    async () => {
        const response =
            await request(app)
                .get(
                    '/api/users/me'
                );

        assert.equal(
            response.status,
            401
        );
    }
);

test(
    'Employee dapat melihat profile sendiri',
    async () => {
        const loginResponse =
            await request(app)
                .post(
                    '/api/auth/login'
                )
                .send({
                    email:
                        employeeEmail,

                    password:
                        employeePassword
                });

        assert.equal(
            loginResponse.status,
            200
        );

        const token =
            loginResponse
                .body
                .data
                .token;

        const response =
            await request(app)
                .get(
                    '/api/users/me'
                )
                .set(
                    'Authorization',
                    `Bearer ${token}`
                );

        assert.equal(
            response.status,
            200
        );

        assert.equal(
            response.body.success,
            true
        );

        assert.equal(
            response.body.data.role,
            'EMPLOYEE'
        );

        assert.equal(
            response.body.data.password,
            undefined
        );
    }
);

test(
    'Employee tidak dapat mengakses admin API',
    async () => {
        const loginResponse =
            await request(app)
                .post(
                    '/api/auth/login'
                )
                .send({
                    email:
                        employeeEmail,

                    password:
                        employeePassword
                });

        const token =
            loginResponse
                .body
                .data
                .token;

        const response =
            await request(app)
                .get(
                    '/api/admin/users'
                )
                .set(
                    'Authorization',
                    `Bearer ${token}`
                );

        assert.equal(
            response.status,
            403
        );

        assert.equal(
            response.body.success,
            false
        );
    }
);

test(
    'Admin dapat mengakses list user',
    async () => {
        const loginResponse =
            await request(app)
                .post(
                    '/api/auth/login'
                )
                .send({
                    email:
                        adminEmail,

                    password:
                        adminPassword
                });

        const token =
            loginResponse
                .body
                .data
                .token;

        const response =
            await request(app)
                .get(
                    '/api/admin/users'
                )
                .set(
                    'Authorization',
                    `Bearer ${token}`
                );

        assert.equal(
            response.status,
            200
        );

        assert.equal(
            response.body.success,
            true
        );

        assert.ok(
            Array.isArray(
                response.body
                    .data
                    .items
            )
        );
    }
);

after(
    async () => {
        await sequelize.close();
    }
);