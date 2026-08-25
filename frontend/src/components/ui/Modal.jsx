import {
    useEffect
} from 'react';

import {
    X
} from 'lucide-react';

export default function Modal({
    open,
    title,
    children,
    onClose,
    maxWidth = 'max-w-3xl'
}) {
    useEffect(() => {
        if (!open) {
            return;
        }

        const handleKeyDown =
            event => {
                if (
                    event.key ===
                    'Escape'
                ) {
                    onClose();
                }
            };

        document.addEventListener(
            'keydown',
            handleKeyDown
        );

        const previousOverflow =
            document.body.style
                .overflow;

        document.body.style
            .overflow =
            'hidden';

        return () => {
            document.removeEventListener(
                'keydown',
                handleKeyDown
            );

            document.body.style
                .overflow =
                previousOverflow;
        };
    }, [
        open,
        onClose
    ]);

    if (!open) {
        return null;
    }

    return (
        <div
            className="
        fixed
        inset-0
        z-50
        flex
        items-end
        justify-center
        bg-slate-950/50
        p-0
        backdrop-blur-sm
        sm:items-center
        sm:p-4
      "
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onMouseDown={
                event => {
                    if (
                        event.target ===
                        event.currentTarget
                    ) {
                        onClose();
                    }
                }
            }
        >
            <div
                className={`
          flex
          max-h-[92vh]
          w-full
          flex-col
          rounded-t-3xl
          bg-surface
          shadow-xl
          sm:rounded-3xl
          ${maxWidth}
        `}
            >
                <div
                    className="
            flex
            items-center
            justify-between
            gap-4
            border-b
            border-border
            px-5
            py-4
          "
                >
                    <h2
                        className="
              font-bold
              text-text
            "
                    >
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              text-muted
              transition
              hover:bg-background
              hover:text-text
            "
                        aria-label="Tutup"
                    >
                        <X
                            size={20}
                        />
                    </button>
                </div>

                <div
                    className="
            overflow-y-auto
            p-5
          "
                >
                    {children}
                </div>
            </div>
        </div>
    );
}