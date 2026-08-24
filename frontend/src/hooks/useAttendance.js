import {
    useCallback,
    useEffect,
    useState
} from 'react';

import {
    getTodayAttendance
} from '../services/attendance.service';

import {
    handleApiError
} from '../utils/errorHandler';

export default function useAttendance() {
    const [
        today,
        setToday
    ] =
        useState(null);

    const [
        loading,
        setLoading
    ] =
        useState(true);

    const [
        error,
        setError
    ] =
        useState('');

    const loadAttendance =
        useCallback(
            async ({
                force = false
            } = {}) => {
                setLoading(true);
                setError('');

                try {
                    const result =
                        await getTodayAttendance({
                            force
                        });

                    setToday(
                        result
                    );

                    return result;
                } catch (requestError) {
                    setError(
                        handleApiError(
                            requestError,
                            'Data absensi hari ini gagal dimuat.'
                        )
                    );

                    throw requestError;
                } finally {
                    setLoading(false);
                }
            },
            []
        );

    useEffect(() => {
        let active = true;

        getTodayAttendance()
            .then(result => {
                if (active) {
                    setToday(
                        result
                    );
                }
            })
            .catch(requestError => {
                if (active) {
                    setError(
                        handleApiError(
                            requestError,
                            'Data absensi hari ini gagal dimuat.'
                        )
                    );
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    return {
        today,

        attendance:
            today?.attendance ??
            null,

        loading,
        error,

        refresh: () =>
            loadAttendance({
                force: true
            })
    };
}