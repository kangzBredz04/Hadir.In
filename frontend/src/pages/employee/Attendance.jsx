import {
    Camera,
    CheckCircle2,
    Clock3,
    MapPin,
    RefreshCw
} from 'lucide-react';

import AttendanceStatus from '../../components/attendance/AttendanceStatus';
import AttendanceSummary from '../../components/attendance/AttendanceSummary';

import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';

import useAttendance from '../../hooks/useAttendance';

export default function EmployeeAttendance() {
    const {
        attendance,
        loading,
        error,
        refresh
    } =
        useAttendance();

    const hasCheckedIn =
        Boolean(
            attendance?.checkInTime
        );

    const hasCheckedOut =
        Boolean(
            attendance?.checkOutTime
        );

    const attendanceMode =
        !hasCheckedIn
            ? 'CHECK_IN'
            : !hasCheckedOut
                ? 'CHECK_OUT'
                : 'COMPLETED';

    return (
        <div
            className="
        mx-auto
        max-w-5xl
        space-y-5
      "
        >
            <Card>
                <div
                    className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
                >
                    <div>
                        <p
                            className="
                text-sm
                font-semibold
                text-primary
              "
                        >
                            Absensi Hari Ini
                        </p>

                        <h2
                            className="
                mt-1
                text-xl
                font-bold
                text-text
              "
                        >
                            {attendanceMode ===
                                'CHECK_IN'
                                ? 'Siap untuk Check In'
                                : attendanceMode ===
                                    'CHECK_OUT'
                                    ? 'Siap untuk Check Out'
                                    : 'Absensi Selesai'}
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
                            {attendanceMode ===
                                'CHECK_IN'
                                ? 'Anda belum melakukan check-in hari ini.'
                                : attendanceMode ===
                                    'CHECK_OUT'
                                    ? 'Check-in sudah tercatat. Anda dapat melakukan check-out setelah selesai bekerja.'
                                    : 'Check-in dan check-out hari ini sudah tercatat.'}
                        </p>
                    </div>

                    <AttendanceStatus
                        status={
                            attendance?.status
                        }
                    />
                </div>
            </Card>

            {loading ? (
                <Card>
                    <div
                        className="
              flex
              min-h-40
              items-center
              justify-center
            "
                    >
                        <Spinner
                            label="Memeriksa absensi..."
                        />
                    </div>
                </Card>
            ) : error ? (
                <Card
                    className="
            border-red-200
            bg-red-50
          "
                >
                    <p
                        className="
              text-sm
              text-danger
            "
                    >
                        {error}
                    </p>

                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={refresh}
                    >
                        <RefreshCw
                            size={17}
                        />

                        Coba Lagi
                    </Button>
                </Card>
            ) : (
                <AttendanceSummary
                    attendance={
                        attendance
                    }
                />
            )}

            <section
                className="
          grid
          gap-4
          lg:grid-cols-2
        "
            >
                <Card>
                    <div
                        className="
              flex
              items-center
              gap-3
            "
                    >
                        <div
                            className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-primary-light
                text-primary
              "
                        >
                            <Camera
                                size={21}
                            />
                        </div>

                        <div>
                            <h3
                                className="
                  font-semibold
                  text-text
                "
                            >
                                Kamera
                            </h3>

                            <p
                                className="
                  text-xs
                  text-muted
                "
                            >
                                Selfie absensi
                            </p>
                        </div>
                    </div>

                    <div
                        className="
              mt-5
              flex
              aspect-[4/3]
              items-center
              justify-center
              rounded-2xl
              border
              border-dashed
              border-border
              bg-background
            "
                    >
                        <div
                            className="
                px-6
                text-center
              "
                        >
                            <Camera
                                size={36}
                                className="
                  mx-auto
                  text-muted
                "
                            />

                            <p
                                className="
                  mt-3
                  text-sm
                  font-semibold
                  text-text
                "
                            >
                                Kamera belum diaktifkan
                            </p>

                            <p
                                className="
                  mt-1
                  text-xs
                  leading-5
                  text-muted
                "
                            >
                                Integrasi React Webcam
                                akan dilakukan pada
                                Tahap 4.
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div
                        className="
              flex
              items-center
              gap-3
            "
                    >
                        <div
                            className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-primary-light
                text-primary
              "
                        >
                            <MapPin
                                size={21}
                            />
                        </div>

                        <div>
                            <h3
                                className="
                  font-semibold
                  text-text
                "
                            >
                                Lokasi
                            </h3>

                            <p
                                className="
                  text-xs
                  text-muted
                "
                            >
                                Verifikasi GPS
                            </p>
                        </div>
                    </div>

                    <div
                        className="
              mt-5
              rounded-2xl
              bg-background
              p-5
            "
                    >
                        <MapPin
                            size={30}
                            className="
                text-primary
              "
                        />

                        <h4
                            className="
                mt-4
                font-semibold
                text-text
              "
                        >
                            Lokasi belum diperiksa
                        </h4>

                        <p
                            className="
                mt-2
                text-sm
                leading-6
                text-muted
              "
                        >
                            GPS dan pengecekan lokasi
                            real-time akan diaktifkan
                            pada Tahap 4.
                        </p>
                    </div>

                    <div
                        className="
              mt-4
              rounded-xl
              border
              border-blue-100
              bg-primary-light
              p-4
            "
                    >
                        <div
                            className="
                flex
                gap-3
              "
                        >
                            <CheckCircle2
                                size={19}
                                className="
                  mt-0.5
                  shrink-0
                  text-primary
                "
                            />

                            <p
                                className="
                  text-xs
                  leading-5
                  text-primary-dark
                "
                            >
                                Validasi jarak final
                                tetap dilakukan oleh
                                backend menggunakan
                                Haversine dan radius
                                kantor.
                            </p>
                        </div>
                    </div>
                </Card>
            </section>

            <Card>
                <div
                    className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
                >
                    <div
                        className="
              flex
              items-start
              gap-3
            "
                    >
                        <Clock3
                            size={21}
                            className="
                mt-0.5
                text-primary
              "
                        />

                        <div>
                            <h3
                                className="
                  font-semibold
                  text-text
                "
                            >
                                {attendanceMode ===
                                    'CHECK_IN'
                                    ? 'Check In'
                                    : attendanceMode ===
                                        'CHECK_OUT'
                                        ? 'Check Out'
                                        : 'Absensi Selesai'}
                            </h3>

                            <p
                                className="
                  mt-1
                  text-xs
                  leading-5
                  text-muted
                "
                            >
                                {attendanceMode ===
                                    'COMPLETED'
                                    ? 'Anda sudah menyelesaikan absensi hari ini.'
                                    : 'Kamera dan lokasi wajib tersedia sebelum absensi dikirim.'}
                            </p>
                        </div>
                    </div>

                    <Button
                        size="lg"
                        disabled
                        className="
              w-full
              sm:w-auto
            "
                    >
                        {attendanceMode ===
                            'CHECK_IN'
                            ? 'Check In'
                            : attendanceMode ===
                                'CHECK_OUT'
                                ? 'Check Out'
                                : 'Selesai'}
                    </Button>
                </div>
            </Card>
        </div>
    );
}