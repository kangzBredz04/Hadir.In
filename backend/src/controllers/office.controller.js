import {
    getOffices as getOfficesService,
    getOfficeById as getOfficeByIdService,
    createOffice as createOfficeService,
    updateOffice as updateOfficeService,
    deactivateOffice as deactivateOfficeService
} from '../services/office.service.js';

import {
    successResponse
} from '../utils/response.js';

const getOffices = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await getOfficesService({
                page:
                    req.query.page,

                limit:
                    req.query.limit,

                search:
                    req.query.search,

                isActive:
                    req.query.is_active
            });

        return successResponse(
            res,
            {
                message:
                    'Data kantor berhasil diambil',

                data:
                    result
            }
        );
    } catch (error) {
        next(error);
    }
};

const getOfficeById = async (
    req,
    res,
    next
) => {
    try {
        const office =
            await getOfficeByIdService(
                req.params.id
            );

        return successResponse(
            res,
            {
                message:
                    'Detail kantor berhasil diambil',

                data:
                    office
            }
        );
    } catch (error) {
        next(error);
    }
};

const createOffice = async (
    req,
    res,
    next
) => {
    try {
        const office =
            await createOfficeService(
                req.body
            );

        return successResponse(
            res,
            {
                statusCode:
                    201,

                message:
                    'Kantor berhasil dibuat',

                data:
                    office
            }
        );
    } catch (error) {
        next(error);
    }
};

const updateOffice = async (
    req,
    res,
    next
) => {
    try {
        const office =
            await updateOfficeService(
                req.params.id,
                req.body
            );

        return successResponse(
            res,
            {
                message:
                    'Kantor berhasil diperbarui',

                data:
                    office
            }
        );
    } catch (error) {
        next(error);
    }
};

const deleteOffice = async (
    req,
    res,
    next
) => {
    try {
        const office =
            await deactivateOfficeService(
                req.params.id
            );

        return successResponse(
            res,
            {
                message:
                    'Kantor berhasil dinonaktifkan',

                data:
                    office
            }
        );
    } catch (error) {
        next(error);
    }
};

export {
    getOffices,
    getOfficeById,
    createOffice,
    updateOffice,
    deleteOffice
};