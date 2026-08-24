import { ArrowLeft, Building2, Clock3, IdCard, MapPin, Ruler, UserRound } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AttendanceStatusBadge from '../../components/attendance/AttendanceStatusBadge.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import PhotoViewer from '../../components/ui/PhotoViewer.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { getAdminAttendanceDetail } from '../../services/attendance.service.js';
import { handleApiError } from '../../utils/errorHandler.js';
import { formatDate } from '../../utils/formatDate.js';
import { formatTime } from '../../utils/formatTime.js';

const present = (value) => value !== null && value !== undefined && value !== '';
function Item({ icon: Icon, label, value }) { return <div className="flex gap-3 rounded-2xl border border-border p-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-light text-primary"><Icon aria-hidden="true" size={18} /></span><div className="min-w-0"><p className="text-xs text-ink-muted">{label}</p><p className="mt-1 break-all text-sm font-semibold text-primary-dark">{value ?? '-'}</p></div></div>; }
function Moment({ title, time, latitude, longitude, distance, photo }) { const available = Boolean(time); return <Card className="p-5 sm:p-6"><h2 className="font-bold text-primary-dark">{title}</h2>{!available ? <p className="mt-4 rounded-2xl border border-dashed border-border bg-background p-6 text-center text-sm text-ink-muted">Belum ada data {title.toLowerCase()}.</p> : <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_.65fr]"><div className="grid gap-3 sm:grid-cols-2"><Item icon={Clock3} label="Waktu" value={formatTime(time)} /><Item icon={Ruler} label="Jarak" value={present(distance) ? `${Math.round(distance)} meter` : '-'} /><Item icon={MapPin} label="Latitude" value={present(latitude) ? Number(latitude).toFixed(6) : '-'} /><Item icon={MapPin} label="Longitude" value={present(longitude) ? Number(longitude).toFixed(6) : '-'} /></div><PhotoViewer src={photo} alt={`Foto ${title}`} label={`Bukti ${title}`} /></div>}</Card>; }

export default function AdminAttendanceDetail() {
  const { id } = useParams(); const [item, setItem] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const loadData = useCallback(async () => { setLoading(true); setError(''); try { setItem(await getAdminAttendanceDetail(id)); } catch (requestError) { setError(handleApiError(requestError, 'Detail absensi belum dapat dimuat.')); } finally { setLoading(false); } }, [id]);
  useEffect(() => {
    const frame = requestAnimationFrame(loadData);
    return () => cancelAnimationFrame(frame);
  }, [loadData]);
  if (loading) return <Skeleton className="h-[36rem]" />; if (error) return <ErrorState message={error} onRetry={loadData} />;
  return <div className="space-y-6"><Link to="/admin/attendance" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft aria-hidden="true" size={18} /> Kembali ke Attendance</Link><PageHeader eyebrow="Monitoring kehadiran" title="Attendance Detail" description="Audit lengkap waktu, lokasi, jarak, dan bukti foto employee." /><Card className="p-5 sm:p-6"><div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">{formatDate(item.date)}</p><h2 className="mt-2 text-xl font-bold text-primary-dark">{item.user?.name ?? 'Employee'}</h2></div><AttendanceStatusBadge status={item.status} /></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Item icon={UserRound} label="Employee" value={item.user?.name} /><Item icon={IdCard} label="Employee ID" value={item.user?.employeeId} /><Item icon={Building2} label="Office" value={item.office?.name} /><Item icon={Ruler} label="Radius Office" value={present(item.office?.radiusMeter ?? item.office?.radius_meter) ? `${item.office?.radiusMeter ?? item.office?.radius_meter} meter` : '-'} /></div>{item.office?.address && <p className="mt-4 text-sm text-ink-muted">{item.office.address}</p>}</Card><Moment title="Check In" time={item.checkInTime} latitude={item.checkInLatitude} longitude={item.checkInLongitude} distance={item.checkInDistance} photo={item.checkInPhotoUrl} /><Moment title="Check Out" time={item.checkOutTime} latitude={item.checkOutLatitude} longitude={item.checkOutLongitude} distance={item.checkOutDistance} photo={item.checkOutPhotoUrl} /></div>;
}
