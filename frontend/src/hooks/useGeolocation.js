import {
    useCallback,
    useEffect,
    useState
} from 'react';

function getLocationErrorMessage(
    error
) {
    switch (error?.code) {
        case 1:
            return (
                'Akses lokasi ditolak. ' +
                'Izinkan akses lokasi pada browser Anda.'
            );

        case 2:
            return (
                'Lokasi tidak tersedia. ' +
                'Pastikan GPS perangkat Anda aktif.'
            );

        case 3:
            return (
                'Gagal mendapatkan lokasi. ' +
                'Silakan coba lagi.'
            );

        default:
            return (
                'Lokasi tidak dapat diperoleh.'
            );
    }
}

export default function useGeolocation() {
    const [
        latitude,
        setLatitude
    ] =
        useState(null);

    const [
        longitude,
        setLongitude
    ] =
        useState(null);

    const [
        accuracy,
        setAccuracy
    ] =
        useState(null);

    const [
        loading,
        setLoading
    ] =
        useState(false);

    const [
        error,
        setError
    ] =
        useState('');

    const [
        permission,
        setPermission
    ] =
        useState('unknown');

    useEffect(() => {
        if (
            !navigator.permissions?.query
        ) {
            return;
        }

        let permissionStatus;

        navigator.permissions
            .query({
                name:
                    'geolocation'
            })
            .then(status => {
                permissionStatus =
                    status;

                setPermission(
                    status.state
                );

                status.onchange =
                    () => {
                        setPermission(
                            status.state
                        );
                    };
            })
            .catch(() => {
                setPermission(
                    'unknown'
                );
            });

        return () => {
            if (
                permissionStatus
            ) {
                permissionStatus.onchange =
                    null;
            }
        };
    }, []);

    const getLocation =
        useCallback(() => {
            setError('');

            if (
                !navigator.geolocation
            ) {
                setError(
                    'Browser Anda tidak mendukung fitur lokasi.'
                );

                setPermission(
                    'unsupported'
                );

                return;
            }

            setLoading(true);

            navigator.geolocation
                .getCurrentPosition(
                    position => {
                        setLatitude(
                            position.coords
                                .latitude
                        );

                        setLongitude(
                            position.coords
                                .longitude
                        );

                        setAccuracy(
                            position.coords
                                .accuracy
                        );

                        setPermission(
                            'granted'
                        );

                        setError('');

                        setLoading(false);
                    },

                    locationError => {
                        setLatitude(null);
                        setLongitude(null);
                        setAccuracy(null);

                        if (
                            locationError.code ===
                            1
                        ) {
                            setPermission(
                                'denied'
                            );
                        }

                        setError(
                            getLocationErrorMessage(
                                locationError
                            )
                        );

                        setLoading(false);
                    },

                    {
                        enableHighAccuracy:
                            true,

                        timeout:
                            15000,

                        maximumAge:
                            0
                    }
                );
        }, []);

    return {
        latitude,
        longitude,
        accuracy,

        loading,
        error,
        permission,

        getLocation
    };
}