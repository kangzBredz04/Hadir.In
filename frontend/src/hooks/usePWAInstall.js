import {
    useContext
} from 'react';

import {
    PWAInstallContext
} from '../contexts/PWAInstallContext';

export default function usePWAInstall() {
    const context =
        useContext(
            PWAInstallContext
        );

    if (!context) {
        throw new Error(
            'usePWAInstall harus digunakan di dalam PWAInstallProvider.'
        );
    }

    return context;
}