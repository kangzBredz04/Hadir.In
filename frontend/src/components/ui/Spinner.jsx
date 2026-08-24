import {
    LoaderCircle
} from 'lucide-react';

export default function Spinner({
    size = 24,
    label = 'Memuat...'
}) {
    return (
        <div
            className="
        inline-flex
        items-center
        gap-2
        text-muted
      "
            role="status"
            aria-live="polite"
        >
            <LoaderCircle
                size={size}
                className="animate-spin"
                aria-hidden="true"
            />

            {label && (
                <span className="text-sm">
                    {label}
                </span>
            )}
        </div>
    );
}