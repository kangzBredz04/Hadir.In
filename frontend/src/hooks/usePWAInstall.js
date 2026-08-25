import {
    useEffect,
    useState
} from 'react';

function isIOSDevice() {
    if (
        typeof navigator ===
        'undefined'
    ) {
        return false;
    }

    return (
        /iphone|ipad|ipod/i.test(
            navigator.userAgent
        )
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

export default function usePWAInstall() {
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

    const [
        isIOS
    ] =
        useState(
            isIOSDevice()
        );

    useEffect(() => {
        const handleBeforeInstall =
            event => {
                /*
                 * Simpan prompt browser
                 * agar bisa dipanggil dari
                 * tombol kita sendiri.
                 */
                event.preventDefault();

                setDeferredPrompt(
                    event
                );

                setInstallable(
                    true
                );
            };

        const handleInstalled =
            () => {
                setInstalled(true);

                setInstallable(
                    false
                );

                setDeferredPrompt(
                    null
                );
            };

        window.addEventListener(
            'beforeinstallprompt',
            handleBeforeInstall
        );

        window.addEventListener(
            'appinstalled',
            handleInstalled
        );

        return () => {
            window.removeEventListener(
                'beforeinstallprompt',
                handleBeforeInstall
            );

            window.removeEventListener(
                'appinstalled',
                handleInstalled
            );
        };
    }, []);

    const install =
        async () => {
            if (
                !deferredPrompt
            ) {
                return false;
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

                return (
                    choice?.outcome ===
                    'accepted'
                );
            } catch {
                return false;
            }
        };

    return {
        installable,
        installed,
        isIOS,

        install
    };
}