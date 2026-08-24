import { ArrowLeft, Building2, MapPin, Navigation, Ruler } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import OfficeMapPicker from '../../components/office/OfficeMapPicker.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { getOfficeById } from '../../services/office.service.js';
import { handleApiError } from '../../utils/errorHandler.js';

function Item({ icon: Icon, label, value }) { return <div className="flex gap-3 rounded-2xl border border-border p-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-light text-primary"><Icon aria-hidden="true" size={18} /></span><div><p className="text-xs text-ink-muted">{label}</p><p className="mt-1 text-sm font-semibold text-primary-dark">{value ?? '-'}</p></div></div>; }

export default function AdminOfficeDetail() {
  const { id } = useParams(); const [office, setOffice] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const loadData = useCallback(async () => { setLoading(true); setError(''); try { setOffice(await getOfficeById(id)); } catch (requestError) { setError(handleApiError(requestError, 'Detail kantor belum dapat dimuat.')); } finally { setLoading(false); } }, [id]);
  useEffect(() => {
    const frame = requestAnimationFrame(loadData);
    return () => cancelAnimationFrame(frame);
  }, [loadData]);
  if (loading) return <Skeleton className="h-96" />; if (error) return <ErrorState message={error} onRetry={loadData} />;
  const mapUrl = office.latitude !== null && office.longitude !== null ? `https://www.google.com/maps?q=${office.latitude},${office.longitude}` : null;
  return <div className="space-y-6"><Link to="/admin/offices" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft aria-hidden="true" size={18} /> Kembali ke Offices</Link><PageHeader eyebrow="Lokasi operasional" title="Detail Office" description="Koordinat dan konfigurasi radius kantor." /><Card className="p-5 sm:p-6"><div className="flex items-start justify-between gap-4 border-b border-border pb-5"><div><h2 className="text-xl font-bold text-primary-dark">{office.name}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">{office.address}</p></div><Badge variant={office.isActive ? 'success' : 'danger'}>{office.isActive ? 'Aktif' : 'Nonaktif'}</Badge></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><Item icon={Navigation} label="Latitude" value={office.latitude} /><Item icon={Navigation} label="Longitude" value={office.longitude} /><Item icon={Ruler} label="Radius Absensi" value={office.radiusMeter !== null ? `${office.radiusMeter} meter` : '-'} /><Item icon={Building2} label="Status" value={office.isActive ? 'Aktif' : 'Nonaktif'} /></div>{mapUrl && <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-dark"><MapPin aria-hidden="true" size={17} /> Lihat di Google Maps</a>}</Card>{mapUrl && <OfficeMapPicker latitude={office.latitude} longitude={office.longitude} radius={office.radiusMeter} onLocationChange={() => {}} readOnly />}</div>;
}
