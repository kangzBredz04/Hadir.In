import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';

import ToastViewport from '../components/ui/ToastViewport';

export const ToastContext =
    createContext(null);

let fallbackId = 0;

function createToastId() {
    if (
        typeof crypto !== 'undefined' &&
        typeof crypto.randomUUID === 'function'
    ) {
        return crypto.randomUUID();
    }

    fallbackId += 1;

    return `toast-${Date.now()}-${fallbackId}`;
}

export function ToastProvider({
    children
}) {
    const [
        toasts,
        setToasts
    ] =
        useState([]);

    const timersRef =
        useRef(new Map());

    const dismiss =
        useCallback(id => {
            const timer =
                timersRef.current.get(id);

            if (timer) {
                clearTimeout(timer);

                timersRef.current.delete(id);
            }

            setToasts(previous =>
                previous.filter(
                    toast =>
                        toast.id !== id
                )
            );
        }, []);

    const showToast =
        useCallback(
            ({
                title,
                message,
                variant = 'info',
                duration = 4000
            }) => {
                if (!message) {
                    return null;
                }

                const id =
                    createToastId();

                setToasts(previous => [
                    ...previous,
                    {
                        id,
                        title,
                        message,
                        variant
                    }
                ]);

                if (
                    Number.isFinite(duration) &&
                    duration > 0
                ) {
                    const timer =
                        setTimeout(
                            () => {
                                dismiss(id);
                            },
                            duration
                        );

                    timersRef.current.set(
                        id,
                        timer
                    );
                }

                return id;
            },
            [dismiss]
        );

    useEffect(() => {
        return () => {
            timersRef.current.forEach(
                timer =>
                    clearTimeout(timer)
            );

            timersRef.current.clear();
        };
    }, []);

    const value =
        useMemo(
            () => ({
                showToast,

                success(
                    message,
                    title = 'Berhasil'
                ) {
                    return showToast({
                        title,
                        message,
                        variant: 'success'
                    });
                },

                error(
                    message,
                    title = 'Terjadi kendala'
                ) {
                    return showToast({
                        title,
                        message,
                        variant: 'error',
                        duration: 5000
                    });
                },

                warning(
                    message,
                    title = 'Perhatian'
                ) {
                    return showToast({
                        title,
                        message,
                        variant: 'warning'
                    });
                },

                info(
                    message,
                    title = 'Informasi'
                ) {
                    return showToast({
                        title,
                        message,
                        variant: 'info'
                    });
                },

                dismiss
            }),
            [
                showToast,
                dismiss
            ]
        );

    return (
        <ToastContext.Provider
            value={value}
        >
            {children}

            <ToastViewport
                toasts={toasts}
                onDismiss={dismiss}
            />
        </ToastContext.Provider>
    );
}