import sequelize from '../config/database.js';

import User from './User.js';
import Office from './Office.js';
import Attendance from './Attendance.js';
import AttendancePhoto from './AttendancePhoto.js';

// =======================================
// OFFICE <-> USER
// =======================================

Office.hasMany(User, {
    foreignKey: 'officeId',
    as: 'users'
});

User.belongsTo(Office, {
    foreignKey: 'officeId',
    as: 'office'
});

// =======================================
// USER <-> ATTENDANCE
// =======================================

User.hasMany(Attendance, {
    foreignKey: 'userId',
    as: 'attendances'
});

Attendance.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// =======================================
// OFFICE <-> ATTENDANCE
// =======================================

Office.hasMany(Attendance, {
    foreignKey: 'officeId',
    as: 'attendances'
});

Attendance.belongsTo(Office, {
    foreignKey: 'officeId',
    as: 'office'
});

// =======================================
// ATTENDANCE <-> ATTENDANCE PHOTO
// =======================================

Attendance.hasMany(AttendancePhoto, {
    foreignKey: 'attendanceId',
    as: 'photos'
});

AttendancePhoto.belongsTo(Attendance, {
    foreignKey: 'attendanceId',
    as: 'attendance'
});

export {
    sequelize,
    User,
    Office,
    Attendance,
    AttendancePhoto
};