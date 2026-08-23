import env from '../config/env.js';

import AppError from '../utils/AppError.js';

import {
    getExtensionFromMimeType
} from '../utils/file.js';

const encodeStoragePath = (
    path
) => {
    return path
        .split('/')
        .map(
            (segment) =>
                encodeURIComponent(
                    segment
                )
        )
        .join('/');
};

const getStorageHeaders = () => {
    return {
        apikey:
            env.supabaseServiceRoleKey,

        Authorization:
            `Bearer ${env.supabaseServiceRoleKey}`
    };
};

const parseStorageResponse = async (
    response
) => {
    const text =
        await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return {
            message: text
        };
    }
};

const buildAttendancePhotoPath = ({
    attendanceDate,
    userId,
    attendanceId,
    type,
    mimeType
}) => {
    const extension =
        getExtensionFromMimeType(
            mimeType
        );

    if (!extension) {
        throw new AppError(
            'Tipe file tidak didukung',
            422
        );
    }

    const [
        year,
        month,
        day
    ] = attendanceDate.split('-');

    const safeType =
        type === 'CHECK_IN'
            ? 'CHECK_IN'
            : 'CHECK_OUT';

    return [
        'attendance',
        year,
        month,
        day,
        userId,
        attendanceId,
        `${safeType}.${extension}`
    ].join('/');
};

const uploadFile = async ({
    path,
    buffer,
    contentType
}) => {
    const encodedPath =
        encodeStoragePath(path);

    const url =
        `${env.supabaseUrl}` +
        `/storage/v1/object/` +
        `${encodeURIComponent(
            env.supabaseStorageBucket
        )}/` +
        encodedPath;

    let response;

    try {
        response = await fetch(
            url,
            {
                method:
                    'POST',

                headers: {
                    ...getStorageHeaders(),

                    'Content-Type':
                        contentType,

                    'x-upsert':
                        'false'
                },

                body:
                    buffer
            }
        );
    } catch (error) {
        throw new AppError(
            'Tidak dapat terhubung ke layanan penyimpanan foto',
            500
        );
    }

    const data =
        await parseStorageResponse(
            response
        );

    if (!response.ok) {
        console.error(
            'Supabase Storage upload error:',
            data
        );

        throw new AppError(
            'Gagal mengupload foto absensi',
            500
        );
    }

    return {
        path,
        storageResponse:
            data
    };
};

const deleteFile = async (
    path
) => {
    const encodedPath =
        encodeStoragePath(path);

    const url =
        `${env.supabaseUrl}` +
        `/storage/v1/object/` +
        `${encodeURIComponent(
            env.supabaseStorageBucket
        )}/` +
        encodedPath;

    const response =
        await fetch(
            url,
            {
                method:
                    'DELETE',

                headers:
                    getStorageHeaders()
            }
        );

    const data =
        await parseStorageResponse(
            response
        );

    if (!response.ok) {
        throw new Error(
            `Gagal menghapus object Storage: ${data?.message ||
            response.status
            }`
        );
    }

    return true;
};

const safelyDeleteFile = async (
    path
) => {
    if (!path) {
        return;
    }

    try {
        await deleteFile(path);
    } catch (error) {
        /*
         * Cleanup failure tidak boleh
         * menutupi error utama.
         *
         * Tapi tetap harus masuk log agar
         * orphan object dapat diketahui.
         */
        console.error(
            'Storage cleanup failed:',
            {
                path,
                error:
                    error.message
            }
        );
    }
};

const getAuthenticatedFileUrl = (
    path
) => {
    return (
        `${env.supabaseUrl}` +
        `/storage/v1/object/authenticated/` +
        `${encodeURIComponent(
            env.supabaseStorageBucket
        )}/` +
        encodeStoragePath(path)
    );
};

const createSignedUrl = async (
    path,
    expiresIn =
        env.photoSignedUrlExpiresIn
) => {
    const encodedPath =
        encodeStoragePath(path);

    const url =
        `${env.supabaseUrl}` +
        `/storage/v1/object/sign/` +
        `${encodeURIComponent(
            env.supabaseStorageBucket
        )}/` +
        encodedPath;

    const response =
        await fetch(
            url,
            {
                method:
                    'POST',

                headers: {
                    ...getStorageHeaders(),

                    'Content-Type':
                        'application/json'
                },

                body:
                    JSON.stringify({
                        expiresIn
                    })
            }
        );

    const data =
        await parseStorageResponse(
            response
        );

    if (
        !response.ok ||
        !data?.signedURL
    ) {
        console.error(
            'Supabase signed URL error:',
            data
        );

        throw new Error(
            'Gagal membuat signed URL'
        );
    }

    /*
     * Supabase biasanya mengembalikan:
     *
     * /object/sign/bucket/path?token=...
     */
    if (
        data.signedURL.startsWith(
            'http://'
        ) ||
        data.signedURL.startsWith(
            'https://'
        )
    ) {
        return data.signedURL;
    }

    if (
        data.signedURL.startsWith(
            '/storage/v1/'
        )
    ) {
        return (
            env.supabaseUrl +
            data.signedURL
        );
    }

    return (
        env.supabaseUrl +
        '/storage/v1' +
        (
            data.signedURL
                .startsWith('/')
                ? ''
                : '/'
        ) +
        data.signedURL
    );
};

const getPhotoUrlForResponse =
    async (
        filePath,
        fallbackUrl
    ) => {
        try {
            return await createSignedUrl(
                filePath
            );
        } catch (error) {
            /*
             * Attendance sudah berhasil
             * disimpan. Kegagalan membuat
             * signed URL tidak boleh membuat
             * client menganggap check-in gagal.
             */
            console.error(
                'Failed creating photo signed URL:',
                error.message
            );

            return fallbackUrl;
        }
    };

export {
    buildAttendancePhotoPath,

    uploadFile,
    deleteFile,
    safelyDeleteFile,

    getAuthenticatedFileUrl,
    createSignedUrl,
    getPhotoUrlForResponse
};