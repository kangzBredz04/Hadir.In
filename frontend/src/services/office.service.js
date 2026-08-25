import {
    apiRequest,
    getResponseData
} from './api';

import {
    buildQueryString
} from '../utils/query';

export function normalizeOffice(
    office
) {
    if (!office) {
        return null;
    }

    return {
        id:
            office.id,

        name:
            office.name ?? '',

        address:
            office.address ?? '',

        latitude:
            office.latitude,

        longitude:
            office.longitude,

        radiusMeter:
            office.radiusMeter ??
            office.radius_meter,

        isActive:
            office.isActive ??
            office.is_active ??
            true,

        createdAt:
            office.createdAt ??
            office.created_at ??
            null,

        updatedAt:
            office.updatedAt ??
            office.updated_at ??
            null
    };
}

export async function getAdminOffices({
    page = 1,
    limit = 10,
    search,
    isActive
} = {}) {
    const query =
        buildQueryString({
            page,
            limit,
            search,

            is_active:
                isActive
        });

    const payload =
        await apiRequest(
            `/admin/offices${query}`
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
                        normalizeOffice
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

export async function getAdminOfficeById(
    id
) {
    const payload =
        await apiRequest(
            `/admin/offices/${id}`
        );

    return normalizeOffice(
        getResponseData(
            payload
        )
    );
}

export async function createAdminOffice(
    values
) {
    const payload =
        await apiRequest(
            '/admin/offices',
            {
                method:
                    'POST',

                body:
                    values
            }
        );

    return normalizeOffice(
        getResponseData(
            payload
        )
    );
}

export async function updateAdminOffice(
    id,
    values
) {
    const payload =
        await apiRequest(
            `/admin/offices/${id}`,
            {
                method:
                    'PUT',

                body:
                    values
            }
        );

    return normalizeOffice(
        getResponseData(
            payload
        )
    );
}

export async function deactivateAdminOffice(
    id
) {
    const payload =
        await apiRequest(
            `/admin/offices/${id}`,
            {
                method:
                    'DELETE'
            }
        );

    return getResponseData(
        payload
    );
}