import { LoaderCircle } from 'lucide-react';

const variants = {
    primary:
        'bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary',

    secondary:
        'bg-primary-light text-primary-dark hover:bg-blue-100 focus-visible:ring-primary',

    outline:
        'border border-border bg-surface text-text hover:bg-background focus-visible:ring-primary',

    success:
        'bg-success text-white hover:opacity-90 focus-visible:ring-success',

    danger:
        'bg-danger text-white hover:opacity-90 focus-visible:ring-danger',

    ghost:
        'bg-transparent text-text hover:bg-background focus-visible:ring-primary'
};

const sizes = {
    sm: 'min-h-9 px-3 text-sm',
    md: 'min-h-11 px-4 text-sm',
    lg: 'min-h-12 px-5 text-base'
};

export default function Button({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    className = '',
    ...props
}) {
    const isDisabled =
        disabled || loading;

    return (
        <button
            type={type}
            disabled={isDisabled}
            className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        font-semibold
        transition
        duration-200
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-offset-2
        disabled:pointer-events-none
        disabled:opacity-60
        ${variants[variant] ?? variants.primary}
        ${sizes[size] ?? sizes.md}
        ${className}
      `}
            {...props}
        >
            {loading && (
                <LoaderCircle
                    size={18}
                    className="animate-spin"
                    aria-hidden="true"
                />
            )}

            {children}
        </button>
    );
}