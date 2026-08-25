import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState
} from 'react';

export const PWAInstallContext =
    createContext(null);

function isIOSDevice() {
    if (
        typeof navigator ===
        'undefined'
    ) {
        return false;
    }

    return /iphone|ipad|ipod/i.test(
        navigator.userAgent
    );
}

function isAndroidDevice() {
    if (
        typeof navigator ===
        'undefined'
    ) {
        return false;
    }

    return /android/i.test(
        navigator.userAgent
    );
}

function isStandaloneMode() {
    if (
        typeof window ===
        'undefined' ||
        typeof navigator ===
        'undefined'
    ) {
        return false;
    }

    return (
        window.matchMedia(
            '(display-mode: standalone)'
        ).matches ||
        navigator.standalone ===
        true
    );
}

export default function PWAInstallProvider({
    children
}) {
    const [
        deferredPrompt,
        setDeferredPrompt
    ] =
        useState(null);

    const [
        installable,
        setInstallable
    ] =
        useState(false);

    const [
        installed,
        setInstalled
    ] =
        useState(
            isStandaloneMode()
        );

    const isIOS =
        useMemo(
            () =>
                isIOSDevice(),
            []
        );

    const isAndroid =
        useMemo(
            () =>
                isAndroidDevice(),
            []
        );

    useEffect(() => {
        const handleBeforeInstallPrompt =
            event => {
                console.log(
                    '[PWA] beforeinstallprompt diterima'
                );

                event.preventDefault();

                setDeferredPrompt(
                    event
                );

                setInstallable(
                    true
                );
            };

        const handleAppInstalled =
            () => {
                console.log(
                    '[PWA] aplikasi berhasil di-install'
                );

                setInstalled(
                    true
                );

                setInstallable(
                    false
                );

                setDeferredPrompt(
                    null
                );
            };

        window.addEventListener(
            'beforeinstallprompt',
            handleBeforeInstallPrompt
        );

        window.addEventListener(
            'appinstalled',
            handleAppInstalled
        );

        return () => {
            window.removeEventListener(
                'beforeinstallprompt',
                handleBeforeInstallPrompt
            );

            window.removeEventListener(
                'appinstalled',
                handleAppInstalled
            );
        };
    }, []);

    const install =
        useCallback(
            async () => {
                if (
                    !deferredPrompt
                ) {
                    return {
                        success: false,
                        reason:
                            'PROMPT_NOT_AVAILABLE'
                    };
                }

                try {
                    await deferredPrompt
                        .prompt();

                    const choice =
                        await deferredPrompt
                            .userChoice;

                    setDeferredPrompt(
                        null
                    );

                    setInstallable(
                        false
                    );

                    return {
                        success:
                            choice?.outcome ===
                            'accepted',

                        outcome:
                            choice?.outcome
                    };
                } catch {
                    return {
                        success: false,
                        reason:
                            'INSTALL_FAILED'
                    };
                }
            },
            [
                deferredPrompt
            ]
        );

    const value =
        useMemo(
            () => ({
                installable,
                installed,

                isIOS,
                isAndroid,

                install
            }),
            [
                installable,
                installed,
                isIOS,
                isAndroid,
                install
            ]
        );

    return (
        <PWAInstallContext.Provider
            value={value}
        >
            {children}
        </PWAInstallContext.Provider>
    );
}