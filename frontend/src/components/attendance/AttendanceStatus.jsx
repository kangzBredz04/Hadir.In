import Badge from '../ui/Badge';

const statusConfig = {
    PRESENT: {
        label:
            'Hadir',

        variant:
            'success'
    },

    LATE: {
        label:
            'Terlambat',

        variant:
            'warning'
    },

    ABSENT: {
        label:
            'Tidak Hadir',

        variant:
            'danger'
    }
};

export default function AttendanceStatus({
    status
}) {
    if (!status) {
        return (
            <Badge>
                Belum Absensi
            </Badge>
        );
    }

    const config =
        statusConfig[
        status
        ];

    if (!config) {
        return (
            <Badge>
                {status}
            </Badge>
        );
    }

    return (
        <Badge
            variant={
                config.variant
            }
        >
            {config.label}
        </Badge>
    );
}