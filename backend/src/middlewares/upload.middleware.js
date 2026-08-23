import multer from 'multer';

import AppError from '../utils/AppError.js';

import {
    detectImageMimeType
} from '../utils/file.js';

const MAX_FILE_SIZE =
    5 * 1024 * 1024;

const allowedMimeTypes = [
    'image/jpeg',
    'image/png'
];

const upload = multer({
    storage:
        multer.memoryStorage(),

    limits: {
        fileSize:
            MAX_FILE_SIZE,

        files:
            1
    },

    fileFilter: (
        req,
        file,
        callback
    ) => {
        if (
            !allowedMimeTypes.includes(
                file.mimetype
            )
        ) {
            return callback(
                new AppError(
                    'Foto hanya boleh berupa JPEG, JPG, atau PNG',
                    422
                )
            );
        }

        callback(
            null,
            true
        );
    }
});

const uploadAttendancePhoto =
    upload.single('photo');

const validateAttendancePhoto = (
    req,
    res,
    next
) => {
    if (!req.file) {
        return next(
            new AppError(
                'Foto absensi wajib diupload',
                422,
                [
                    {
                        field:
                            'photo',

                        message:
                            'Foto absensi wajib diupload'
                    }
                ]
            )
        );
    }

    const detectedMimeType =
        detectImageMimeType(
            req.file.buffer
        );

    if (!detectedMimeType) {
        return next(
            new AppError(
                'File yang diupload bukan gambar JPEG atau PNG yang valid',
                422,
                [
                    {
                        field:
                            'photo',

                        message:
                            'File gambar tidak valid'
                    }
                ]
            )
        );
    }

    /*
     * Jangan hanya percaya mimetype
     * yang dikirim client.
     */
    if (
        detectedMimeType !==
        req.file.mimetype
    ) {
        return next(
            new AppError(
                'Tipe file tidak sesuai dengan isi file',
                422
            )
        );
    }

    /*
     * Kita simpan hasil MIME
     * yang sudah diverifikasi.
     */
    req.file.detectedMimeType =
        detectedMimeType;

    next();
};

export {
    uploadAttendancePhoto,
    validateAttendancePhoto
};