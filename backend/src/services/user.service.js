import argon2 from 'argon2';

import {
    Op
} from 'sequelize';

import {
    User,
    Office
} from '../models/index.js';

import AppError from '../utils/AppError.js';

const officeAttributes = [
    'id',
    'name',
    'address',
    'latitude',
    'longitude',
    'radiusMeter',
    'isActive'
];

const getUsers = async ({
    page = 1,
    limit = 10,
    search,
    role,
    officeId,
    isActive
}) => {
    const safePage =
        Math.max(
            Number(page) || 1,
            1
        );

    const safeLimit =
        Math.min(
            Math.max(
                Number(limit) || 10,
                1
            ),
            100
        );

    const offset =
        (safePage - 1) *
        safeLimit;

    const where = {};

    if (search) {
        where[Op.or] = [
            {
                employeeId: {
                    [Op.iLike]:
                        `%${search}%`
                }
            },
            {
                name: {
                    [Op.iLike]:
                        `%${search}%`
                }
            },
            {
                email: {
                    [Op.iLike]:
                        `%${search}%`
                }
            }
        ];
    }

    if (
        role &&
        ['ADMIN', 'EMPLOYEE']
            .includes(role)
    ) {
        where.role = role;
    }

    if (officeId) {
        where.officeId =
            officeId;
    }

    if (isActive !== undefined) {
        where.isActive =
            String(isActive) === 'true';
    }

    const {
        rows,
        count
    } = await User.findAndCountAll({
        where,

        include: [
            {
                model:
                    Office,

                as:
                    'office',

                attributes:
                    officeAttributes,

                required:
                    false
            }
        ],

        limit:
            safeLimit,

        offset,

        distinct:
            true,

        order: [
            ['created_at', 'DESC']
        ]
    });

    return {
        items:
            rows,

        pagination: {
            page:
                safePage,

            limit:
                safeLimit,

            total:
                count,

            totalPages:
                Math.ceil(
                    count /
                    safeLimit
                )
        }
    };
};

const getUserById = async (
    id
) => {
    const user =
        await User.findByPk(
            id,
            {
                include: [
                    {
                        model:
                            Office,

                        as:
                            'office',

                        attributes:
                            officeAttributes,

                        required:
                            false
                    }
                ]
            }
        );

    if (!user) {
        throw new AppError(
            'User tidak ditemukan',
            404
        );
    }

    return user;
};

const validateOfficeForUser = async (
    officeId
) => {
    if (!officeId) {
        return null;
    }

    const office =
        await Office.findByPk(
            officeId
        );

    if (!office) {
        throw new AppError(
            'Office tidak ditemukan',
            404
        );
    }

    if (!office.isActive) {
        throw new AppError(
            'Office sedang tidak aktif',
            422
        );
    }

    return office;
};

const createUser = async (
    payload
) => {
    if (
        payload.role === 'EMPLOYEE'
    ) {
        await validateOfficeForUser(
            payload.office_id
        );
    } else if (
        payload.office_id
    ) {
        await validateOfficeForUser(
            payload.office_id
        );
    }

    const hashedPassword =
        await argon2.hash(
            payload.password,
            {
                type:
                    argon2.argon2id
            }
        );

    const user =
        await User.create({
            employeeId:
                payload.employee_id
                    .trim(),

            name:
                payload.name.trim(),

            email:
                payload.email
                    .trim()
                    .toLowerCase(),

            password:
                hashedPassword,

            role:
                payload.role,

            officeId:
                payload.office_id ??
                null,

            isActive:
                payload.is_active ??
                true
        });

    return getUserById(
        user.id
    );
};

const updateUser = async (
    id,
    payload
) => {
    const user =
        await User
            .unscoped()
            .findByPk(id);

    if (!user) {
        throw new AppError(
            'User tidak ditemukan',
            404
        );
    }

    const nextRole =
        payload.role ??
        user.role;

    const nextOfficeId =
        payload.office_id !==
            undefined
            ? payload.office_id
            : user.officeId;

    if (
        nextRole === 'EMPLOYEE' &&
        !nextOfficeId
    ) {
        throw new AppError(
            'Employee wajib memiliki office',
            422,
            [
                {
                    field:
                        'office_id',

                    message:
                        'Employee wajib memiliki office'
                }
            ]
        );
    }

    if (nextOfficeId) {
        await validateOfficeForUser(
            nextOfficeId
        );
    }

    if (
        payload.employee_id !==
        undefined
    ) {
        user.employeeId =
            payload.employee_id
                .trim();
    }

    if (
        payload.name !== undefined
    ) {
        user.name =
            payload.name.trim();
    }

    if (
        payload.email !== undefined
    ) {
        user.email =
            payload.email
                .trim()
                .toLowerCase();
    }

    if (
        payload.password !==
        undefined
    ) {
        user.password =
            await argon2.hash(
                payload.password,
                {
                    type:
                        argon2.argon2id
                }
            );
    }

    if (
        payload.role !== undefined
    ) {
        user.role =
            payload.role;
    }

    if (
        payload.office_id !==
        undefined
    ) {
        user.officeId =
            payload.office_id;
    }

    if (
        payload.is_active !==
        undefined
    ) {
        user.isActive =
            payload.is_active;
    }

    await user.save();

    return getUserById(
        user.id
    );
};

const deactivateUser = async (
    id,
    currentAdminId
) => {
    if (
        id === currentAdminId
    ) {
        throw new AppError(
            'Anda tidak dapat menonaktifkan akun sendiri',
            409
        );
    }

    const user =
        await User.findByPk(id);

    if (!user) {
        throw new AppError(
            'User tidak ditemukan',
            404
        );
    }

    if (!user.isActive) {
        throw new AppError(
            'User sudah tidak aktif',
            409
        );
    }

    user.isActive = false;

    await user.save();

    return user;
};

export {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deactivateUser
};