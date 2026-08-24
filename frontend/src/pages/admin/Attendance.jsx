import { CalendarDays, Eye, Filter, History, RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AttendanceStatusBadge from '../../components/attendance/AttendanceStatusBadge.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Input from '../../components/ui/Input.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import Select from '../../components/ui/Select.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { getAdminAttendance } from '../../services/attendance.service.js';
import { getOffices } from '../../services/office.service.js';
import { getUsers } from '../../services/user.service.js';
import { handleApiError } from '../../utils/errorHandler.js';
import { formatDate } from '../../utils/formatDate.js';
import { formatTime } from '../../utils/formatTime.js';

const LIMIT = 10;
const emptyFilters = { startDate: '', endDate: '', userId: '', officeId: '', status: '' };
const distance = (value) => value === null || value === undefined ? '-' : `${Math.round(value)} m`;

function MobileCard({ item }) {
  return <Card className="p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs text-ink-muted">{formatDate(item.date, { weekday: undefined })}</p><h2 className="mt-1 font-bold text-primary-dark">{item.user?.name ?? 'Employee'}</h2><p className="mt-1 text-xs text-ink-muted">{item.office?.name ?? '-'}</p></div><AttendanceStatusBadge status={item.status} /></div><div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-background p-3 text-center"><div><p className="text-[10px] text-ink-muted">Check In</p><p className="mt-1 text-xs font-semibold text-primary-dark">{formatTime(item.checkInTime)}</p></div><div><p className="text-[10px] text-ink-muted">Check Out</p><p className="mt-1 text-xs font-semibold text-primary-dark">{formatTime(item.checkOutTime)}</p></div><div><p className="text-[10px] text-ink-muted">Jarak</p><p className="mt-1 text-xs font-semibold text-primary-dark">{distance(item.checkInDistance)}</p></div></div><Link to={`/admin/attendance/${item.id}`} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary-light text-sm font-semibold text-primary"><Eye aria-hidden="true" size={17} /> Lihat detail</Link></Card>;
}

export default function AdminAttendance() {
  const [items, setItems] = useState([]); const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [filters, setFilters] = useState(emptyFilters); const [appliedFilters, setAppliedFilters] = useState(emptyFilters); const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]); const [offices, setOffices] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [filterError, setFilterError] = useState('');
  const loadData = useCallback(async () => { setLoading(true); setError(''); try { const result = await getAdminAttendance({ page, limit: LIMIT, ...appliedFilters }); setItems(result.items); setPagination(result.pagination); } catch (requestError) { setError(handleApiError(requestError, 'Data absensi admin belum dapat dimuat.')); } finally { setLoading(false); } }, [appliedFilters, page]);
  useEffect(() => {
    const frame = requestAnimationFrame(loadData);
    return () => cancelAnimationFrame(frame);
  }, [loadData]);
  useEffect(() => { Promise.all([getUsers({ page: 1, limit: 100, role: 'EMPLOYEE', status: 'true' }), getOffices({ page: 1, limit: 100, status: 'true' })]).then(([userData, officeData]) => { setUsers(userData.items); setOffices(officeData.items); }).catch(() => { setUsers([]); setOffices([]); }); }, []);
  function apply(event) { event.preventDefault(); if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) { setFilterError('Tanggal mulai tidak boleh melebihi tanggal akhir.'); return; } setFilterError(''); setAppliedFilters(filters); setPage(1); }

  return <div className="space-y-6"><PageHeader eyebrow="Monitoring kehadiran" title="Attendance" description="Pantau catatan check-in dan check-out seluruh employee." />
    <Card className="p-4 sm:p-5"><form onSubmit={apply} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><Input id="admin-attendance-start" type="date" label="Dari tanggal" leadingIcon={CalendarDays} value={filters.startDate} onChange={(event) => setFilters((current) => ({ ...current, startDate: event.target.value }))} /><Input id="admin-attendance-end" type="date" label="Sampai tanggal" leadingIcon={CalendarDays} value={filters.endDate} onChange={(event) => setFilters((current) => ({ ...current, endDate: event.target.value }))} /><Select id="admin-attendance-user" label="Employee" value={filters.userId} onChange={(event) => setFilters((current) => ({ ...current, userId: event.target.value }))}><option value="">Semua employee</option>{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</Select><Select id="admin-attendance-office" label="Office" value={filters.officeId} onChange={(event) => setFilters((current) => ({ ...current, officeId: event.target.value }))}><option value="">Semua office</option>{offices.map((office) => <option key={office.id} value={office.id}>{office.name}</option>)}</Select><Select id="admin-attendance-status" label="Status" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}><option value="">Semua status</option><option value="PRESENT">Hadir</option><option value="LATE">Terlambat</option><option value="ABSENT">Tidak Hadir</option></Select><div className="flex gap-2 sm:col-span-2 xl:col-span-5 xl:justify-end"><Button type="submit"><Filter aria-hidden="true" size={17} /> Terapkan</Button><Button type="button" variant="secondary" onClick={() => { setFilters(emptyFilters); setAppliedFilters(emptyFilters); setFilterError(''); setPage(1); }}><RotateCcw aria-hidden="true" size={17} /> Reset</Button></div></form>{filterError && <p className="mt-3 text-sm font-medium text-danger" role="alert">{filterError}</p>}</Card>
    {loading ? <div className="space-y-3">{Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-20" />)}</div> : error ? <ErrorState message={error} onRetry={loadData} /> : items.length === 0 ? <EmptyState icon={History} title="Belum ada data absensi" message="Data yang sesuai dengan filter belum tersedia." /> : <><div className="space-y-3 md:hidden">{items.map((item) => <MobileCard key={item.id} item={item} />)}</div><Card className="hidden overflow-hidden md:block"><div className="overflow-x-auto"><table className="w-full min-w-[1000px] text-left text-sm"><caption className="sr-only">Daftar absensi seluruh employee</caption><thead className="border-b border-border bg-background text-xs uppercase tracking-wide text-ink-muted"><tr><th scope="col" className="px-5 py-4">Tanggal</th><th scope="col" className="px-5 py-4">Employee</th><th scope="col" className="px-5 py-4">Office</th><th scope="col" className="px-5 py-4">Check In</th><th scope="col" className="px-5 py-4">Check Out</th><th scope="col" className="px-5 py-4">Status</th><th scope="col" className="px-5 py-4">Jarak</th><th scope="col" className="px-5 py-4 text-right">Action</th></tr></thead><tbody className="divide-y divide-border">{items.map((item) => <tr key={item.id} className="hover:bg-primary-soft/50"><td className="whitespace-nowrap px-5 py-4 font-semibold text-primary-dark">{formatDate(item.date, { weekday: undefined })}</td><td className="px-5 py-4"><p className="font-semibold text-primary-dark">{item.user?.name ?? 'Employee'}</p><p className="text-xs text-ink-muted">{item.user?.employeeId ?? '-'}</p></td><td className="px-5 py-4 text-ink-muted">{item.office?.name ?? '-'}</td><td className="px-5 py-4 font-medium">{formatTime(item.checkInTime)}</td><td className="px-5 py-4 font-medium">{formatTime(item.checkOutTime)}</td><td className="px-5 py-4"><AttendanceStatusBadge status={item.status} /></td><td className="px-5 py-4 text-ink-muted">{distance(item.checkInDistance)}</td><td className="px-5 py-4 text-right"><Link to={`/admin/attendance/${item.id}`} className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 font-semibold text-primary hover:bg-primary-light"><Eye aria-hidden="true" size={17} /> Detail</Link></td></tr>)}</tbody></table></div></Card><Pagination currentPage={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={setPage} /></>}
  </div>;
}
