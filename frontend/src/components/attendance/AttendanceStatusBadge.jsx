import Badge from '../ui/Badge.jsx';

const statusConfig = {
  PRESENT: { label: 'Hadir', variant: 'success' },
  HADIR: { label: 'Hadir', variant: 'success' },
  LATE: { label: 'Terlambat', variant: 'warning' },
  TERLAMBAT: { label: 'Terlambat', variant: 'warning' },
  ABSENT: { label: 'Tidak Hadir', variant: 'danger' },
  TIDAK_HADIR: { label: 'Tidak Hadir', variant: 'danger' },
  NOT_CHECKED_IN: { label: 'Belum Absen', variant: 'neutral' },
  BELUM_ABSEN: { label: 'Belum Absen', variant: 'neutral' },
};

export default function AttendanceStatusBadge({ status }) {
  const key = String(status || 'BELUM_ABSEN').toUpperCase();
  const config = statusConfig[key] || { label: status || 'Belum Absen', variant: 'neutral' };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
