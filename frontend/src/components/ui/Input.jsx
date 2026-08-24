export default function Input({
  id,
  label,
  error,
  hint,
  leadingIcon: LeadingIcon,
  trailingAction,
  className = '',
  ...props
}) {
  const descriptionId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-primary-dark">
        {label}
      </label>
      <div className="relative">
        {LeadingIcon && (
          <LeadingIcon
            aria-hidden="true"
            size={19}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
          />
        )}
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={descriptionId}
          className={`min-h-12 w-full rounded-xl border bg-white py-3 text-sm text-ink outline-none transition placeholder:text-ink-muted/70 focus:ring-4 ${
            LeadingIcon ? 'pl-11' : 'pl-4'
          } ${trailingAction ? 'pr-12' : 'pr-4'} ${
            error
              ? 'border-danger focus:border-danger focus:ring-danger/10'
              : 'border-border hover:border-primary/40 focus:border-primary focus:ring-primary/10'
          }`}
          {...props}
        />
        {trailingAction && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">{trailingAction}</div>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${id}-hint`} className="mt-2 text-xs text-ink-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
