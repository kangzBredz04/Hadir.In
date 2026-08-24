import { useState } from 'react';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import Spinner from '../ui/Spinner.jsx';
import OfficeMapPicker from './OfficeMapPicker.jsx';

export default function OfficeForm({ office, onSubmit, onCancel, loading }) {
  const editing = Boolean(office);
  const [form, setForm] = useState({
    name: office?.name === '-' ? '' : office?.name ?? '',
    address: office?.address === '-' ? '' : office?.address ?? '',
    latitude: office?.latitude ?? '',
    longitude: office?.longitude ?? '',
    radiusMeter: office?.radiusMeter ?? 100,
    isActive: String(office?.isActive ?? true),
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
    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);
    const radius = Number(form.radiusMeter);
    if (!form.name.trim()) nextErrors.name = 'Nama kantor wajib diisi.';
    if (!form.address.trim()) nextErrors.address = 'Alamat kantor wajib diisi.';
    if (form.latitude === '' || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) nextErrors.latitude = 'Latitude harus berada antara -90 dan 90.';
    if (form.longitude === '' || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) nextErrors.longitude = 'Longitude harus berada antara -180 dan 180.';
    if (!Number.isFinite(radius) || radius <= 0) nextErrors.radiusMeter = 'Radius harus lebih dari 0 meter.';
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return; }
    onSubmit({ name: form.name.trim(), address: form.address.trim(), latitude, longitude, radius_meter: radius, is_active: form.isActive === 'true' });
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input id="office-name" name="name" label="Nama Kantor" placeholder="Kantor Pusat Bandung" value={form.name} onChange={change} error={errors.name} className="sm:col-span-2" />
        <div className="sm:col-span-2"><label htmlFor="office-address" className="mb-2 block text-sm font-semibold text-primary-dark">Alamat</label><textarea id="office-address" name="address" rows="3" value={form.address} onChange={change} className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-4 ${errors.address ? 'border-danger focus:ring-danger/10' : 'border-border focus:border-primary focus:ring-primary/10'}`} />{errors.address && <p className="mt-2 text-xs font-medium text-danger">{errors.address}</p>}</div>
        <Input id="office-latitude" name="latitude" type="number" step="any" label="Latitude" placeholder="-6.917464" value={form.latitude} onChange={change} error={errors.latitude} />
        <Input id="office-longitude" name="longitude" type="number" step="any" label="Longitude" placeholder="107.619123" value={form.longitude} onChange={change} error={errors.longitude} />
        <Input id="office-radius" name="radiusMeter" type="number" min="1" label="Radius Absensi (meter)" value={form.radiusMeter} onChange={change} error={errors.radiusMeter} />
        <Select id="office-status" name="isActive" label="Status" value={form.isActive} onChange={change}><option value="true">Aktif</option><option value="false">Nonaktif</option></Select>
        <div className="sm:col-span-2">
          <OfficeMapPicker
            latitude={form.latitude}
            longitude={form.longitude}
            radius={form.radiusMeter}
            onLocationChange={({ latitude, longitude }) => {
              setForm((current) => ({ ...current, latitude: latitude.toFixed(7), longitude: longitude.toFixed(7) }));
              setErrors((current) => ({ ...current, latitude: '', longitude: '' }));
            }}
          />
        </div>
      </div>
      <div className="rounded-2xl border border-primary/10 bg-primary-soft p-4 text-xs leading-5 text-ink-muted">Koordinat dan radius digunakan untuk informasi lokasi. Validasi jarak final tetap dilakukan oleh backend.</div>
      <div className="flex justify-end gap-2 border-t border-border pt-5"><Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>Batal</Button><Button type="submit" disabled={loading}>{loading && <Spinner size="sm" />}{loading ? 'Menyimpan...' : editing ? 'Simpan perubahan' : 'Tambah kantor'}</Button></div>
    </form>
  );
}
