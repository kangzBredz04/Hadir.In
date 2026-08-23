const IMAGE_MIME_TYPES = {
    JPEG: 'image/jpeg',
    PNG: 'image/png'
};

const detectImageMimeType = (
    buffer
) => {
    if (
        !Buffer.isBuffer(buffer) ||
        buffer.length < 8
    ) {
        return null;
    }

    // JPEG:
    // FF D8 FF
    if (
        buffer[0] === 0xff &&
        buffer[1] === 0xd8 &&
        buffer[2] === 0xff
    ) {
        return IMAGE_MIME_TYPES.JPEG;
    }

    // PNG:
    // 89 50 4E 47 0D 0A 1A 0A
    if (
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47 &&
        buffer[4] === 0x0d &&
        buffer[5] === 0x0a &&
        buffer[6] === 0x1a &&
        buffer[7] === 0x0a
    ) {
        return IMAGE_MIME_TYPES.PNG;
    }

    return null;
};

const getExtensionFromMimeType = (
    mimeType
) => {
    switch (mimeType) {
        case IMAGE_MIME_TYPES.JPEG:
            return 'jpg';

        case IMAGE_MIME_TYPES.PNG:
            return 'png';

        default:
            return null;
    }
};

export {
    IMAGE_MIME_TYPES,
    detectImageMimeType,
    getExtensionFromMimeType
};