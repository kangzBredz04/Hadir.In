import { useState } from 'react';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import Spinner from '../ui/Spinner.jsx';

export default function EmployeeForm({ employee, offices, onSubmit, onCancel, loading }) {
  const editing = Boolean(employee);
  const [form, setForm] = useState({
    employeeId: employee?.employeeId === '-' ? '' : employee?.employeeId ?? '',
    name: employee?.name === '-' ? '' : employee?.name ?? '',
    email: employee?.email === '-' ? '' : employee?.email ?? '',
    password: '',
    role: employee?.role ?? 'EMPLOYEE',
    officeId: employee?.officeId ?? '',
    isActive: String(employee?.isActive ?? true),
  });
  const [errors, setErrors] = useState({});

  function change(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.employeeId.trim()) nextErrors.employeeId = 'Employee ID wajib diisi.';
    if (!form.name.trim()) nextErrors.name = 'Nama wajib diisi.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Masukkan email yang valid.';
    if (!editing && form.password.length < 8) nextErrors.password = 'Password minimal 8 karakter.';
    if (editing && form.password && form.password.length < 8) nextErrors.password = 'Password minimal 8 karakter.';
    if (!form.officeId) nextErrors.officeId = 'Pilih kantor employee.';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const payload = {
      employee_id: form.employeeId.trim(),
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      office_id: form.officeId,
      is_active: form.isActive === 'true',
    };
    if (form.password) payload.password = form.password;
    onSubmit(payload);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input id="employee-id" name="employeeId" label="Employee ID" placeholder="EMP-001" value={form.employeeId} onChange={change} error={errors.employeeId} />
        <Input id="employee-name" name="name" label="Nama lengkap" placeholder="Nama employee" value={form.name} onChange={change} error={errors.name} />
        <Input id="employee-email" name="email" type="email" label="Email" placeholder="employee@company.com" value={form.email} onChange={change} error={errors.email} />
        <Input id="employee-password" name="password" type="password" label={editing ? 'Password baru (opsional)' : 'Password'} placeholder="Minimal 8 karakter" value={form.password} onChange={change} error={errors.password} />
        <Select id="employee-role" name="role" label="Role" value={form.role} onChange={change}><option value="EMPLOYEE">Employee</option><option value="ADMIN">Admin</option></Select>
        <Select id="employee-office" name="officeId" label="Kantor" value={form.officeId} onChange={change} error={errors.officeId}><option value="">Pilih kantor</option>{offices.map((office) => <option key={office.id} value={office.id}>{office.name}</option>)}</Select>
        <Select id="employee-status" name="isActive" label="Status akun" value={form.isActive} onChange={change} className="sm:col-span-2"><option value="true">Aktif</option><option value="false">Nonaktif</option></Select>
      </div>
      <div className="flex justify-end gap-2 border-t border-border pt-5"><Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>Batal</Button><Button type="submit" disabled={loading}>{loading && <Spinner size="sm" />}{loading ? 'Menyimpan...' : editing ? 'Simpan perubahan' : 'Buat employee'}</Button></div>
    </form>
  );
}
