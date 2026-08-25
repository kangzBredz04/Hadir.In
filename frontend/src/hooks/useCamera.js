import {
    useCallback,
    useState
} from 'react';

import {
    dataUrlToFile
} from '../utils/dataUrlToFile';

function getCameraErrorMessage(
    error
) {
    const errorName =
        error?.name ??
        '';

    switch (
    errorName
    ) {
        case 'NotAllowedError':
        case 'PermissionDeniedError':
            return (
                'Akses kamera ditolak. ' +
                'Izinkan akses kamera pada browser Anda.'
            );

        case 'NotFoundError':
        case 'DevicesNotFoundError':
            return (
                'Kamera tidak ditemukan pada perangkat ini.'
            );

        case 'NotReadableError':
        case 'TrackStartError':
            return (
                'Kamera sedang digunakan aplikasi lain.'
            );

        default:
            return (
                'Kamera tidak dapat digunakan. Silakan coba kembali.'
            );
    }
}

export default function useCamera() {
    const [
        cameraReady,
        setCameraReady
    ] =
        useState(false);

    const [
        permission,
        setPermission
    ] =
        useState('prompt');

    const [
        preview,
        setPreview
    ] =
        useState(null);

    const [
        photoFile,
        setPhotoFile
    ] =
        useState(null);

    const [
        error,
        setError
    ] =
        useState('');

    const [
        capturing,
        setCapturing
    ] =
        useState(false);

    const handleUserMedia =
        useCallback(() => {
            setCameraReady(true);

            setPermission(
                'granted'
            );

            setError('');
        }, []);

    const handleUserMediaError =
        useCallback(
            cameraError => {
                setCameraReady(false);

                if (
                    cameraError?.name ===
                    'NotAllowedError'
                ) {
                    setPermission(
                        'denied'
                    );
                }

                setError(
                    getCameraErrorMessage(
                        cameraError
                    )
                );
            },
            []
        );

    const capture =
        useCallback(
            async webcamRef => {
                if (
                    !webcamRef?.current
                ) {
                    setError(
                        'Kamera belum siap digunakan.'
                    );

                    return null;
                }

                setCapturing(true);
                setError('');

                try {
                    const screenshot =
                        webcamRef
                            .current
                            .getScreenshot();

                    if (!screenshot) {
                        throw new Error(
                            'Foto gagal diambil.'
                        );
                    }

                    const file =
                        await dataUrlToFile(
                            screenshot
                        );

                    setPreview(
                        screenshot
                    );

                    setPhotoFile(
                        file
                    );

                    return file;
                } catch {
                    setError(
                        'Foto gagal diambil. Silakan coba kembali.'
                    );

                    return null;
                } finally {
                    setCapturing(
                        false
                    );
                }
            },
            []
        );

    const retake =
        useCallback(() => {
            setPreview(null);
            setPhotoFile(null);
            setError('');
        }, []);

    const clearCapture =
        useCallback(() => {
            setPreview(null);
            setPhotoFile(null);
            setError('');
        }, []);

    return {
        cameraReady,
        permission,

        preview,
        photoFile,

        capturing,
        error,

        capture,
        retake,
        clearCapture,

        handleUserMedia,
        handleUserMediaError
    };
}