import { useCallback, useEffect, useState } from 'react';
import {
  checkIn,
  checkOut,
  getTodayAttendance,
  normalizeTodayAttendance,
} from '../services/attendance.service.js';
import { handleApiError } from '../utils/errorHandler.js';

export default function useAttendance() {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getTodayAttendance();
      setAttendance(data);
    } catch (requestError) {
      setError(handleApiError(requestError, 'Status absensi hari ini belum dapat dimuat.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    getTodayAttendance()
      .then((data) => {
        if (active) setAttendance(data);
      })
      .catch((requestError) => {
        if (active) {
          setError(handleApiError(requestError, 'Status absensi hari ini belum dapat dimuat.'));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const submitAttendance = useCallback(async ({ type, ...input }) => {
    setSubmitting(true);

    try {
      const response = type === 'check-out'
        ? await checkOut(input)
        : await checkIn(input);

      let updatedAttendance;

      try {
        updatedAttendance = await getTodayAttendance();
      } catch {
        updatedAttendance = normalizeTodayAttendance(response.payload);
      }

      setAttendance(updatedAttendance);
      return { response, attendance: updatedAttendance };
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { attendance, loading, error, refetch, submitting, submitAttendance };
}
