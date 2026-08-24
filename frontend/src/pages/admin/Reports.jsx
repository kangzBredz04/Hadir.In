import { FileBarChart } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

export default function AdminReports() {
  return <div className="space-y-6"><PageHeader eyebrow="Pelaporan" title="Reports" description="Pusat laporan kehadiran dan rekap operasional." /><EmptyState icon={FileBarChart} title="Modul reports belum diaktifkan" message="Export dan rekap laporan belum termasuk ruang lingkup frontend saat ini. Modul monitoring tetap dapat digunakan melalui menu Attendance." /></div>;
}
