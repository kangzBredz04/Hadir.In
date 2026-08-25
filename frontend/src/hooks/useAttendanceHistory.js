import {
    useCallback,
    useEffect,
    useState
} from 'react';

import {
    getAttendanceHistory
} from '../services/attendance.service';

import {
    handleApiError
} from '../utils/errorHandler';

export default function useAttendanceHistory({
    initialLimit = 10
} = {}) {
    const [
        items,
        setItems
    ] =
        useState([]);

    const [
        pagination,
        setPagination
    ] =
        useState({
            page: 1,
            limit: initialLimit,
            total: 0,
            totalPages: 0
        });

    const [
        filters,
        setFilters
    ] =
        useState({
            startDate: '',
            endDate: ''
        });

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

    const loadHistory =
        useCallback(
            async ({
                page = 1,
                startDate =
                filters.startDate,
                endDate =
                filters.endDate
            } = {}) => {
                setLoading(true);
                setError('');

                try {
                    const result =
                        await getAttendanceHistory({
                            page,

                            limit:
                                pagination.limit,

                            startDate,
                            endDate
                        });

                    setItems(
                        result.items
                    );

                    setPagination(
                        result.pagination
                    );

                    return result;
                } catch (
                requestError
                ) {
                    setError(
                        handleApiError(
                            requestError,
                            'Riwayat absensi gagal dimuat.'
                        )
                    );

                    return null;
                } finally {
                    setLoading(false);
                }
            },
            [
                filters.startDate,
                filters.endDate,
                pagination.limit
            ]
        );

    useEffect(() => {
        loadHistory({
            page: 1
        });
    }, []);

    const applyFilters =
        useCallback(
            async ({
                startDate,
                endDate
            }) => {
                setFilters({
                    startDate,
                    endDate
                });

                return loadHistory({
                    page: 1,
                    startDate,
                    endDate
                });
            },
            [loadHistory]
        );

    const resetFilters =
        useCallback(
            async () => {
                setFilters({
                    startDate: '',
                    endDate: ''
                });

                return loadHistory({
                    page: 1,
                    startDate: '',
                    endDate: ''
                });
            },
            [loadHistory]
        );

    const changePage =
        useCallback(
            page =>
                loadHistory({
                    page
                }),
            [loadHistory]
        );

    return {
        items,
        pagination,
        filters,
        loading,
        error,

        applyFilters,
        resetFilters,
        changePage,

        refresh: () =>
            loadHistory({
                page:
                    pagination.page
            })
    };
}