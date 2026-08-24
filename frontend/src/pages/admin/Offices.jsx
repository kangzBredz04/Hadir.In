import { Building2, Eye, MapPin, Pencil, Plus, Search, XCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import OfficeForm from '../../components/office/OfficeForm.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Dialog from '../../components/ui/Dialog.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Input from '../../components/ui/Input.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import Select from '../../components/ui/Select.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { createOffice, deactivateOffice, getOffices, updateOffice } from '../../services/office.service.js';
import { handleApiError } from '../../utils/errorHandler.js';

const LIMIT = 10;

export default function AdminOffices() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState({ open: false, office: null });
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [mutating, setMutating] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true); setError('');
    try { const result = await getOffices({ page, limit: LIMIT, ...appliedFilters }); setItems(result.items); setPagination(result.pagination); }
    catch (requestError) { setError(handleApiError(requestError, 'Data kantor belum dapat dimuat.')); }
    finally { setLoading(false); }
  }, [appliedFilters, page]);
  useEffect(() => {
    const frame = requestAnimationFrame(loadData);
    return () => cancelAnimationFrame(frame);
  }, [loadData]);

  async function save(payload) {
    setMutating(true);
    try { if (formState.office) { await updateOffice(formState.office.id, payload); showToast('Office berhasil diperbarui.'); } else { await createOffice(payload); showToast('Office berhasil dibuat.'); } setFormState({ open: false, office: null }); loadData(); }
    catch (requestError) { showToast(handleApiError(requestError, 'Office belum dapat disimpan.'), 'error'); }
    finally { setMutating(false); }
  }
  async function confirmDeactivate() {
    setMutating(true);
    try { await deactivateOffice(deactivateTarget.id); showToast('Office berhasil dinonaktifkan.'); setDeactivateTarget(null); loadData(); }
    catch (requestError) { showToast(handleApiError(requestError, 'Office belum dapat dinonaktifkan.'), 'error'); }
    finally { setMutating(false); }
  }

  return <div className="space-y-6">
    <PageHeader eyebrow="Lokasi operasional" title="Offices" description="Kelola koordinat dan radius absensi setiap kantor." action={<Button onClick={() => setFormState({ open: true, office: null })}><Plus aria-hidden="true" size={18} /> Tambah Office</Button>} />
    <Card className="p-4 sm:p-5"><form onSubmit={(event) => { event.preventDefault(); setAppliedFilters(filters); setPage(1); }} className="grid gap-4 md:grid-cols-[1fr_.5fr_auto] md:items-end"><Input id="office-search" label="Cari kantor" placeholder="Nama atau alamat kantor" leadingIcon={Search} value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} /><Select id="office-status-filter" label="Status" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}><option value="">Semua status</option><option value="true">Aktif</option><option value="false">Nonaktif</option></Select><div className="flex gap-2"><Button type="submit" className="flex-1">Terapkan</Button><Button type="button" variant="secondary" onClick={() => { const empty = { search: '', status: '' }; setFilters(empty); setAppliedFilters(empty); setPage(1); }}>Reset</Button></div></form></Card>
    {loading ? <div className="space-y-3">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-24" />)}</div> : error ? <ErrorState message={error} onRetry={loadData} /> : items.length === 0 ? <EmptyState icon={Building2} title="Belum ada kantor yang terdaftar" message="Tambahkan kantor agar employee dapat ditempatkan dan melakukan absensi." /> : <><div className="grid gap-4 xl:grid-cols-2">{items.map((office) => <Card key={office.id} className="p-5"><div className="flex items-start justify-between gap-4"><span className="grid size-11 place-items-center rounded-2xl bg-primary-light text-primary"><Building2 aria-hidden="true" size={22} /></span><Badge variant={office.isActive ? 'success' : 'danger'}>{office.isActive ? 'Aktif' : 'Nonaktif'}</Badge></div><h2 className="mt-5 font-bold text-primary-dark">{office.name}</h2><p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-ink-muted">{office.address}</p><div className="mt-4 flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-background px-3 py-1.5 text-ink-muted"><MapPin aria-hidden="true" size={14} className="mr-1 inline" />Radius {office.radiusMeter ?? '-'} m</span><span className="rounded-full bg-background px-3 py-1.5 text-ink-muted">{office.latitude ?? '-'}, {office.longitude ?? '-'}</span></div><div className="mt-5 flex justify-end gap-1 border-t border-border pt-4"><Link to={`/admin/offices/${office.id}`} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-primary hover:bg-primary-light"><Eye aria-hidden="true" size={16} /> Detail</Link><button type="button" onClick={() => setFormState({ open: true, office })} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-warning hover:bg-warning-light"><Pencil aria-hidden="true" size={16} /> Edit</button>{office.isActive && <button type="button" onClick={() => setDeactivateTarget(office)} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-danger hover:bg-danger-light"><XCircle aria-hidden="true" size={16} /> Nonaktifkan</button>}</div></Card>)}</div><Pagination currentPage={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={setPage} /></>}
    <Modal open={formState.open} onClose={() => setFormState({ open: false, office: null })} title={formState.office ? 'Edit Office' : 'Tambah Office'} description="Pastikan koordinat dan radius sesuai lokasi fisik kantor."><OfficeForm key={formState.office?.id ?? 'new'} office={formState.office} onSubmit={save} onCancel={() => setFormState({ open: false, office: null })} loading={mutating} /></Modal>
    <Dialog open={Boolean(deactivateTarget)} onClose={() => setDeactivateTarget(null)} onConfirm={confirmDeactivate} title="Nonaktifkan office?" message={`Kantor ${deactivateTarget?.name ?? ''} tidak dapat digunakan untuk penempatan dan absensi baru.`} confirmLabel="Nonaktifkan" loading={mutating} />
  </div>;
}
