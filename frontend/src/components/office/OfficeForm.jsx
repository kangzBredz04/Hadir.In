import {
    useState
} from 'react';

import {
    Crosshair,
    MapPin
} from 'lucide-react';

import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

import OfficeMapPicker from './OfficeMapPicker';

import {
    handleApiError
} from '../../utils/errorHandler';

export default function OfficeForm({
    office,
    onSubmit,
    onCancel
}) {
    const isEdit =
        Boolean(office);

    const [
        values,
        setValues
    ] =
        useState({
            name:
                office?.name ??
                '',

            address:
                office?.address ??
                '',

            latitude:
                office?.latitude ??
                '',

            longitude:
                office?.longitude ??
                '',

            radiusMeter:
                office?.radiusMeter ??
                100,

            isActive:
                office?.isActive ??
                true
        });

    const [
        error,
        setError
    ] =
        useState('');

    const [
        loading,
        setLoading
    ] =
        useState(false);

    const [
        locating,
        setLocating
    ] =
        useState(false);

    const setField =
        (
            field,
            value
        ) => {
            setValues(
                previous => ({
                    ...previous,

                    [field]:
                        value
                })
            );
        };

    const handleMapChange =
        ({
            latitude,
            longitude
        }) => {
            setValues(
                previous => ({
                    ...previous,

                    latitude:
                        Number(
                            latitude
                        ).toFixed(7),

                    longitude:
                        Number(
                            longitude
                        ).toFixed(7)
                })
            );
        };

    const handleCurrentLocation =
        () => {
            setError('');

            if (
                !navigator
                    .geolocation
            ) {
                setError(
                    'Browser tidak mendukung fitur lokasi.'
                );

                return;
            }

            setLocating(true);

            navigator
                .geolocation
                .getCurrentPosition(
                    position => {
                        handleMapChange({
                            latitude:
                                position
                                    .coords
                                    .latitude,

                            longitude:
                                position
                                    .coords
                                    .longitude
                        });

                        setLocating(
                            false
                        );
                    },

                    locationError => {
                        let message =
                            'Lokasi tidak dapat diperoleh.';

                        if (
                            locationError.code ===
                            1
                        ) {
                            message =
                                'Akses lokasi ditolak. Izinkan lokasi pada browser.';
                        } else if (
                            locationError.code ===
                            2
                        ) {
                            message =
                                'Lokasi perangkat tidak tersedia.';
                        } else if (
                            locationError.code ===
                            3
                        ) {
                            message =
                                'Pengambilan lokasi terlalu lama. Silakan coba kembali.';
                        }

                        setError(
                            message
                        );

                        setLocating(
                            false
                        );
                    },

                    {
                        enableHighAccuracy:
                            true,

                        timeout:
                            15000,

                        maximumAge:
                            0
                    }
                );
        };

    const handleSubmit =
        async event => {
            event.preventDefault();

            setError('');

            const latitude =
                Number(
                    values.latitude
                );

            const longitude =
                Number(
                    values.longitude
                );

            const radiusMeter =
                Number(
                    values.radiusMeter
                );

            if (
                !values.name.trim() ||
                !values.address.trim()
            ) {
                setError(
                    'Nama dan alamat kantor wajib diisi.'
                );

                return;
            }

            if (
                !Number.isFinite(
                    latitude
                ) ||
                latitude < -90 ||
                latitude > 90
            ) {
                setError(
                    'Latitude tidak valid. Pilih lokasi kantor melalui peta.'
                );

                return;
            }

            if (
                !Number.isFinite(
                    longitude
                ) ||
                longitude < -180 ||
                longitude > 180
            ) {
                setError(
                    'Longitude tidak valid. Pilih lokasi kantor melalui peta.'
                );

                return;
            }

            if (
                !Number.isInteger(
                    radiusMeter
                ) ||
                radiusMeter < 1
            ) {
                setError(
                    'Radius absensi harus lebih dari 0 meter.'
                );

                return;
            }

            setLoading(true);

            try {
                await onSubmit({
                    name:
                        values.name
                            .trim(),

                    address:
                        values.address
                            .trim(),

                    latitude,

                    longitude,

                    radius_meter:
                        radiusMeter,

                    is_active:
                        values.isActive
                });
            } catch (
            requestError
            ) {
                setError(
                    handleApiError(
                        requestError,

                        isEdit
                            ? 'Kantor gagal diperbarui.'
                            : 'Kantor gagal dibuat.'
                    )
                );
            } finally {
                setLoading(
                    false
                );
            }
        };

    return (
        <form
            className="
        space-y-5
      "
            onSubmit={
                handleSubmit
            }
        >
            {error && (
                <div
                    className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-3
            text-sm
            leading-6
            text-danger
          "
                    role="alert"
                >
                    {error}
                </div>
            )}

            <Input
                id="office-name"
                label="Nama Kantor"
                value={
                    values.name
                }
                onChange={
                    event =>
                        setField(
                            'name',
                            event.target.value
                        )
                }
                placeholder="Contoh: Kantor Pusat Jakarta"
                required
            />

            <div>
                <label
                    htmlFor="office-address"
                    className="
            mb-2
            block
            text-sm
            font-medium
            text-text
          "
                >
                    Alamat
                </label>

                <textarea
                    id="office-address"
                    rows="3"
                    value={
                        values.address
                    }
                    onChange={
                        event =>
                            setField(
                                'address',
                                event.target.value
                            )
                    }
                    placeholder="Masukkan alamat lengkap kantor"
                    className="
            w-full
            rounded-xl
            border
            border-border
            bg-surface
            px-3.5
            py-3
            text-sm
            text-text
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-primary
            focus:ring-4
            focus:ring-primary/10
          "
                    required
                />
            </div>

            <section>
                <div
                    className="
            mb-3
            flex
            flex-col
            gap-3
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
                text-text
              "
                        >
                            Lokasi Kantor
                        </p>

                        <p
                            className="
                mt-1
                text-xs
                leading-5
                text-muted
              "
                        >
                            Klik peta atau geser marker
                            untuk menentukan koordinat.
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        loading={
                            locating
                        }
                        disabled={
                            loading
                        }
                        onClick={
                            handleCurrentLocation
                        }
                    >
                        <Crosshair
                            size={17}
                        />

                        {locating
                            ? 'Mencari...'
                            : 'Gunakan Lokasi Saya'}
                    </Button>
                </div>

                <OfficeMapPicker
                    latitude={
                        values.latitude
                    }

                    longitude={
                        values.longitude
                    }

                    radiusMeter={
                        values.radiusMeter
                    }

                    onLocationChange={
                        handleMapChange
                    }
                />
            </section>

            <div
                className="
          grid
          gap-4
          sm:grid-cols-2
        "
            >
                <Input
                    id="office-latitude"
                    label="Latitude"
                    type="number"
                    step="any"
                    value={
                        values.latitude
                    }
                    onChange={
                        event =>
                            setField(
                                'latitude',
                                event.target.value
                            )
                    }
                    placeholder="-6.2000000"
                    required
                />

                <Input
                    id="office-longitude"
                    label="Longitude"
                    type="number"
                    step="any"
                    value={
                        values.longitude
                    }
                    onChange={
                        event =>
                            setField(
                                'longitude',
                                event.target.value
                            )
                    }
                    placeholder="106.8166667"
                    required
                />
            </div>

            <div>
                <Input
                    id="office-radius"
                    label="Radius Absensi (meter)"
                    type="number"
                    min="1"
                    step="1"
                    value={
                        values.radiusMeter
                    }
                    onChange={
                        event =>
                            setField(
                                'radiusMeter',
                                event.target.value
                            )
                    }
                    required
                />

                <div
                    className="
            mt-2
            flex
            items-start
            gap-2
            text-xs
            leading-5
            text-muted
          "
                >
                    <MapPin
                        size={14}
                        className="
              mt-0.5
              shrink-0
              text-primary
            "
                    />

                    <p>
                        Lingkaran biru pada peta
                        menunjukkan area absensi
                        berdasarkan radius ini.
                    </p>
                </div>
            </div>

            <Select
                id="office-status"
                label="Status"
                value={
                    values.isActive
                        ? 'true'
                        : 'false'
                }
                onChange={
                    event =>
                        setField(
                            'isActive',
                            event.target.value ===
                            'true'
                        )
                }
            >
                <option value="true">
                    Aktif
                </option>

                <option value="false">
                    Tidak Aktif
                </option>
            </Select>

            <div
                className="
          flex
          flex-col-reverse
          gap-2
          pt-3
          sm:flex-row
          sm:justify-end
        "
            >
                <Button
                    type="button"
                    variant="outline"
                    disabled={
                        loading
                    }
                    onClick={
                        onCancel
                    }
                >
                    Batal
                </Button>

                <Button
                    type="submit"
                    loading={
                        loading
                    }
                >
                    {isEdit
                        ? 'Simpan Perubahan'
                        : 'Tambah Kantor'}
                </Button>
            </div>
        </form>
    );
}