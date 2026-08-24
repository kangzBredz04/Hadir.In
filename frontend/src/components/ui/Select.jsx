export default function Select({ id, label, error, hint, className = '', children, ...props }) {
  const descriptionId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-primary-dark">{label}</label>
      <select
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        className={`min-h-12 w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink outline-none transition focus:ring-4 ${
          error ? 'border-danger focus:border-danger focus:ring-danger/10' : 'border-border hover:border-primary/40 focus:border-primary focus:ring-primary/10'
        }`}
        {...props}
      >
        {children}
      </select>
      {error && <p id={`${id}-error`} className="mt-2 text-xs font-medium text-danger" role="alert">{error}</p>}
      {!error && hint && <p id={`${id}-hint`} className="mt-2 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}
