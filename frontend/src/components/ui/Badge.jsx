import {
    CheckCircle2,
    CircleAlert,
    CircleX
} from 'lucide-react';

const variants = {
    success: {
        className:
            'bg-green-50 text-success border-green-200',

        Icon:
            CheckCircle2
    },

    warning: {
        className:
            'bg-orange-50 text-warning border-orange-200',

        Icon:
            CircleAlert
    },

    danger: {
        className:
            'bg-red-50 text-danger border-red-200',

        Icon:
            CircleX
    },

    neutral: {
        className:
            'bg-background text-muted border-border',

        Icon:
            null
    }
};

export default function Badge({
    children,
    variant = 'neutral',
    showIcon = true
}) {
    const config =
        variants[variant] ??
        variants.neutral;

    const Icon =
        config.Icon;

    return (
        <span
            className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        px-2.5
        py-1
        text-xs
        font-semibold
        ${config.className}
      `}
        >
            {showIcon && Icon && (
                <Icon
                    size={14}
                    aria-hidden="true"
                />
            )}

            {children}
        </span>
    );
}