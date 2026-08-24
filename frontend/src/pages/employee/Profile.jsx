import { BadgeCheck, BriefcaseBusiness, Building2, CalendarDays, IdCard, Mail, ShieldCheck, UserRound } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import useAuth from '../../hooks/useAuth.js';
import { formatDate } from '../../utils/formatDate.js';

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-light text-primary"><Icon aria-hidden="true" size={19} /></span>
      <div className="min-w-0">
        <p className="text-xs text-ink-muted">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-primary-dark">{value || '-'}</p>
      </div>
    </div>
  );
}

export default function EmployeeProfile() {
  const { user } = useAuth();
  const name = user?.name || user?.fullName || 'Employee';
  const office = user?.office ?? user?.officeAssignment?.office ?? user?.office_assignment?.office;
  const isActive = user?.isActive ?? user?.is_active ?? user?.status !== 'INACTIVE';
  const joinedAt = user?.joinedAt ?? user?.joined_at ?? user?.tanggalMasuk ?? user?.tanggal_masuk;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Akun employee" title="Profil Saya" description="Informasi akun yang terhubung dengan sistem kehadiran." />

      <Card className="overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-primary-dark via-primary to-[#1188C7] sm:h-36" />
        <div className="px-5 pb-6 sm:px-7 sm:pb-8">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <Avatar name={name} imageUrl={user?.avatarUrl ?? user?.avatar_url} size="xl" className="border-4 border-white shadow-card" />
              <div className="pb-1">
                <h1 className="text-xl font-bold text-primary-dark sm:text-2xl">{name}</h1>
                <p className="mt-1 text-sm text-ink-muted">{user?.position ?? user?.jabatan ?? 'Employee'}</p>
              </div>
            </div>
            <div className="pb-1"><Badge variant={isActive ? 'success' : 'danger'}>{isActive ? 'Akun Aktif' : 'Akun Nonaktif'}</Badge></div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-primary-light text-primary"><UserRound aria-hidden="true" size={20} /></span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Informasi dasar</p>
              <h2 className="mt-0.5 font-bold text-primary-dark">Detail employee</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <DetailItem icon={IdCard} label="Employee ID" value={user?.employeeId ?? user?.employee_id ?? user?.id} />
            <DetailItem icon={Mail} label="Email" value={user?.email} />
            <DetailItem icon={BriefcaseBusiness} label="Jabatan" value={user?.position ?? user?.jabatan} />
            <DetailItem icon={ShieldCheck} label="Role" value={user?.role} />
            <DetailItem icon={Building2} label="Kantor" value={office?.name ?? user?.officeName ?? user?.office_name} />
            <DetailItem icon={CalendarDays} label="Tanggal masuk" value={joinedAt ? formatDate(joinedAt, { weekday: undefined }) : '-'} />
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <span className="grid size-11 place-items-center rounded-2xl bg-success-light text-success"><BadgeCheck aria-hidden="true" size={22} /></span>
          <h2 className="mt-5 font-bold text-primary-dark">Status akun</h2>
          <p className="mt-2 text-sm leading-6 text-ink-muted">Akun Anda terhubung dengan sistem authentication dan role employee.</p>
          <div className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
            <div className="flex items-center justify-between gap-4"><span className="text-ink-muted">Role</span><span className="font-semibold text-primary-dark">{user?.role}</span></div>
            <div className="flex items-center justify-between gap-4"><span className="text-ink-muted">Status</span><span className={isActive ? 'font-semibold text-success' : 'font-semibold text-danger'}>{isActive ? 'Aktif' : 'Nonaktif'}</span></div>
            <div className="flex items-center justify-between gap-4"><span className="text-ink-muted">Kantor</span><span className="max-w-36 truncate font-semibold text-primary-dark">{office?.name ?? '-'}</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
