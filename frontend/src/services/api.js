const API_URL =
    import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error(
        'Konfigurasi VITE_API_URL belum tersedia.'
    );
}

export async function apiRequest(
    endpoint,
    options = {}
) {
    const url =
        `${API_URL}${endpoint}`;

    const isFormData =
        options.body instanceof FormData;

    const headers = {
        Accept:
            'application/json',

        ...(!isFormData
            ? {
                'Content-Type':
                    'application/json'
            }
            : {}),

        ...(options.headers ?? {})
    };

    const response =
        await fetch(
            url,
            {
                ...options,
                headers
            }
        );

    let payload = null;

    const contentType =
        response.headers.get(
            'content-type'
        );

    if (
        contentType?.includes(
            'application/json'
        )
    ) {
        payload =
            await response.json();
    }

    if (!response.ok) {
        const error =
            new Error(
                payload?.message ||
                'Request gagal.'
            );

        error.status =
            response.status;

        error.payload =
            payload;

        throw error;
    }

    return payload;
}

export {
    API_URL
};