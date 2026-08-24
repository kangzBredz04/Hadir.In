import { useCallback, useEffect, useState } from 'react';
import { getAttendanceHistory } from '../services/attendance.service.js';
import { handleApiError } from '../utils/errorHandler.js';

export default function useAttendanceHistory({ page, limit, startDate, endDate }) {
  const [data, setData] = useState({
    items: [],
    pagination: { page: 1, limit, total: 0, totalPages: 1 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    const loadingFrame = requestAnimationFrame(() => {
      if (active) {
        setLoading(true);
        setError('');
      }
    });

    getAttendanceHistory({ page, limit, startDate, endDate })
      .then((response) => {
        if (active) setData(response);
      })
      .catch((requestError) => {
        if (active) {
          setError(handleApiError(requestError, 'Riwayat absensi belum dapat dimuat.'));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      cancelAnimationFrame(loadingFrame);
    };
  }, [page, limit, startDate, endDate, refreshKey]);

  const refetch = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  return { ...data, loading, error, refetch };
}
