import {
    useEffect,
    useState
} from 'react';

import {
    CheckCircle2,
    Clock3,
    MapPin,
    ShieldCheck
} from 'lucide-react';

import CameraCapture from '../../components/attendance/CameraCapture';
import LocationStatus from '../../components/attendance/LocationStatus';
import AttendanceStatus from '../../components/attendance/AttendanceStatus';
import AttendanceSummary from '../../components/attendance/AttendanceSummary';

import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';

import useAttendance from '../../hooks/useAttendance';
import useAuth from '../../hooks/useAuth';
import useCamera from '../../hooks/useCamera';
import useGeolocation from '../../hooks/useGeolocation';

import {
    checkInAttendance,
    checkOutAttendance
} from '../../services/attendance.service';

import {
    getLocationApiError,
    handleApiError
} from '../../utils/errorHandler';

import {
    formatTime
} from '../../utils/formatTime';

export default function EmployeeAttendance() {
    const {
        user
    } =
        useAuth();

    const {
        attendance,
        loading:
        attendanceLoading,
        error:
        attendanceError,
        refresh
    } =
        useAttendance();

    const camera =
        useCamera();

    const location =
        useGeolocation();

    const [
        submitting,
        setSubmitting
    ] =
        useState(false);

    const [
        actionError,
        setActionError
    ] =
        useState('');

    const [
        backendLocationError,
        setBackendLocationError
    ] =
        useState(null);

    const [
        actionSuccess,
        setActionSuccess
    ] =
        useState(null);

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

    /*
     * Ketika halaman absensi
     * dibuka, langsung minta GPS.
     */
    useEffect(() => {
        if (
            attendanceMode !==
            'COMPLETED'
        ) {
            location.getLocation();
        }
    }, [
        attendanceMode,
        location.getLocation
    ]);

    const canSubmit =
        attendanceMode !==
        'COMPLETED' &&
        Boolean(
            camera.photoFile
        ) &&
        location.latitude !==
        null &&
        location.longitude !==
        null &&
        !submitting;

    const submitLabel =
        attendanceMode ===
            'CHECK_IN'
            ? 'Check In Sekarang'
            : attendanceMode ===
                'CHECK_OUT'
                ? 'Check Out Sekarang'
                : 'Absensi Selesai';

    const handleAttendance =
        async () => {
            if (
                attendanceMode ===
                'COMPLETED'
            ) {
                return;
            }

            setActionError('');
            setBackendLocationError(
                null
            );
            setActionSuccess(
                null
            );

            if (
                !camera.photoFile
            ) {
                setActionError(
                    'Ambil foto terlebih dahulu sebelum melakukan absensi.'
                );

                return;
            }

            if (
                location.latitude ===
                null ||
                location.longitude ===
                null
            ) {
                setActionError(
                    'Lokasi belum tersedia. Aktifkan GPS dan coba kembali.'
                );

                return;
            }

            setSubmitting(
                true
            );

            try {
                const service =
                    attendanceMode ===
                        'CHECK_IN'
                        ? checkInAttendance
                        : checkOutAttendance;

                const result =
                    await service({
                        photo:
                            camera.photoFile,

                        latitude:
                            location.latitude,

                        longitude:
                            location.longitude
                    });

                setActionSuccess({
                    type:
                        attendanceMode,

                    data:
                        result
                });

                camera.clearCapture();

                /*
                 * Attendance-nya sudah berhasil.
                 * Kalau refresh UI gagal,
                 * jangan mengubahnya menjadi
                 * "absensi gagal".
                 */
                try {
                    await refresh();
                } catch {
                    // useAttendance sudah
                    // menyimpan error refresh.
                }
            } catch (requestError) {
                setActionError(
                    handleApiError(
                        requestError,
                        attendanceMode ===
                            'CHECK_IN'
                            ? 'Check-in gagal.'
                            : 'Check-out gagal.'
                    )
                );

                setBackendLocationError(
                    getLocationApiError(
                        requestError
                    )
                );
            } finally {
                setSubmitting(
                    false
                );
            }
        };

    if (
        attendanceLoading &&
        !attendance
    ) {
        return (
            <Card>
                <div
                    className="
            flex
            min-h-60
            items-center
            justify-center
          "
                >
                    <Spinner
                        label="Memeriksa status absensi..."
                    />
                </div>
            </Card>
        );
    }

    return (
        <div
            className="
        mx-auto
        max-w-6xl
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
                                    : 'Absensi Hari Ini Selesai'}
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
                                ? 'Ambil selfie dan pastikan lokasi Anda berhasil ditemukan sebelum melakukan check-in.'
                                : attendanceMode ===
                                    'CHECK_OUT'
                                    ? 'Ambil selfie terbaru dan pastikan Anda masih berada di area kantor sebelum melakukan check-out.'
                                    : 'Check-in dan check-out Anda telah tercatat.'}
                        </p>
                    </div>

                    <AttendanceStatus
                        status={
                            attendance?.status
                        }
                    />
                </div>
            </Card>

            {attendanceError && (
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
                        {attendanceError}
                    </p>
                </Card>
            )}

            {attendance && (
                <AttendanceSummary
                    attendance={
                        attendance
                    }
                />
            )}

            {actionSuccess && (
                <Card
                    className="
            border-green-200
            bg-green-50
          "
                >
                    <div
                        className="
              flex
              items-start
              gap-3
            "
                    >
                        <CheckCircle2
                            size={24}
                            className="
                mt-0.5
                shrink-0
                text-success
              "
                        />

                        <div>
                            <h3
                                className="
                  font-bold
                  text-success
                "
                            >
                                {actionSuccess
                                    .type ===
                                    'CHECK_IN'
                                    ? 'Check-in berhasil'
                                    : 'Check-out berhasil'}
                            </h3>

                            <div
                                className="
                  mt-3
                  grid
                  gap-3
                  text-sm
                  sm:grid-cols-2
                "
                            >
                                <div>
                                    <p
                                        className="
                      text-xs
                      text-muted
                    "
                                    >
                                        Waktu
                                    </p>

                                    <p
                                        className="
                      mt-1
                      font-semibold
                      text-text
                    "
                                    >
                                        {formatTime(
                                            actionSuccess
                                                .type ===
                                                'CHECK_IN'
                                                ? actionSuccess
                                                    .data
                                                    ?.checkInTime
                                                : actionSuccess
                                                    .data
                                                    ?.checkOutTime
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p
                                        className="
                      text-xs
                      text-muted
                    "
                                    >
                                        Jarak
                                    </p>

                                    <p
                                        className="
                      mt-1
                      font-semibold
                      text-text
                    "
                                    >
                                        {actionSuccess
                                            .data
                                            ?.distance ??
                                            '-'}
                                        {' '}
                                        meter
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {actionError && (
                <Card
                    className="
            border-red-200
            bg-red-50
          "
                >
                    <div
                        className="
              flex
              items-start
              gap-3
            "
                    >
                        <ShieldCheck
                            size={22}
                            className="
                mt-0.5
                shrink-0
                text-danger
              "
                        />

                        <div>
                            <h3
                                className="
                  font-semibold
                  text-danger
                "
                            >
                                Absensi tidak dapat diproses
                            </h3>

                            <p
                                className="
                  mt-1
                  text-sm
                  leading-6
                  text-danger
                "
                            >
                                {actionError}
                            </p>

                            {backendLocationError && (
                                <div
                                    className="
                    mt-3
                    grid
                    gap-2
                    text-xs
                    sm:grid-cols-2
                  "
                                >
                                    {backendLocationError
                                        .distance !==
                                        null && (
                                            <div
                                                className="
                        rounded-lg
                        bg-white/70
                        p-3
                      "
                                            >
                                                Jarak Anda
                                                <strong
                                                    className="
                          mt-1
                          block
                        "
                                                >
                                                    {Math.round(
                                                        backendLocationError
                                                            .distance
                                                    )}
                                                    {' '}
                                                    meter
                                                </strong>
                                            </div>
                                        )}

                                    {backendLocationError
                                        .allowedRadius !==
                                        null && (
                                            <div
                                                className="
                        rounded-lg
                        bg-white/70
                        p-3
                      "
                                            >
                                                Radius maksimal
                                                <strong
                                                    className="
                          mt-1
                          block
                        "
                                                >
                                                    {backendLocationError
                                                        .allowedRadius}
                                                    {' '}
                                                    meter
                                                </strong>
                                            </div>
                                        )}
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            )}

            {attendanceMode !==
                'COMPLETED' ? (
                <section
                    className="
            grid
            gap-5
            lg:grid-cols-2
          "
                >
                    <CameraCapture
                        preview={
                            camera.preview
                        }

                        cameraReady={
                            camera.cameraReady
                        }

                        capturing={
                            camera.capturing
                        }

                        error={
                            camera.error
                        }

                        disabled={
                            submitting
                        }

                        onCapture={
                            camera.capture
                        }

                        onRetake={
                            camera.retake
                        }

                        onUserMedia={
                            camera.handleUserMedia
                        }

                        onUserMediaError={
                            camera.handleUserMediaError
                        }
                    />

                    <LocationStatus
                        latitude={
                            location.latitude
                        }

                        longitude={
                            location.longitude
                        }

                        accuracy={
                            location.accuracy
                        }

                        loading={
                            location.loading
                        }

                        error={
                            location.error
                        }

                        office={
                            user?.office
                        }

                        onRetry={
                            location.getLocation
                        }
                    />
                </section>
            ) : (
                <Card>
                    <div
                        className="
              py-8
              text-center
            "
                    >
                        <div
                            className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-green-50
                text-success
              "
                        >
                            <CheckCircle2
                                size={28}
                            />
                        </div>

                        <h3
                            className="
                mt-4
                text-lg
                font-bold
                text-text
              "
                        >
                            Absensi sudah lengkap
                        </h3>

                        <p
                            className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-6
                text-muted
              "
                        >
                            Anda telah menyelesaikan
                            check-in dan check-out
                            hari ini.
                        </p>
                    </div>
                </Card>
            )}

            {attendanceMode !==
                'COMPLETED' && (
                    <Card>
                        <div
                            className="
              flex
              flex-col
              gap-5
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
                                <div
                                    className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-primary-light
                  text-primary
                "
                                >
                                    {attendanceMode ===
                                        'CHECK_IN'
                                        ? (
                                            <Clock3
                                                size={20}
                                            />
                                        )
                                        : (
                                            <MapPin
                                                size={20}
                                            />
                                        )}
                                </div>

                                <div>
                                    <h3
                                        className="
                    font-semibold
                    text-text
                  "
                                    >
                                        {attendanceMode ===
                                            'CHECK_IN'
                                            ? 'Konfirmasi Check In'
                                            : 'Konfirmasi Check Out'}
                                    </h3>

                                    <p
                                        className="
                    mt-1
                    max-w-lg
                    text-xs
                    leading-5
                    text-muted
                  "
                                    >
                                        Pastikan foto dan lokasi
                                        sudah benar. Data akan
                                        diverifikasi kembali oleh
                                        backend.
                                    </p>
                                </div>
                            </div>

                            <Button
                                size="lg"

                                loading={
                                    submitting
                                }

                                disabled={
                                    !canSubmit
                                }

                                className="
                w-full
                sm:w-auto
              "

                                onClick={
                                    handleAttendance
                                }
                            >
                                {submitting
                                    ? 'Mengirim absensi...'
                                    : submitLabel}
                            </Button>
                        </div>

                        {!camera.photoFile && (
                            <p
                                className="
                mt-4
                text-xs
                text-warning
              "
                            >
                                Ambil foto terlebih dahulu.
                            </p>
                        )}

                        {(
                            location.latitude ===
                            null ||
                            location.longitude ===
                            null
                        ) && (
                                <p
                                    className="
                mt-2
                text-xs
                text-warning
              "
                                >
                                    Lokasi GPS harus tersedia.
                                </p>
                            )}
                    </Card>
                )}
        </div>
    );
}