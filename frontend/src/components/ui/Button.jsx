const variants = {
  primary: 'bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary/30',
  secondary:
    'border border-border bg-white text-primary-dark hover:border-primary/40 hover:bg-primary-soft focus-visible:ring-primary/20',
  ghost: 'text-ink-muted hover:bg-primary-soft hover:text-primary-dark focus-visible:ring-primary/20',
};

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
