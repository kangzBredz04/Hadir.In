import {
    History
} from 'lucide-react';

import Card from '../../components/ui/Card';

export default function EmployeeHistory() {
    return (
        <div
            className="
        mx-auto
        max-w-3xl
      "
        >
            <Card>
                <div
                    className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            bg-primary-light
            text-primary
          "
                >
                    <History
                        size={23}
                    />
                </div>

                <h2
                    className="
            mt-5
            text-xl
            font-bold
            text-text
          "
                >
                    Riwayat Absensi
                </h2>

                <p
                    className="
            mt-2
            text-sm
            leading-6
            text-muted
          "
                >
                    Halaman riwayat lengkap,
                    filter tanggal, detail,
                    dan pagination akan dibuat
                    pada Tahap 5.
                </p>
            </Card>
        </div>
    );
}