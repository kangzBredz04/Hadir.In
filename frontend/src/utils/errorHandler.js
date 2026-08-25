const DEFAULT_MESSAGE =
    'Terjadi kendala. Silakan coba lagi.';

const statusMessages = {
    400:
        'Data yang dikirim belum sesuai. Periksa kembali data Anda.',

    401:
        'Sesi Anda tidak valid. Silakan login kembali.',

    403:
        'Anda tidak memiliki akses untuk melakukan tindakan ini.',

    404:
        'Data yang diminta tidak ditemukan.',

    409:
        'Permintaan tidak dapat diproses karena kondisi data saat ini.',

    413:
        'Ukuran file terlalu besar.',

    422:
        'Data yang dimasukkan belum valid.',

    429:
        'Terlalu banyak permintaan. Silakan tunggu beberapa saat.',

    500:
        'Server sedang mengalami kendala. Silakan coba lagi.'
};

const safeBackendMessageStatuses =
    new Set([
        400,
        409,
        413,
        422
    ]);

export function handleApiError(
    error,
    fallbackMessage =
        DEFAULT_MESSAGE
) {
    if (
        error instanceof TypeError
    ) {
        return (
            'Tidak dapat terhubung ke server. ' +
            'Periksa koneksi Anda lalu coba lagi.'
        );
    }

    if (
        error?.message ===
        'Konfigurasi VITE_API_URL belum tersedia.'
    ) {
        return (
            'Konfigurasi aplikasi belum lengkap.'
        );
    }

    if (
        [
            'Foto absensi belum tersedia.',
            'Lokasi absensi belum tersedia.'
        ].includes(
            error?.message
        )
    ) {
        return error.message;
    }

    if (
        safeBackendMessageStatuses.has(
            error?.status
        ) &&
        typeof error
            ?.payload
            ?.message ===
        'string' &&
        error.payload.message.trim()
    ) {
        return error
            .payload
            .message;
    }

    return (
        statusMessages[
        error?.status
        ] ??
        fallbackMessage
    );
}

export function getLocationApiError(
    error
) {
    const errors =
        error?.payload
            ?.errors;

    if (
        !Array.isArray(errors)
    ) {
        return null;
    }

    const locationError =
        errors.find(
            item =>
                item?.field ===
                'location'
        );

    if (!locationError) {
        return null;
    }

    const distance =
        Number(
            locationError.distance
        );

    const allowedRadius =
        Number(
            locationError
                .allowedRadius
        );

    return {
        message:
            error?.payload
                ?.message ??
            'Lokasi berada di luar jangkauan.',

        distance:
            Number.isFinite(
                distance
            )
                ? distance
                : null,

        allowedRadius:
            Number.isFinite(
                allowedRadius
            )
                ? allowedRadius
                : null
    };
}

export function getValidationErrors(
    error
) {
    const errors =
        error?.payload
            ?.errors;

    if (
        !Array.isArray(errors)
    ) {
        return [];
    }

    return errors
        .map(item => ({
            field:
                item?.field ??
                null,

            message:
                item?.message ??
                item?.msg ??
                null
        }))
        .filter(
            item =>
                item.message
        );
}