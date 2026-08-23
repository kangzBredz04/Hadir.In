import {
    DataTypes,
    Model
} from 'sequelize';

import sequelize from '../config/database.js';

class Office extends Model { }

Office.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },

        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 150]
            }
        },

        address: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        latitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: false,
            validate: {
                min: -90,
                max: 90
            }
        },

        longitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: false,
            validate: {
                min: -180,
                max: 180
            }
        },

        radiusMeter: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'radius_meter',
            validate: {
                min: 1
            }
        },

        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'is_active'
        }
    },
    {
        sequelize,

        modelName: 'Office',

        tableName: 'offices',

        timestamps: true,

        createdAt: 'created_at',

        updatedAt: 'updated_at',

        underscored: true
    }
);

export default Office;