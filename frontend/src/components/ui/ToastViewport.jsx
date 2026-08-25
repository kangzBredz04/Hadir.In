import {
    CheckCircle2,
    CircleAlert,
    CircleX,
    Info,
    X
} from 'lucide-react';

const variants = {
    success: {
        Icon: CheckCircle2,
        className:
            'border-green-200 bg-green-50 text-success'
    },

    error: {
        Icon: CircleX,
        className:
            'border-red-200 bg-red-50 text-danger'
    },

    warning: {
        Icon: CircleAlert,
        className:
            'border-orange-200 bg-orange-50 text-warning'
    },

    info: {
        Icon: Info,
        className:
            'border-blue-200 bg-blue-50 text-primary'
    }
};

export default function ToastViewport({
    toasts,
    onDismiss
}) {
    return (
        <div
            className="
        pointer-events-none
        fixed
        left-4
        right-4
        top-4
        z-[100]
        flex
        flex-col
        gap-3
        sm:left-auto
        sm:w-[380px]
      "
            aria-live="polite"
            aria-atomic="false"
        >
            {toasts.map(toast => {
                const config =
                    variants[toast.variant] ??
                    variants.info;

                const Icon =
                    config.Icon;

                return (
                    <div
                        key={toast.id}
                        className={`
              pointer-events-auto
              flex
              items-start
              gap-3
              rounded-2xl
              border
              p-4
              shadow-lg
              ${config.className}
            `}
                        role={
                            toast.variant === 'error'
                                ? 'alert'
                                : 'status'
                        }
                    >
                        <Icon
                            size={20}
                            className="mt-0.5 shrink-0"
                            aria-hidden="true"
                        />

                        <div className="min-w-0 flex-1">
                            {toast.title && (
                                <p className="text-sm font-bold">
                                    {toast.title}
                                </p>
                            )}

                            <p
                                className="
                  mt-0.5
                  text-sm
                  leading-6
                "
                            >
                                {toast.message}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                onDismiss(toast.id)
                            }
                            className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                opacity-70
                transition
                hover:bg-black/5
                hover:opacity-100
              "
                            aria-label="Tutup notifikasi"
                        >
                            <X size={17} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}