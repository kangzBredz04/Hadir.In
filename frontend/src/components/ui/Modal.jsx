import {
    useEffect,
    useId,
    useRef
} from 'react';

import {
    X
} from 'lucide-react';

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
].join(',');

export default function Modal({
    open,
    title,
    children,
    onClose,
    maxWidth = 'max-w-3xl'
}) {
    const panelRef =
        useRef(null);

    const onCloseRef =
        useRef(onClose);

    const titleId =
        useId();

    useEffect(() => {
        onCloseRef.current =
            onClose;
    }, [onClose]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const previousFocusedElement =
            document.activeElement;

        const previousOverflow =
            document.body.style
                .overflow;

        document.body.style
            .overflow =
            'hidden';

        const panel =
            panelRef.current;

        const getFocusable =
            () =>
                Array.from(
                    panel?.querySelectorAll(
                        FOCUSABLE_SELECTOR
                    ) ?? []
                );

        const focusable =
            getFocusable();

        if (
            focusable.length > 0
        ) {
            focusable[0].focus();
        } else {
            panel?.focus();
        }

        const handleKeyDown =
            event => {
                if (
                    event.key ===
                    'Escape'
                ) {
                    onCloseRef
                        .current?.();

                    return;
                }

                if (
                    event.key !==
                    'Tab'
                ) {
                    return;
                }

                const elements =
                    getFocusable();

                if (
                    elements.length === 0
                ) {
                    event.preventDefault();

                    panel?.focus();

                    return;
                }

                const first =
                    elements[0];

                const last =
                    elements[
                    elements.length - 1
                    ];

                if (
                    event.shiftKey &&
                    document.activeElement ===
                    first
                ) {
                    event.preventDefault();

                    last.focus();

                    return;
                }

                if (
                    !event.shiftKey &&
                    document.activeElement ===
                    last
                ) {
                    event.preventDefault();

                    first.focus();
                }
            };

        document.addEventListener(
            'keydown',
            handleKeyDown
        );

        return () => {
            document.removeEventListener(
                'keydown',
                handleKeyDown
            );

            document.body.style
                .overflow =
                previousOverflow;

            if (
                previousFocusedElement
                instanceof HTMLElement
            ) {
                previousFocusedElement
                    .focus();
            }
        };
    }, [open]);

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
            role="presentation"
            onMouseDown={
                event => {
                    if (
                        event.target ===
                        event.currentTarget
                    ) {
                        onCloseRef
                            .current?.();
                    }
                }
            }
        >
            <div
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby={
                    titleId
                }
                className={`
          flex
          max-h-[92vh]
          w-full
          flex-col
          rounded-t-3xl
          bg-surface
          shadow-xl
          outline-none
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
                        id={titleId}
                        className="
              font-bold
              text-text
            "
                    >
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={() =>
                            onCloseRef
                                .current?.()
                        }
                        className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              text-muted
              transition
              hover:bg-background
              hover:text-text
              focus-visible:ring-2
              focus-visible:ring-primary
            "
                        aria-label="Tutup dialog"
                    >
                        <X size={20} />
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