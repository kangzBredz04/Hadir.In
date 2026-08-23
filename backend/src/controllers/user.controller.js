import {
    successResponse
} from '../utils/response.js';

import {
    getUsers as getUsersService,
    getUserById as getUserByIdService,
    createUser as createUserService,
    updateUser as updateUserService,
    deactivateUser as deactivateUserService
} from '../services/user.service.js';

const getMe = async (
    req,
    res,
    next
) => {
    try {
        const user =
            req.user.toJSON();

        return successResponse(
            res,
            {
                message:
                    'Data user berhasil diambil',

                data:
                    user
            }
        );
    } catch (error) {
        next(error);
    }
};

const getUsers = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await getUsersService({
                page:
                    req.query.page,

                limit:
                    req.query.limit,

                search:
                    req.query.search,

                role:
                    req.query.role,

                officeId:
                    req.query.office_id,

                isActive:
                    req.query.is_active
            });

        return successResponse(
            res,
            {
                message:
                    'Data user berhasil diambil',

                data:
                    result
            }
        );
    } catch (error) {
        next(error);
    }
};

const getUserById = async (
    req,
    res,
    next
) => {
    try {
        const user =
            await getUserByIdService(
                req.params.id
            );

        return successResponse(
            res,
            {
                message:
                    'Detail user berhasil diambil',

                data:
                    user
            }
        );
    } catch (error) {
        next(error);
    }
};

const createUser = async (
    req,
    res,
    next
) => {
    try {
        const user =
            await createUserService(
                req.body
            );

        return successResponse(
            res,
            {
                statusCode:
                    201,

                message:
                    'User berhasil dibuat',

                data:
                    user
            }
        );
    } catch (error) {
        next(error);
    }
};

const updateUser = async (
    req,
    res,
    next
) => {
    try {
        const user =
            await updateUserService(
                req.params.id,
                req.body
            );

        return successResponse(
            res,
            {
                message:
                    'User berhasil diperbarui',

                data:
                    user
            }
        );
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (
    req,
    res,
    next
) => {
    try {
        const user =
            await deactivateUserService(
                req.params.id,
                req.user.id
            );

        return successResponse(
            res,
            {
                message:
                    'User berhasil dinonaktifkan',

                data:
                    user
            }
        );
    } catch (error) {
        next(error);
    }
};

export {
    getMe,

    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};