import {
    Building2,
    MapPin,
    Radar
} from 'lucide-react';

import Badge from '../ui/Badge';

import OfficeMapPicker from './OfficeMapPicker';

function Item({
    icon: Icon,
    label,
    value
}) {
    return (
        <div
            className="
        rounded-xl
        bg-background
        p-4
      "
        >
            <div
                className="
          flex
          items-center
          gap-2
          text-muted
        "
            >
                <Icon
                    size={16}
                />

                <p className="text-xs">
                    {label}
                </p>
            </div>

            <p
                className="
          mt-2
          break-words
          text-sm
          font-semibold
          text-text
        "
            >
                {value ?? '-'}
            </p>
        </div>
    );
}

export default function OfficeDetail({
    office
}) {
    if (!office) {
        return null;
    }

    return (
        <div
            className="
        space-y-5
      "
        >
            <section>
                <div
                    className="
            flex
            items-start
            justify-between
            gap-4
          "
                >
                    <div>
                        <h3
                            className="
                text-lg
                font-bold
                text-text
              "
                        >
                            {office.name}
                        </h3>

                        <p
                            className="
                mt-2
                text-sm
                leading-6
                text-muted
              "
                        >
                            {office.address}
                        </p>
                    </div>

                    <Badge
                        variant={
                            office.isActive
                                ? 'success'
                                : 'danger'
                        }
                    >
                        {office.isActive
                            ? 'Aktif'
                            : 'Tidak Aktif'}
                    </Badge>
                </div>
            </section>

            <OfficeMapPicker
                latitude={
                    office.latitude
                }

                longitude={
                    office.longitude
                }

                radiusMeter={
                    office.radiusMeter
                }

                readOnly

                height="h-[300px]"
            />

            <section
                className="
          grid
          gap-3
          sm:grid-cols-2
        "
            >
                <Item
                    icon={MapPin}
                    label="Latitude"
                    value={
                        office.latitude
                    }
                />

                <Item
                    icon={MapPin}
                    label="Longitude"
                    value={
                        office.longitude
                    }
                />

                <Item
                    icon={Radar}
                    label="Radius Absensi"
                    value={
                        `${office.radiusMeter} meter`
                    }
                />

                <Item
                    icon={Building2}
                    label="Status"
                    value={
                        office.isActive
                            ? 'Aktif'
                            : 'Tidak Aktif'
                    }
                />
            </section>
        </div>
    );
}