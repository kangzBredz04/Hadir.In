import {
    DataTypes,
    Model
} from 'sequelize';

import sequelize from '../config/database.js';

class User extends Model {
    toJSON() {
        const values = {
            ...this.get()
        };

        delete values.password;

        return values;
    }
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },

        employeeId: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            field: 'employee_id'
        },

        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            },

            set(value) {
                this.setDataValue(
                    'email',
                    value?.trim().toLowerCase()
                );
            }
        },

        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        role: {
            type: DataTypes.ENUM(
                'ADMIN',
                'EMPLOYEE'
            ),
            allowNull: false,
            defaultValue: 'EMPLOYEE'
        },

        officeId: {
            type: DataTypes.UUID,
            allowNull: true,
            field: 'office_id'
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

        modelName: 'User',

        tableName: 'users',

        timestamps: true,

        createdAt: 'created_at',

        updatedAt: 'updated_at',

        underscored: true,

        defaultScope: {
            attributes: {
                exclude: [
                    'password'
                ]
            }
        },

        scopes: {
            withPassword: {
                attributes: {
                    include: [
                        'password'
                    ]
                }
            }
        }
    }
);

export default User;