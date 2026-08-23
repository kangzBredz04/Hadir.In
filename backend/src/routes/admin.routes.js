import {
    Router
} from 'express';

import {
    authenticate
} from '../middlewares/auth.middleware.js';

import {
    authorize
} from '../middlewares/role.middleware.js';

import {
    validateUserCreate,
    validateUserUpdate,

    validateOfficeCreate,
    validateOfficeUpdate,

    validateIdParam,

    validateAdminAttendance
} from '../middlewares/validation.middleware.js';

import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/user.controller.js';

import {
    getOffices,
    getOfficeById,
    createOffice,
    updateOffice,
    deleteOffice
} from '../controllers/office.controller.js';

import {
    getAdminAttendance,
    getAdminAttendanceById,
    getAttendanceSummary
} from '../controllers/admin-attendance.controller.js';

const router = Router();

/*
 * Semua route di file ini:
 *
 * 1. Harus login
 * 2. Harus ADMIN
 */
router.use(
    authenticate,
    authorize('ADMIN')
);

/*
 * ===========================
 * USERS
 * ===========================
 */

router.get(
    '/users',
    getUsers
);

router.post(
    '/users',
    validateUserCreate,
    createUser
);

router.get(
    '/users/:id',
    validateIdParam,
    getUserById
);

router.put(
    '/users/:id',
    validateIdParam,
    validateUserUpdate,
    updateUser
);

router.delete(
    '/users/:id',
    validateIdParam,
    deleteUser
);

/*
 * ===========================
 * OFFICES
 * ===========================
 */

router.get(
    '/offices',
    getOffices
);

router.post(
    '/offices',
    validateOfficeCreate,
    createOffice
);

router.get(
    '/offices/:id',
    validateIdParam,
    getOfficeById
);

router.put(
    '/offices/:id',
    validateIdParam,
    validateOfficeUpdate,
    updateOffice
);

router.delete(
    '/offices/:id',
    validateIdParam,
    deleteOffice
);

/*
 * ===========================
 * ATTENDANCE
 * ===========================
 */

/*
 * PENTING:
 * /summary harus didefinisikan
 * sebelum /:id.
 *
 * Kalau /:id dulu,
 * Express bisa menganggap
 * "summary" sebagai ID.
 */

router.get(
    '/attendance/summary',

    validateAdminAttendance,

    getAttendanceSummary
);

router.get(
    '/attendance',

    validateAdminAttendance,

    getAdminAttendance
);

router.get(
    '/attendance/:id',

    validateIdParam,

    getAdminAttendanceById
);

export default router;