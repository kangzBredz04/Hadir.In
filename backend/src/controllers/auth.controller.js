import {
    login as loginService
} from '../services/auth.service.js';

import {
    successResponse
} from '../utils/response.js';

const login = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await loginService({
                email:
                    req.body.email,

                password:
                    req.body.password
            });

        return successResponse(
            res,
            {
                statusCode: 200,

                message:
                    'Login berhasil',

                data:
                    result
            }
        );
    } catch (error) {
        next(error);
    }
};

export {
    login
};