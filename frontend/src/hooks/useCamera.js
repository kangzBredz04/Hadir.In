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

        case 'OverconstrainedError':
        case 'ConstraintNotSatisfiedError':
            return (
                'Kamera yang dipilih tidak tersedia pada perangkat ini.'
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

    /*
     * user        = kamera depan
     * environment = kamera belakang
     */
    const [
        facingMode,
        setFacingMode
    ] =
        useState('user');

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
                    'NotAllowedError' ||
                    cameraError?.name ===
                    'PermissionDeniedError'
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

    const switchCamera =
        useCallback(() => {
            /*
             * Hapus foto lama supaya setelah
             * pindah kamera user kembali
             * melihat live camera.
             */
            setPreview(null);
            setPhotoFile(null);

            /*
             * Reset status karena stream
             * webcam akan dibuat ulang.
             */
            setCameraReady(false);

            setError('');

            setFacingMode(
                current =>
                    current ===
                        'user'
                        ? 'environment'
                        : 'user'
            );
        }, []);

    return {
        cameraReady,
        permission,

        facingMode,

        preview,
        photoFile,

        capturing,
        error,

        capture,
        retake,
        clearCapture,
        switchCamera,

        handleUserMedia,
        handleUserMediaError
    };
}