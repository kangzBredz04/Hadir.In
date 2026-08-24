const EARTH_RADIUS_METERS = 6371000;

function toRadians(value) {
  return (Number(value) * Math.PI) / 180;
}

export function calculateDistanceMeters(latitudeA, longitudeA, latitudeB, longitudeB) {
  const rawValues = [latitudeA, longitudeA, latitudeB, longitudeB];
  if (rawValues.some((value) => value === null || value === undefined || value === '')) return null;

  const values = rawValues.map(Number);
  if (values.some((value) => !Number.isFinite(value))) return null;

  const [latA, lonA, latB, lonB] = values.map(toRadians);
  const latitudeDelta = latB - latA;
  const longitudeDelta = lonB - lonA;
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(latA) * Math.cos(latB) * Math.sin(longitudeDelta / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(haversine));
}

export function getGeolocationError(error) {
  const messages = {
    1: 'Akses lokasi ditolak. Izinkan akses lokasi pada browser Anda.',
    2: 'Lokasi tidak tersedia. Aktifkan GPS untuk melakukan absensi.',
    3: 'Gagal mendapatkan lokasi. Silakan coba lagi.',
  };

  return {
    code: error?.code ?? 'UNKNOWN',
    message: messages[error?.code] ?? 'Lokasi tidak dapat ditemukan. Silakan coba lagi.',
  };
}
