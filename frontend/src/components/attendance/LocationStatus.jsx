import {
    CheckCircle2,
    CircleAlert,
    LocateFixed,
    MapPin,
    RefreshCw
} from 'lucide-react';

import Button from '../ui/Button';
import Card from '../ui/Card';

import {
    calculateDistanceMeters
} from '../../utils/distance';

export default function LocationStatus({
    latitude,
    longitude,
    accuracy,
    loading,
    error,

    office,

    onRetry
}) {
    const officeLatitude =
        office?.latitude;

    const officeLongitude =
        office?.longitude;

    const radius =
        Number(
            office?.radiusMeter
        );

    const distance =
        latitude !== null &&
            longitude !== null &&
            officeLatitude !==
            null &&
            officeLatitude !==
            undefined &&
            officeLongitude !==
            null &&
            officeLongitude !==
            undefined
            ? calculateDistanceMeters({
                latitude1:
                    latitude,

                longitude1:
                    longitude,

                latitude2:
                    officeLatitude,

                longitude2:
                    officeLongitude
            })
            : null;

    const hasRadius =
        Number.isFinite(
            radius
        );

    const withinRadius =
        distance !== null &&
            hasRadius
            ? distance <= radius
            : null;

    return (
        <Card>
            <div
                className="
          flex
          items-center
          justify-between
          gap-4
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
                        Lokasi
                    </p>

                    <h3
                        className="
              mt-1
              font-bold
              text-text
            "
                    >
                        Posisi Anda
                    </h3>
                </div>

                <div
                    className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-primary-light
            text-primary
          "
                >
                    <LocateFixed
                        size={20}
                    />
                </div>
            </div>

            {loading ? (
                <div
                    className="
            mt-5
            rounded-xl
            bg-background
            p-5
            text-center
          "
                >
                    <LocateFixed
                        size={28}
                        className="
              mx-auto
              animate-pulse
              text-primary
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
                        Mencari lokasi...
                    </p>

                    <p
                        className="
              mt-1
              text-xs
              text-muted
            "
                    >
                        Pastikan GPS perangkat aktif.
                    </p>
                </div>
            ) : error ? (
                <div
                    className="
            mt-5
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-4
          "
                >
                    <div
                        className="
              flex
              items-start
              gap-3
            "
                    >
                        <CircleAlert
                            size={20}
                            className="
                mt-0.5
                shrink-0
                text-danger
              "
                        />

                        <div>
                            <p
                                className="
                  text-sm
                  font-semibold
                  text-danger
                "
                            >
                                Lokasi tidak tersedia
                            </p>

                            <p
                                className="
                  mt-1
                  text-xs
                  leading-5
                  text-danger
                "
                            >
                                {error}
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={onRetry}
                    >
                        <RefreshCw
                            size={17}
                        />

                        Coba Lagi
                    </Button>
                </div>
            ) : latitude !==
                null &&
                longitude !==
                null ? (
                <>
                    <div
                        className={`
              mt-5
              rounded-xl
              border
              p-4
              ${withinRadius ===
                                true
                                ? `
                    border-green-200
                    bg-green-50
                  `
                                : withinRadius ===
                                    false
                                    ? `
                      border-red-200
                      bg-red-50
                    `
                                    : `
                      border-border
                      bg-background
                    `
                            }
            `}
                    >
                        <div
                            className="
                flex
                items-start
                gap-3
              "
                        >
                            {withinRadius ===
                                true ? (
                                <CheckCircle2
                                    size={21}
                                    className="
                    mt-0.5
                    shrink-0
                    text-success
                  "
                                />
                            ) : (
                                <MapPin
                                    size={21}
                                    className={`
                    mt-0.5
                    shrink-0
                    ${withinRadius ===
                                            false
                                            ? 'text-danger'
                                            : 'text-primary'
                                        }
                  `}
                                />
                            )}

                            <div>
                                <p
                                    className="
                    text-sm
                    font-semibold
                    text-text
                  "
                                >
                                    {withinRadius ===
                                        true
                                        ? 'Dalam jangkauan kantor'
                                        : withinRadius ===
                                            false
                                            ? 'Di luar jangkauan kantor'
                                            : 'Lokasi ditemukan'}
                                </p>

                                {distance !==
                                    null && (
                                        <p
                                            className="
                      mt-1
                      text-sm
                      text-muted
                    "
                                        >
                                            Jarak sekitar
                                            {' '}
                                            <strong>
                                                {Math.round(
                                                    distance
                                                )}
                                                {' '}
                                                meter
                                            </strong>
                                        </p>
                                    )}

                                {hasRadius && (
                                    <p
                                        className="
                      mt-1
                      text-xs
                      text-muted
                    "
                                    >
                                        Radius kantor:
                                        {' '}
                                        {radius}
                                        {' '}
                                        meter
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div
                        className="
              mt-4
              grid
              gap-3
              sm:grid-cols-2
            "
                    >
                        <div
                            className="
                rounded-xl
                bg-background
                p-3
              "
                        >
                            <p
                                className="
                  text-xs
                  text-muted
                "
                            >
                                Latitude
                            </p>

                            <p
                                className="
                  mt-1
                  text-sm
                  font-semibold
                  text-text
                "
                            >
                                {latitude.toFixed(
                                    7
                                )}
                            </p>
                        </div>

                        <div
                            className="
                rounded-xl
                bg-background
                p-3
              "
                        >
                            <p
                                className="
                  text-xs
                  text-muted
                "
                            >
                                Longitude
                            </p>

                            <p
                                className="
                  mt-1
                  text-sm
                  font-semibold
                  text-text
                "
                            >
                                {longitude.toFixed(
                                    7
                                )}
                            </p>
                        </div>
                    </div>

                    {accuracy !== null && (
                        <p
                            className="
                mt-3
                text-xs
                text-muted
              "
                        >
                            Akurasi GPS sekitar
                            {' '}
                            {Math.round(
                                accuracy
                            )}
                            {' '}
                            meter.
                        </p>
                    )}

                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={onRetry}
                    >
                        <RefreshCw
                            size={17}
                        />

                        Perbarui Lokasi
                    </Button>
                </>
            ) : (
                <div
                    className="
            mt-5
            rounded-xl
            bg-background
            p-5
            text-center
          "
                >
                    <MapPin
                        size={28}
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
                        Lokasi belum diperiksa
                    </p>

                    <Button
                        className="mt-4"
                        onClick={onRetry}
                    >
                        Ambil Lokasi
                    </Button>
                </div>
            )}

            <p
                className="
          mt-4
          text-xs
          leading-5
          text-muted
        "
            >
                Jarak di atas hanya estimasi
                frontend. Validasi final tetap
                dilakukan oleh server.
            </p>
        </Card>
    );
}