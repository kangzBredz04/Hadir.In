import L from 'leaflet';
import { Crosshair, LocateFixed, MapPin } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Circle, MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import Button from '../ui/Button.jsx';

const BANDUNG_CENTER = [-6.917464, 107.619123];

const officeMarkerIcon = L.divIcon({
  className: 'office-map-marker',
  html: '<span><i></i></span>',
  iconSize: [38, 46],
  iconAnchor: [19, 43],
});

function hasCoordinate(latitude, longitude) {
  return Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude)) && latitude !== '' && longitude !== '';
}

function MapView({ position }) {
  const map = useMap();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      map.invalidateSize();
      map.flyTo(position, Math.max(map.getZoom(), 16), { duration: 0.6 });
    });
    return () => cancelAnimationFrame(frame);
  }, [map, position]);

  return null;
}

function MapClickHandler({ disabled, onLocationChange }) {
  useMapEvents({
    click(event) {
      if (!disabled) onLocationChange({ latitude: event.latlng.lat, longitude: event.latlng.lng });
    },
  });
  return null;
}

export default function OfficeMapPicker({ latitude, longitude, radius = 100, onLocationChange, readOnly = false }) {
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const selected = hasCoordinate(latitude, longitude);
  const position = useMemo(
    () => selected ? [Number(latitude), Number(longitude)] : BANDUNG_CENTER,
    [latitude, longitude, selected],
  );
  const safeRadius = Number.isFinite(Number(radius)) && Number(radius) > 0 ? Number(radius) : 100;

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationError('Browser Anda tidak mendukung pencarian lokasi.');
      return;
    }
    setLocationLoading(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        onLocationChange({ latitude: coords.latitude, longitude: coords.longitude });
        setLocationLoading(false);
      },
      (error) => {
        const messages = {
          1: 'Akses lokasi ditolak. Izinkan akses lokasi pada browser Anda.',
          2: 'Lokasi tidak tersedia. Pastikan GPS perangkat aktif.',
          3: 'Pencarian lokasi terlalu lama. Silakan coba lagi.',
        };
        setLocationError(messages[error.code] ?? 'Lokasi belum dapat ditemukan.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-primary-dark"><MapPin aria-hidden="true" size={18} className="text-primary" /> {readOnly ? 'Lokasi Office' : 'Pilih Lokasi Office'}</div>
          <p className="mt-1 text-xs leading-5 text-ink-muted">{readOnly ? 'Lingkaran menunjukkan batas radius absensi.' : 'Klik peta atau geser marker untuk menentukan titik kantor.'}</p>
        </div>
        {!readOnly && <Button type="button" variant="secondary" onClick={useCurrentLocation} disabled={locationLoading}><LocateFixed aria-hidden="true" size={17} /> {locationLoading ? 'Mencari...' : 'Lokasi saya'}</Button>}
      </div>

      <div className="relative">
        <MapContainer center={position} zoom={selected ? 17 : 13} scrollWheelZoom className="h-80 w-full sm:h-96" aria-label="Peta lokasi kantor">
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapView position={position} />
          <MapClickHandler disabled={readOnly} onLocationChange={onLocationChange} />
          {selected && (
            <>
              <Circle center={position} radius={safeRadius} pathOptions={{ color: '#0756A3', fillColor: '#2F80C9', fillOpacity: 0.16, weight: 2 }} />
              <Marker
                position={position}
                icon={officeMarkerIcon}
                draggable={!readOnly}
                eventHandlers={{
                  dragend(event) {
                    const point = event.target.getLatLng();
                    onLocationChange({ latitude: point.lat, longitude: point.lng });
                  },
                }}
              />
            </>
          )}
        </MapContainer>
        {!selected && <div className="pointer-events-none absolute inset-x-4 top-4 z-[500] rounded-xl bg-white/95 p-3 text-center text-xs font-medium text-primary-dark shadow-card backdrop-blur"><Crosshair aria-hidden="true" size={16} className="mr-1.5 inline text-primary" />Klik peta untuk menempatkan kantor</div>}
      </div>

      <div className="grid gap-2 border-t border-border bg-background p-4 text-xs sm:grid-cols-3">
        <div><span className="text-ink-muted">Latitude</span><p className="mt-1 font-semibold text-primary-dark">{selected ? Number(latitude).toFixed(7) : 'Belum dipilih'}</p></div>
        <div><span className="text-ink-muted">Longitude</span><p className="mt-1 font-semibold text-primary-dark">{selected ? Number(longitude).toFixed(7) : 'Belum dipilih'}</p></div>
        <div><span className="text-ink-muted">Radius visual</span><p className="mt-1 font-semibold text-primary-dark">{safeRadius} meter</p></div>
      </div>
      {locationError && <p className="border-t border-danger/10 bg-danger-light px-4 py-3 text-xs font-medium text-danger" role="alert">{locationError}</p>}
    </section>
  );
}
