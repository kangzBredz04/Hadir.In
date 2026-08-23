import {
    DataTypes,
    Model
} from 'sequelize';

import sequelize from '../config/database.js';

class AttendancePhoto extends Model { }

AttendancePhoto.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },

        attendanceId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'attendance_id'
        },

        type: {
            type: DataTypes.ENUM(
                'CHECK_IN',
                'CHECK_OUT'
            ),
            allowNull: false
        },

        fileUrl: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'file_url'
        },

        filePath: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'file_path'
        }
    },
    {
        sequelize,

        modelName: 'AttendancePhoto',

        tableName: 'attendance_photos',

        timestamps: true,

        createdAt: 'created_at',

        updatedAt: 'updated_at',

        underscored: true
    }
);

export default AttendancePhoto;