import {
    apiRequest,
    getResponseData
} from './api';

let todayRequestPromise = null;

export async function getTodayAttendance({
    force = false
} = {}) {
    if (
        !force &&
        todayRequestPromise
    ) {
        return todayRequestPromise;
    }

    const request =
        apiRequest(
            '/attendance/today'
        )
            .then(payload => {
                const data =
                    getResponseData(
                        payload
                    );

                return {
                    date:
                        data?.date ??
                        null,

                    attendance:
                        data?.attendance ??
                        null
                };
            });

    todayRequestPromise =
        request.finally(() => {
            if (
                todayRequestPromise
            ) {
                todayRequestPromise =
                    null;
            }
        });

    return todayRequestPromise;
}