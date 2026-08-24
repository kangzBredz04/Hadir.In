import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState
} from 'react';

import {
    getCurrentUser,
    loginUser
} from '../services/auth.service';

import {
    AUTH_UNAUTHORIZED_EVENT,
    clearAccessToken,
    getAccessToken,
    setAccessToken
} from '../utils/authStorage';

export const AuthContext =
    createContext(null);

/*
 * React StrictMode pada development
 * dapat menjalankan effect lebih dari
 * sekali.
 *
 * Promise ini mencegah /users/me
 * dihitung sebagai request baru
 * berkali-kali untuk token yang sama.
 */
let bootstrapToken = null;
let bootstrapPromise = null;

function loadInitialUser(
    token
) {
    if (
        bootstrapPromise &&
        bootstrapToken === token
    ) {
        return bootstrapPromise;
    }

    bootstrapToken =
        token;

    bootstrapPromise =
        getCurrentUser();

    return bootstrapPromise;
}

function resetBootstrap() {
    bootstrapToken = null;
    bootstrapPromise = null;
}

export function AuthProvider({
    children
}) {
    const [
        user,
        setUser
    ] =
        useState(null);

    const [
        isInitializing,
        setIsInitializing
    ] =
        useState(true);

    const logout =
        useCallback(() => {
            clearAccessToken();

            resetBootstrap();

            setUser(null);

            setIsInitializing(false);
        }, []);

    /*
     * Kalau API mendapatkan 401
     * karena JWT expired/invalid,
     * api.js mengirim global event.
     */
    useEffect(() => {
        const handleUnauthorized =
            () => {
                logout();
            };

        window.addEventListener(
            AUTH_UNAUTHORIZED_EVENT,
            handleUnauthorized
        );

        return () => {
            window.removeEventListener(
                AUTH_UNAUTHORIZED_EVENT,
                handleUnauthorized
            );
        };
    }, [logout]);

    /*
     * Restore authentication ketika
     * page direfresh.
     */
    useEffect(() => {
        const token =
            getAccessToken();

        if (!token) {
            setIsInitializing(
                false
            );

            return;
        }

        let cancelled =
            false;

        loadInitialUser(
            token
        )
            .then(
                currentUser => {
                    if (!cancelled) {
                        setUser(
                            currentUser
                        );
                    }
                }
            )
            .catch(() => {
                clearAccessToken();

                resetBootstrap();

                if (!cancelled) {
                    setUser(null);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setIsInitializing(
                        false
                    );
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const login =
        useCallback(
            async credentials => {
                const result =
                    await loginUser(
                        credentials
                    );

                setAccessToken(
                    result.token
                );

                resetBootstrap();

                setUser(
                    result.user
                );

                return result.user;
            },
            []
        );

    const refreshUser =
        useCallback(
            async () => {
                const currentUser =
                    await getCurrentUser();

                setUser(
                    currentUser
                );

                return currentUser;
            },
            []
        );

    const value =
        useMemo(
            () => ({
                user,

                isAuthenticated:
                    Boolean(user),

                isInitializing,

                login,
                logout,
                refreshUser
            }),
            [
                user,
                isInitializing,
                login,
                logout,
                refreshUser
            ]
        );

    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    );
}