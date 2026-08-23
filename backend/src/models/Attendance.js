import {
    DataTypes,
    Model
} from 'sequelize';

import sequelize from '../config/database.js';

class Attendance extends Model { }

Attendance.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },

        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'user_id'
        },

        officeId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'office_id'
        },

        attendanceDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            field: 'attendance_date'
        },

        checkInTime: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'check_in_time'
        },

        checkInLatitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true,
            field: 'check_in_latitude'
        },

        checkInLongitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true,
            field: 'check_in_longitude'
        },

        checkInDistance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            field: 'check_in_distance'
        },

        checkOutTime: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'check_out_time'
        },

        checkOutLatitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true,
            field: 'check_out_latitude'
        },

        checkOutLongitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true,
            field: 'check_out_longitude'
        },

        checkOutDistance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            field: 'check_out_distance'
        },

        status: {
            type: DataTypes.ENUM(
                'PRESENT',
                'LATE',
                'ABSENT'
            ),
            allowNull: false,
            defaultValue: 'PRESENT'
        }
    },
    {
        sequelize,

        modelName: 'Attendance',

        tableName: 'attendance',

        timestamps: true,

        createdAt: 'created_at',

        updatedAt: 'updated_at',

        underscored: true
    }
);

export default Attendance;