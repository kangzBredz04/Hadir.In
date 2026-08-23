const EARTH_RADIUS_METER =
    6371000;

const degreesToRadians = (
    degrees
) => {
    return (
        degrees *
        Math.PI /
        180
    );
};

const calculateHaversineDistance = ({
    latitude1,
    longitude1,
    latitude2,
    longitude2
}) => {
    const lat1 =
        Number(latitude1);

    const lon1 =
        Number(longitude1);

    const lat2 =
        Number(latitude2);

    const lon2 =
        Number(longitude2);

    const deltaLatitude =
        degreesToRadians(
            lat2 - lat1
        );

    const deltaLongitude =
        degreesToRadians(
            lon2 - lon1
        );

    const latitude1Rad =
        degreesToRadians(
            lat1
        );

    const latitude2Rad =
        degreesToRadians(
            lat2
        );

    const a =
        Math.sin(
            deltaLatitude / 2
        ) ** 2 +
        Math.cos(
            latitude1Rad
        ) *
        Math.cos(
            latitude2Rad
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
        EARTH_RADIUS_METER * c;

    return Math.round(
        distance * 100
    ) / 100;
};

export {
    calculateHaversineDistance
};