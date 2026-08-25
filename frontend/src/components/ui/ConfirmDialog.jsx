import {
    TriangleAlert
} from 'lucide-react';

import Button from './Button';
import Modal from './Modal';

export default function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = 'Ya, lanjutkan',
    cancelLabel = 'Batal',
    loading = false,
    danger = true,
    onConfirm,
    onClose
}) {
    return (
        <Modal
            open={open}
            title={title}
            maxWidth="max-w-md"
            onClose={
                loading
                    ? () => { }
                    : onClose
            }
        >
            <div
                className="
          flex
          items-start
          gap-3
        "
            >
                <div
                    className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${danger
                            ? 'bg-red-50 text-danger'
                            : 'bg-primary-light text-primary'
                        }
          `}
                >
                    <TriangleAlert
                        size={20}
                    />
                </div>

                <p
                    className="
            text-sm
            leading-6
            text-muted
          "
                >
                    {message}
                </p>
            </div>

            <div
                className="
          mt-6
          flex
          flex-col-reverse
          gap-2
          sm:flex-row
          sm:justify-end
        "
            >
                <Button
                    variant="outline"
                    disabled={loading}
                    onClick={onClose}
                >
                    {cancelLabel}
                </Button>

                <Button
                    variant={
                        danger
                            ? 'danger'
                            : 'primary'
                    }
                    loading={loading}
                    onClick={onConfirm}
                >
                    {confirmLabel}
                </Button>
            </div>
        </Modal>
    );
}