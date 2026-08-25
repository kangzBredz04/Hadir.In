export default function Select({
    label,
    id,
    children,
    error,
    className = '',
    ...props
}) {
    return (
        <div>
            {label && (
                <label
                    htmlFor={id}
                    className="
            mb-2
            block
            text-sm
            font-medium
            text-text
          "
                >
                    {label}
                </label>
            )}

            <select
                id={id}
                className={`
          min-h-11
          w-full
          rounded-xl
          border
          border-border
          bg-surface
          px-3.5
          text-sm
          text-text
          outline-none
          transition
          focus:border-primary
          focus:ring-4
          focus:ring-primary/10
          ${className}
        `}
                {...props}
            >
                {children}
            </select>

            {error && (
                <p
                    className="
            mt-1.5
            text-xs
            text-danger
          "
                >
                    {error}
                </p>
            )}
        </div>
    );
}