import { Loader2 } from 'lucide-react'

const variantStyles = {
  primary:
    'bg-primary text-white hover:bg-primary-dark disabled:bg-primary/60 focus-visible:outline-primary',
  secondary:
    'bg-primary-light text-primary-dark hover:bg-primary-light/70 disabled:opacity-60 focus-visible:outline-primary',
  ghost:
    'bg-transparent text-text hover:bg-background disabled:opacity-60 focus-visible:outline-primary',
  danger:
    'bg-danger text-white hover:bg-danger/90 disabled:opacity-60 focus-visible:outline-danger',
}

/**
 * Tombol reusable dengan varian warna, loading state, dan full-width.
 * Selalu disable otomatis saat isLoading agar user tidak bisa submit ganda.
 */
export function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  type = 'button',
  className = '',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {isLoading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}
