const EARTH_RADIUS_METERS =
    6371000;

function toRadians(
    degrees
) {
    return (
        Number(degrees) *
        Math.PI /
        180
    );
}

export function calculateDistanceMeters({
    latitude1,
    longitude1,
    latitude2,
    longitude2
}) {
    const lat1 =
        Number(latitude1);

    const lon1 =
        Number(longitude1);

    const lat2 =
        Number(latitude2);

    const lon2 =
        Number(longitude2);

    if (
        ![
            lat1,
            lon1,
            lat2,
            lon2
        ].every(
            Number.isFinite
        )
    ) {
        return null;
    }

    const deltaLatitude =
        toRadians(
            lat2 - lat1
        );

    const deltaLongitude =
        toRadians(
            lon2 - lon1
        );

    const lat1Radians =
        toRadians(lat1);

    const lat2Radians =
        toRadians(lat2);

    const a =
        Math.sin(
            deltaLatitude / 2
        ) ** 2 +
        Math.cos(
            lat1Radians
        ) *
        Math.cos(
            lat2Radians
        ) *
        Math.sin(
            deltaLongitude / 2
        ) ** 2;

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    const distance =
        EARTH_RADIUS_METERS *
        c;

    return Math.round(
        distance * 100
    ) / 100;
}