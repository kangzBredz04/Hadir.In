const ACCESS_TOKEN_KEY =
    'hadir_in_access_token';

export const AUTH_UNAUTHORIZED_EVENT =
    'hadir-in:unauthorized';

export function getAccessToken() {
    try {
        return sessionStorage.getItem(
            ACCESS_TOKEN_KEY
        );
    } catch {
        return null;
    }
}

export function setAccessToken(
    token
) {
    if (!token) {
        return;
    }

    sessionStorage.setItem(
        ACCESS_TOKEN_KEY,
        token
    );
}

export function clearAccessToken() {
    try {
        sessionStorage.removeItem(
            ACCESS_TOKEN_KEY
        );
    } catch {
        // Storage unavailable.
    }
}