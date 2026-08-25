import {
    FileText
} from 'lucide-react';

import Card from '../../components/ui/Card';

export default function AdminReports() {
    return (
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
                <FileText size={23} />
            </div>

            <h2
                className="
          mt-5
          text-xl
          font-bold
          text-text
        "
            >
                Reports
            </h2>

            <p
                className="
          mt-2
          max-w-2xl
          text-sm
          leading-6
          text-muted
        "
            >
                Halaman laporan dan export
                akan disempurnakan setelah
                seluruh fitur admin selesai.
            </p>
        </Card>
    );
}