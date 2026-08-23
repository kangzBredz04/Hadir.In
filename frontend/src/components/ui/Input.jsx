import { forwardRef, useId } from 'react'

/**
 * Input reusable dengan label, error message, dan slot elemen kanan
 * (dipakai untuk toggle show/hide password, icon, dsb).
 */
export const Input = forwardRef(function Input(
  { label, error, rightElement, className = '', id, ...rest },
  ref,
) {
  const generatedId = useId()
  const inputId = id || generatedId

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="text-label mb-1.5 block">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          ref={ref}
          className={`text-body w-full rounded-md border bg-surface px-3.5 py-2.5 placeholder:text-muted focus:outline-none focus:ring-2 ${
            error
              ? 'border-danger focus:ring-danger/20'
              : 'border-border focus:border-primary focus:ring-primary/20'
          } ${rightElement ? 'pr-11' : ''} ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...rest}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">{rightElement}</div>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-caption mt-1.5 text-danger">
          {error}
        </p>
      )}
    </div>
  )
})
