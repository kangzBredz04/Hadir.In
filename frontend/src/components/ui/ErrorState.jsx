import {
    CircleAlert,
    RefreshCw
} from 'lucide-react';

import Button from './Button';

export default function ErrorState({
    title =
    'Data gagal dimuat',

    message =
    'Terjadi kendala saat mengambil data.',

    actionLabel =
    'Coba Lagi',

    onRetry
}) {
    return (
        <div
            className="
        flex
        min-h-60
        flex-col
        items-center
        justify-center
        px-6
        py-10
        text-center
      "
            role="alert"
        >
            <div
                className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-red-50
          text-danger
        "
            >
                <CircleAlert
                    size={27}
                    aria-hidden="true"
                />
            </div>

            <h3
                className="
          mt-4
          font-bold
          text-text
        "
            >
                {title}
            </h3>

            <p
                className="
          mt-2
          max-w-md
          text-sm
          leading-6
          text-muted
        "
            >
                {message}
            </p>

            {onRetry && (
                <Button
                    variant="outline"
                    className="mt-5"
                    onClick={onRetry}
                >
                    <RefreshCw size={17} />

                    {actionLabel}
                </Button>
            )}
        </div>
    );
}