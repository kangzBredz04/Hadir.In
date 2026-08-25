export default function Input({
    label,
    id,
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

            <input
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
          placeholder:text-slate-400
          focus:border-primary
          focus:ring-4
          focus:ring-primary/10
          disabled:cursor-not-allowed
          disabled:opacity-60
          ${className}
        `}
                {...props}
            />

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