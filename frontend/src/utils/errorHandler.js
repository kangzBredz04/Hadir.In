const DEFAULT_MESSAGE =
    'Terjadi kendala. Silakan coba lagi.';

const statusMessages = {
    400:
        'Data yang dikirim belum sesuai.',

    401:
        'Sesi Anda tidak valid. Silakan login kembali.',

    403:
        'Anda tidak memiliki akses untuk melakukan tindakan ini.',

    404:
        'Data yang diminta tidak ditemukan.',

    409:
        'Permintaan tidak dapat diproses karena status data saat ini.',

    422:
        'Data yang dikirim belum valid.',

    429:
        'Terlalu banyak permintaan. Silakan tunggu beberapa saat.',

    500:
        'Server sedang mengalami kendala. Silakan coba lagi.'
};

const safeBusinessStatuses =
    new Set([
        409,
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
        'Foto absensi belum tersedia.' ||
        error?.message ===
        'Lokasi absensi belum tersedia.'
    ) {
        return error.message;
    }

    /*
     * Pesan business validation
     * dari backend aman ditampilkan.
     *
     * Contoh:
     * - sudah check-in
     * - sudah check-out
     * - di luar radius
     */
    if (
        safeBusinessStatuses.has(
            error?.status
        ) &&
        typeof error?.payload
            ?.message ===
        'string'
    ) {
        return error.payload.message;
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
        !Array.isArray(
            errors
        )
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