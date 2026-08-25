import {
    useEffect,
    useMemo
} from 'react';

import {
    Circle,
    MapContainer,
    Marker,
    TileLayer,
    useMap,
    useMapEvents
} from 'react-leaflet';

import {
    divIcon
} from 'leaflet';

import {
    MapPin,
    MousePointerClick,
    Radar
} from 'lucide-react';

const DEFAULT_CENTER = [
    -6.2,
    106.8166667
];

const DEFAULT_ZOOM = 13;

const SELECTED_ZOOM = 17;

function isValidCoordinate(
    latitude,
    longitude
) {
    const lat =
        Number(latitude);

    const lng =
        Number(longitude);

    return (
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
    );
}

function MapClickHandler({
    disabled,
    onLocationChange
}) {
    useMapEvents({
        click(event) {
            if (disabled) {
                return;
            }

            onLocationChange?.({
                latitude:
                    event.latlng.lat,

                longitude:
                    event.latlng.lng
            });
        }
    });

    return null;
}

function MapViewController({
    latitude,
    longitude
}) {
    const map =
        useMap();

    useEffect(() => {
        if (
            !isValidCoordinate(
                latitude,
                longitude
            )
        ) {
            return;
        }

        const currentZoom =
            map.getZoom();

        map.flyTo(
            [
                Number(latitude),
                Number(longitude)
            ],
            Math.max(
                currentZoom,
                SELECTED_ZOOM
            ),
            {
                duration: 0.4
            }
        );
    }, [
        latitude,
        longitude,
        map
    ]);

    return null;
}

export default function OfficeMapPicker({
    latitude,
    longitude,
    radiusMeter = 100,

    readOnly = false,

    height =
    'h-[360px]',

    onLocationChange
}) {
    const selected =
        isValidCoordinate(
            latitude,
            longitude
        );

    const selectedPosition =
        selected
            ? [
                Number(latitude),
                Number(longitude)
            ]
            : null;

    const radius =
        Number(
            radiusMeter
        );

    const safeRadius =
        Number.isFinite(
            radius
        ) &&
            radius > 0
            ? radius
            : 1;

    /*
     * Kita memakai divIcon agar
     * tidak bergantung pada asset
     * marker PNG bawaan Leaflet.
     *
     * Ini juga menghindari masalah
     * marker icon hilang pada Vite.
     */
    const markerIcon =
        useMemo(
            () =>
                divIcon({
                    className:
                        'hadirin-office-marker',

                    html: `
            <div
              style="
                width: 28px;
                height: 28px;
                border-radius: 9999px;
                background: #0067b1;
                border: 4px solid white;
                box-shadow:
                  0 4px 14px
                  rgba(15, 23, 42, 0.28);
              "
            ></div>
          `,

                    iconSize:
                        [28, 28],

                    iconAnchor:
                        [14, 14]
                }),
            []
        );

    return (
        <div
            className="
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-surface
      "
        >
            <div
                className="
          relative
          z-0
        "
            >
                <MapContainer
                    center={
                        selectedPosition ??
                        DEFAULT_CENTER
                    }

                    zoom={
                        selected
                            ? SELECTED_ZOOM
                            : DEFAULT_ZOOM
                    }

                    scrollWheelZoom={
                        !readOnly
                    }

                    className={`
            w-full
            ${height}
          `}
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'

                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapClickHandler
                        disabled={
                            readOnly
                        }

                        onLocationChange={
                            onLocationChange
                        }
                    />

                    <MapViewController
                        latitude={
                            latitude
                        }

                        longitude={
                            longitude
                        }
                    />

                    {selectedPosition && (
                        <>
                            <Marker
                                position={
                                    selectedPosition
                                }

                                icon={
                                    markerIcon
                                }

                                draggable={
                                    !readOnly
                                }

                                eventHandlers={
                                    readOnly
                                        ? {}
                                        : {
                                            dragend:
                                                event => {
                                                    const marker =
                                                        event
                                                            .target;

                                                    const position =
                                                        marker
                                                            .getLatLng();

                                                    onLocationChange?.({
                                                        latitude:
                                                            position.lat,

                                                        longitude:
                                                            position.lng
                                                    });
                                                }
                                        }
                                }
                            />

                            <Circle
                                center={
                                    selectedPosition
                                }

                                radius={
                                    safeRadius
                                }

                                pathOptions={{
                                    color:
                                        '#0067b1',

                                    fillColor:
                                        '#0067b1',

                                    fillOpacity:
                                        0.12,

                                    weight:
                                        2
                                }}
                            />
                        </>
                    )}
                </MapContainer>
            </div>

            <div
                className="
          border-t
          border-border
          bg-surface
          p-4
        "
            >
                {!selected ? (
                    <div
                        className="
              flex
              items-start
              gap-3
            "
                    >
                        <MousePointerClick
                            size={19}
                            className="
                mt-0.5
                shrink-0
                text-primary
              "
                        />

                        <div>
                            <p
                                className="
                  text-sm
                  font-semibold
                  text-text
                "
                            >
                                Pilih lokasi kantor
                            </p>

                            <p
                                className="
                  mt-1
                  text-xs
                  leading-5
                  text-muted
                "
                            >
                                Klik pada peta untuk
                                menentukan titik lokasi
                                kantor.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div
                        className="
              grid
              gap-3
              sm:grid-cols-3
            "
                    >
                        <div
                            className="
                rounded-xl
                bg-background
                p-3
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
                                <MapPin
                                    size={15}
                                />

                                <span
                                    className="text-xs"
                                >
                                    Latitude
                                </span>
                            </div>

                            <p
                                className="
                  mt-2
                  break-all
                  text-sm
                  font-semibold
                  text-text
                "
                            >
                                {Number(
                                    latitude
                                ).toFixed(7)}
                            </p>
                        </div>

                        <div
                            className="
                rounded-xl
                bg-background
                p-3
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
                                <MapPin
                                    size={15}
                                />

                                <span
                                    className="text-xs"
                                >
                                    Longitude
                                </span>
                            </div>

                            <p
                                className="
                  mt-2
                  break-all
                  text-sm
                  font-semibold
                  text-text
                "
                            >
                                {Number(
                                    longitude
                                ).toFixed(7)}
                            </p>
                        </div>

                        <div
                            className="
                rounded-xl
                bg-background
                p-3
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
                                <Radar
                                    size={15}
                                />

                                <span
                                    className="text-xs"
                                >
                                    Radius
                                </span>
                            </div>

                            <p
                                className="
                  mt-2
                  text-sm
                  font-semibold
                  text-text
                "
                            >
                                {safeRadius}
                                {' '}
                                meter
                            </p>
                        </div>
                    </div>
                )}

                {selected &&
                    !readOnly && (
                        <p
                            className="
              mt-3
              text-xs
              leading-5
              text-muted
            "
                        >
                            Klik titik lain pada peta
                            atau geser marker untuk
                            mengubah lokasi kantor.
                        </p>
                    )}
            </div>
        </div>
    );
}