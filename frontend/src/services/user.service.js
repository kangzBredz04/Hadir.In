import {
    apiRequest,
    getResponseData
} from './api';

import normalizeUser from '../utils/normalizeUser';

import {
    buildQueryString
} from '../utils/query';

function normalizeAdminUser(
    value
) {
    const user =
        normalizeUser(value);

    if (!user) {
        return null;
    }

    return {
        ...user,

        createdAt:
            value.createdAt ??
            value.created_at ??
            null,

        updatedAt:
            value.updatedAt ??
            value.updated_at ??
            null
    };
}

export async function getAdminUsers({
    page = 1,
    limit = 10,
    search,
    role,
    officeId,
    isActive
} = {}) {
    const query =
        buildQueryString({
            page,
            limit,
            search,
            role,

            office_id:
                officeId,

            is_active:
                isActive
        });

    const payload =
        await apiRequest(
            `/admin/users${query}`
        );

    const data =
        getResponseData(
            payload
        );

    return {
        items:
            Array.isArray(
                data?.items
            )
                ? data.items
                    .map(
                        normalizeAdminUser
                    )
                    .filter(Boolean)
                : [],

        pagination:
            data?.pagination ?? {
                page,
                limit,
                total: 0,
                totalPages: 0
            }
    };
}

export async function getAdminUserById(
    id
) {
    const payload =
        await apiRequest(
            `/admin/users/${id}`
        );

    return normalizeAdminUser(
        getResponseData(
            payload
        )
    );
}

export async function createAdminUser(
    values
) {
    const payload =
        await apiRequest(
            '/admin/users',
            {
                method:
                    'POST',

                body:
                    values
            }
        );

    return normalizeAdminUser(
        getResponseData(
            payload
        )
    );
}

export async function updateAdminUser(
    id,
    values
) {
    const payload =
        await apiRequest(
            `/admin/users/${id}`,
            {
                method:
                    'PUT',

                body:
                    values
            }
        );

    return normalizeAdminUser(
        getResponseData(
            payload
        )
    );
}

export async function deactivateAdminUser(
    id
) {
    const payload =
        await apiRequest(
            `/admin/users/${id}`,
            {
                method:
                    'DELETE'
            }
        );

    return getResponseData(
        payload
    );
}