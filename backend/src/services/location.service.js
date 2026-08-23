import {
    calculateHaversineDistance
} from '../utils/distance.js';

const checkLocationAgainstOffice = ({
    latitude,
    longitude,
    officeLatitude,
    officeLongitude,
    radiusMeter
}) => {
    const distance =
        calculateHaversineDistance({
            latitude1:
                latitude,

            longitude1:
                longitude,

            latitude2:
                officeLatitude,

            longitude2:
                officeLongitude
        });

    const allowedRadius =
        Number(radiusMeter);

    return {
        distance,

        allowedRadius,

        isWithinRadius:
            distance <=
            allowedRadius
    };
};

export {
    checkLocationAgainstOffice
};