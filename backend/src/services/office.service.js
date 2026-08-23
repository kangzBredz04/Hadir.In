import {
    Op
} from 'sequelize';

import {
    Office,
    User
} from '../models/index.js';

import AppError from '../utils/AppError.js';

const getOffices = async ({
    page = 1,
    limit = 10,
    search,
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
                name: {
                    [Op.iLike]:
                        `%${search}%`
                }
            },
            {
                address: {
                    [Op.iLike]:
                        `%${search}%`
                }
            }
        ];
    }

    if (isActive !== undefined) {
        where.isActive =
            String(isActive) === 'true';
    }

    const {
        rows,
        count
    } = await Office.findAndCountAll({
        where,

        limit:
            safeLimit,

        offset,

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

const getOfficeById = async (
    id
) => {
    const office =
        await Office.findByPk(
            id,
            {
                include: [
                    {
                        model:
                            User,

                        as:
                            'users',

                        attributes: [
                            'id',
                            'employeeId',
                            'name',
                            'email',
                            'role',
                            'isActive'
                        ],

                        required:
                            false
                    }
                ]
            }
        );

    if (!office) {
        throw new AppError(
            'Kantor tidak ditemukan',
            404
        );
    }

    return office;
};

const createOffice = async (
    payload
) => {
    const office =
        await Office.create({
            name:
                payload.name.trim(),

            address:
                payload.address.trim(),

            latitude:
                Number(
                    payload.latitude
                ),

            longitude:
                Number(
                    payload.longitude
                ),

            radiusMeter:
                Number(
                    payload.radius_meter
                ),

            isActive:
                payload.is_active ??
                true
        });

    return office;
};

const updateOffice = async (
    id,
    payload
) => {
    const office =
        await Office.findByPk(id);

    if (!office) {
        throw new AppError(
            'Kantor tidak ditemukan',
            404
        );
    }

    if (payload.name !== undefined) {
        office.name =
            payload.name.trim();
    }

    if (
        payload.address !== undefined
    ) {
        office.address =
            payload.address.trim();
    }

    if (
        payload.latitude !== undefined
    ) {
        office.latitude =
            Number(
                payload.latitude
            );
    }

    if (
        payload.longitude !== undefined
    ) {
        office.longitude =
            Number(
                payload.longitude
            );
    }

    if (
        payload.radius_meter !==
        undefined
    ) {
        office.radiusMeter =
            Number(
                payload.radius_meter
            );
    }

    if (
        payload.is_active !==
        undefined
    ) {
        office.isActive =
            payload.is_active;
    }

    await office.save();

    return office;
};

const deactivateOffice = async (
    id
) => {
    const office =
        await Office.findByPk(id);

    if (!office) {
        throw new AppError(
            'Kantor tidak ditemukan',
            404
        );
    }

    if (!office.isActive) {
        throw new AppError(
            'Kantor sudah tidak aktif',
            409
        );
    }

    office.isActive = false;

    await office.save();

    return office;
};

export {
    getOffices,
    getOfficeById,
    createOffice,
    updateOffice,
    deactivateOffice
};