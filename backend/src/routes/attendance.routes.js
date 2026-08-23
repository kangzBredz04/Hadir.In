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
    validateAttendanceLocation
} from '../middlewares/validation.middleware.js';

import {
    uploadAttendancePhoto,
    validateAttendancePhoto
} from '../middlewares/upload.middleware.js';

import {
    checkIn,
    checkOut,
    getTodayAttendance
} from '../controllers/attendance.controller.js';

import {
    validateAttendanceLocation,
    validateAttendanceHistory
} from '../middlewares/validation.middleware.js';

import {
    checkIn,
    checkOut,
    getTodayAttendance,
    getAttendanceHistory
} from '../controllers/attendance.controller.js';

const router = Router();

router.use(
    authenticate,
    authorize('EMPLOYEE')
);

router.post(
    '/check-in',

    uploadAttendancePhoto,

    validateAttendancePhoto,

    validateAttendanceLocation,

    checkIn
);

router.post(
    '/check-out',

    uploadAttendancePhoto,

    validateAttendancePhoto,

    validateAttendanceLocation,

    checkOut
);

router.get(
    '/today',

    getTodayAttendance
);

router.get(
    '/history',

    validateAttendanceHistory,

    getAttendanceHistory
);

export default router;