import { useCallback, useEffect, useState } from 'react';
import { getGeolocationError } from '../utils/geolocation.js';

const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

export default function useGeolocation({ auto = true } = {}) {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
  });
  const [permission, setPermission] = useState('prompt');
  const [loading, setLoading] = useState(auto);
  const [error, setError] = useState(null);

  const handleSuccess = useCallback((position) => {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
    });
    setPermission('granted');
    setError(null);
    setLoading(false);
  }, []);

  const handleError = useCallback((positionError) => {
    setError(getGeolocationError(positionError));
    if (positionError?.code === 1) setPermission('denied');
    setLoading(false);
  }, []);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError({ code: 'UNSUPPORTED', message: 'Browser Anda tidak mendukung fitur lokasi.' });
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, GEOLOCATION_OPTIONS);
  }, [handleError, handleSuccess]);

  useEffect(() => {
    if (!auto) return undefined;

    if (!navigator.geolocation) {
      Promise.resolve().then(() => {
        setError({ code: 'UNSUPPORTED', message: 'Browser Anda tidak mendukung fitur lokasi.' });
        setLoading(false);
      });
      return undefined;
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, GEOLOCATION_OPTIONS);
    return undefined;
  }, [auto, handleError, handleSuccess]);

  useEffect(() => {
    if (!navigator.permissions?.query) return undefined;

    let permissionStatus;
    let active = true;

    navigator.permissions
      .query({ name: 'geolocation' })
      .then((status) => {
        if (!active) return;
        permissionStatus = status;
        setPermission(status.state);
        status.onchange = () => setPermission(status.state);
      })
      .catch(() => undefined);

    return () => {
      active = false;
      if (permissionStatus) permissionStatus.onchange = null;
    };
  }, []);

  return {
    ...location,
    permission,
    loading,
    error,
    getLocation,
  };
}
