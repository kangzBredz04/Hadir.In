import { ArrowLeft, Building2, CalendarDays, IdCard, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { getUserById } from '../../services/user.service.js';
import { handleApiError } from '../../utils/errorHandler.js';
import { formatDate } from '../../utils/formatDate.js';

function Item({ icon: Icon, label, value }) { return <div className="flex gap-3 rounded-2xl border border-border p-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-light text-primary"><Icon aria-hidden="true" size={18} /></span><div><p className="text-xs text-ink-muted">{label}</p><p className="mt-1 break-all text-sm font-semibold text-primary-dark">{value || '-'}</p></div></div>; }

export default function AdminEmployeeDetail() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const loadData = useCallback(async () => { setLoading(true); setError(''); try { setEmployee(await getUserById(id)); } catch (requestError) { setError(handleApiError(requestError, 'Detail employee belum dapat dimuat.')); } finally { setLoading(false); } }, [id]);
  useEffect(() => {
    const frame = requestAnimationFrame(loadData);
    return () => cancelAnimationFrame(frame);
  }, [loadData]);
  if (loading) return <Skeleton className="h-96" />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;
  return <div className="space-y-6"><Link to="/admin/employees" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft aria-hidden="true" size={18} /> Kembali ke Employees</Link><PageHeader eyebrow="Master data" title="Detail Employee" description="Informasi akun dan penempatan employee." /><Card className="p-5 sm:p-6"><div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-bold text-primary-dark">{employee.name}</h2><p className="mt-1 text-sm text-ink-muted">{employee.employeeId}</p></div><Badge variant={employee.isActive ? 'success' : 'danger'}>{employee.isActive ? 'Akun Aktif' : 'Akun Nonaktif'}</Badge></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><Item icon={IdCard} label="Employee ID" value={employee.employeeId} /><Item icon={UserRound} label="Nama" value={employee.name} /><Item icon={Mail} label="Email" value={employee.email} /><Item icon={ShieldCheck} label="Role" value={employee.role} /><Item icon={Building2} label="Kantor" value={employee.office?.name} /><Item icon={CalendarDays} label="Dibuat" value={employee.createdAt ? formatDate(employee.createdAt, { weekday: undefined }) : '-'} /></div></Card></div>;
}
