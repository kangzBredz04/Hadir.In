import { BadgeCheck, IdCard, Mail, ShieldCheck, UserRound } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import useAuth from '../../hooks/useAuth.js';

function Item({ icon: Icon, label, value }) { return <div className="flex gap-3 rounded-2xl border border-border p-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-light text-primary"><Icon aria-hidden="true" size={18} /></span><div><p className="text-xs text-ink-muted">{label}</p><p className="mt-1 break-all text-sm font-semibold text-primary-dark">{value || '-'}</p></div></div>; }

export default function AdminProfile() {
  const { user } = useAuth(); const name = user?.name || user?.fullName || 'Administrator'; const active = user?.isActive ?? user?.is_active ?? true;
  return <div className="space-y-6"><PageHeader eyebrow="Administrator" title="Profile" description="Informasi akun administrator yang sedang aktif." /><Card className="overflow-hidden"><div className="h-28 bg-gradient-to-r from-primary-dark via-primary to-[#1188C7]" /><div className="px-5 pb-6 sm:px-7"><div className="-mt-11 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div className="flex items-end gap-4"><Avatar name={name} size="xl" className="border-4 border-white shadow-card" /><div className="pb-1"><h2 className="text-xl font-bold text-primary-dark">{name}</h2><p className="mt-1 text-sm text-ink-muted">System Administrator</p></div></div><div className="pb-1"><Badge variant={active ? 'success' : 'danger'}>{active ? 'Akun Aktif' : 'Akun Nonaktif'}</Badge></div></div></div></Card><Card className="p-5 sm:p-6"><div className="grid gap-3 sm:grid-cols-2"><Item icon={IdCard} label="User ID" value={user?.id} /><Item icon={Mail} label="Email" value={user?.email} /><Item icon={ShieldCheck} label="Role" value={user?.role} /><Item icon={UserRound} label="Nama" value={name} /></div><div className="mt-5 flex gap-3 rounded-2xl bg-success-light p-4 text-sm text-success"><BadgeCheck aria-hidden="true" size={21} className="shrink-0" /><p className="leading-6">Role dan status akun selalu diverifikasi melalui backend saat sesi dipulihkan.</p></div></Card></div>;
}
