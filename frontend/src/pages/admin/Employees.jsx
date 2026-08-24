import { Eye, Pencil, Plus, Search, UserMinus, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import EmployeeForm from '../../components/employee/EmployeeForm.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
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
import { getOffices } from '../../services/office.service.js';
import { createUser, deactivateUser, getUsers, updateUser } from '../../services/user.service.js';
import { handleApiError } from '../../utils/errorHandler.js';

const LIMIT = 10;

export default function AdminEmployees() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') ?? '';
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [offices, setOffices] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [filters, setFilters] = useState({ search: initialSearch, role: '', officeId: '', status: '' });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState({ open: false, employee: null });
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [mutating, setMutating] = useState(false);

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getUsers({ page, limit: LIMIT, ...appliedFilters });
      setItems(result.items);
      setPagination(result.pagination);
    } catch (requestError) {
      setError(handleApiError(requestError, 'Data employee belum dapat dimuat.'));
    } finally { setLoading(false); }
  }, [appliedFilters, page]);

  useEffect(() => {
    const frame = requestAnimationFrame(loadEmployees);
    return () => cancelAnimationFrame(frame);
  }, [loadEmployees]);
  useEffect(() => {
    getOffices({ page: 1, limit: 100, status: 'true' }).then((result) => setOffices(result.items)).catch(() => setOffices([]));
  }, []);

  function applyFilters(event) { event.preventDefault(); setAppliedFilters(filters); setPage(1); }
  function resetFilters() { const empty = { search: '', role: '', officeId: '', status: '' }; setFilters(empty); setAppliedFilters(empty); setPage(1); }

  async function saveEmployee(payload) {
    setMutating(true);
    try {
      if (formState.employee) {
        await updateUser(formState.employee.id, payload);
        showToast('Employee berhasil diperbarui.');
      } else {
        await createUser(payload);
        showToast('Employee berhasil dibuat.');
      }
      setFormState({ open: false, employee: null });
      loadEmployees();
    } catch (requestError) {
      showToast(handleApiError(requestError, 'Employee belum dapat disimpan.'), 'error');
    } finally { setMutating(false); }
  }

  async function confirmDeactivate() {
    setMutating(true);
    try {
      await deactivateUser(deactivateTarget.id);
      showToast('Employee berhasil dinonaktifkan.');
      setDeactivateTarget(null);
      loadEmployees();
    } catch (requestError) {
      showToast(handleApiError(requestError, 'Employee belum dapat dinonaktifkan.'), 'error');
    } finally { setMutating(false); }
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Master data" title="Employees" description="Kelola akun, role, kantor, dan status employee." action={<Button onClick={() => setFormState({ open: true, employee: null })}><Plus aria-hidden="true" size={18} /> Tambah Employee</Button>} />
      <Card className="p-4 sm:p-5">
        <form onSubmit={applyFilters} className="grid gap-4 lg:grid-cols-[1.5fr_.7fr_1fr_.7fr_auto] lg:items-end">
          <Input id="employee-search" label="Cari employee" placeholder="Nama, email, atau ID" leadingIcon={Search} value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} />
          <Select id="employee-role-filter" label="Role" value={filters.role} onChange={(event) => setFilters((current) => ({ ...current, role: event.target.value }))}><option value="">Semua role</option><option value="EMPLOYEE">Employee</option><option value="ADMIN">Admin</option></Select>
          <Select id="employee-office-filter" label="Kantor" value={filters.officeId} onChange={(event) => setFilters((current) => ({ ...current, officeId: event.target.value }))}><option value="">Semua kantor</option>{offices.map((office) => <option key={office.id} value={office.id}>{office.name}</option>)}</Select>
          <Select id="employee-status-filter" label="Status" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}><option value="">Semua</option><option value="true">Aktif</option><option value="false">Nonaktif</option></Select>
          <div className="flex gap-2"><Button type="submit" className="flex-1">Terapkan</Button><Button type="button" variant="secondary" onClick={resetFilters}>Reset</Button></div>
        </form>
      </Card>

      {loading ? <div className="space-y-3">{Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-20" />)}</div> : error ? <ErrorState message={error} onRetry={loadEmployees} /> : items.length === 0 ? <EmptyState icon={Users} title="Belum ada employee" message="Tambahkan employee pertama untuk mulai menggunakan sistem absensi." /> : (
        <>
          <div className="space-y-3 md:hidden">
            {items.map((employee) => (
              <Card key={employee.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0"><p className="truncate font-bold text-primary-dark">{employee.name}</p><p className="mt-1 text-xs font-semibold text-primary">{employee.employeeId}</p></div>
                  <Badge variant={employee.isActive ? 'success' : 'danger'}>{employee.isActive ? 'Aktif' : 'Nonaktif'}</Badge>
                </div>
                <div className="mt-4 space-y-2 rounded-2xl bg-background p-3 text-xs"><div className="flex justify-between gap-4"><span className="text-ink-muted">Email</span><span className="truncate font-semibold text-primary-dark">{employee.email}</span></div><div className="flex justify-between gap-4"><span className="text-ink-muted">Office</span><span className="truncate font-semibold text-primary-dark">{employee.office?.name ?? '-'}</span></div><div className="flex justify-between gap-4"><span className="text-ink-muted">Role</span><span className="font-semibold text-primary-dark">{employee.role}</span></div></div>
                <div className="mt-4 grid grid-cols-3 gap-2"><Link to={`/admin/employees/${employee.id}`} className="inline-flex min-h-10 items-center justify-center gap-1 rounded-xl bg-primary-light text-xs font-semibold text-primary"><Eye aria-hidden="true" size={15} /> Detail</Link><button type="button" onClick={() => setFormState({ open: true, employee })} className="inline-flex min-h-10 items-center justify-center gap-1 rounded-xl bg-warning-light text-xs font-semibold text-warning"><Pencil aria-hidden="true" size={15} /> Edit</button><button type="button" disabled={!employee.isActive} onClick={() => setDeactivateTarget(employee)} className="inline-flex min-h-10 items-center justify-center gap-1 rounded-xl bg-danger-light text-xs font-semibold text-danger disabled:opacity-40"><UserMinus aria-hidden="true" size={15} /> Nonaktif</button></div>
              </Card>
            ))}
          </div>
          <Card className="hidden overflow-hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm"><caption className="sr-only">Daftar employee dan status akun</caption><thead className="border-b border-border bg-background text-xs uppercase tracking-wide text-ink-muted"><tr><th scope="col" className="px-5 py-4">Employee ID</th><th scope="col" className="px-5 py-4">Nama</th><th scope="col" className="px-5 py-4">Email</th><th scope="col" className="px-5 py-4">Office</th><th scope="col" className="px-5 py-4">Status</th><th scope="col" className="px-5 py-4">Role</th><th scope="col" className="px-5 py-4 text-right">Action</th></tr></thead>
                <tbody className="divide-y divide-border">{items.map((employee) => <tr key={employee.id} className="hover:bg-primary-soft/50"><td className="px-5 py-4 font-semibold text-primary">{employee.employeeId}</td><td className="px-5 py-4 font-semibold text-primary-dark">{employee.name}</td><td className="px-5 py-4 text-ink-muted">{employee.email}</td><td className="px-5 py-4 text-ink-muted">{employee.office?.name ?? '-'}</td><td className="px-5 py-4"><Badge variant={employee.isActive ? 'success' : 'danger'}>{employee.isActive ? 'Aktif' : 'Nonaktif'}</Badge></td><td className="px-5 py-4"><Badge variant="neutral">{employee.role}</Badge></td><td className="px-5 py-4"><div className="flex justify-end gap-1"><Link to={`/admin/employees/${employee.id}`} aria-label={`Detail ${employee.name}`} className="grid size-10 place-items-center rounded-xl text-primary hover:bg-primary-light"><Eye aria-hidden="true" size={17} /></Link><button type="button" aria-label={`Edit ${employee.name}`} onClick={() => setFormState({ open: true, employee })} className="grid size-10 place-items-center rounded-xl text-warning hover:bg-warning-light"><Pencil aria-hidden="true" size={17} /></button>{employee.isActive && <button type="button" aria-label={`Nonaktifkan ${employee.name}`} onClick={() => setDeactivateTarget(employee)} className="grid size-10 place-items-center rounded-xl text-danger hover:bg-danger-light"><UserMinus aria-hidden="true" size={17} /></button>}</div></td></tr>)}</tbody></table>
            </div>
          </Card>
          <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={setPage} />
        </>
      )}

      <Modal open={formState.open} onClose={() => setFormState({ open: false, employee: null })} title={formState.employee ? 'Edit Employee' : 'Tambah Employee'} description="Data ini digunakan untuk authentication dan penempatan kantor."><EmployeeForm key={formState.employee?.id ?? 'new'} employee={formState.employee} offices={offices} onSubmit={saveEmployee} onCancel={() => setFormState({ open: false, employee: null })} loading={mutating} /></Modal>
      <Dialog open={Boolean(deactivateTarget)} onClose={() => setDeactivateTarget(null)} onConfirm={confirmDeactivate} title="Nonaktifkan employee?" message={`Akun ${deactivateTarget?.name ?? ''} tidak akan dapat digunakan untuk login atau absensi.`} confirmLabel="Nonaktifkan" loading={mutating} />
    </div>
  );
}
