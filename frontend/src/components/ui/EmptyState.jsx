import {
    Inbox
} from 'lucide-react';

import Button from './Button';

export default function EmptyState({
    icon: Icon = Inbox,

    title =
    'Belum ada data.',

    description,

    actionLabel,

    onAction
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
        >
            <div
                className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-primary-light
          text-primary
        "
            >
                <Icon
                    size={26}
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

            {description && (
                <p
                    className="
            mt-2
            max-w-md
            text-sm
            leading-6
            text-muted
          "
                >
                    {description}
                </p>
            )}

            {actionLabel &&
                onAction && (
                    <Button
                        className="mt-5"
                        onClick={onAction}
                    >
                        {actionLabel}
                    </Button>
                )}
        </div>
    );
}