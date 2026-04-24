import { type InputHTMLAttributes, forwardRef, useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, type, id: idProp, ...props }, ref) => {
    const genId = useId()
    const id = idProp ?? genId
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label ? (
          <label htmlFor={id} className="text-sm font-medium text-foreground">
            {label}
          </label>
        ) : null}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={inputType}
            className={`w-full rounded-lg border border-border bg-white px-3 py-2.5 pr-10 text-sm text-foreground outline-none ring-primary/30 placeholder:text-muted focus:ring-2 ${error ? 'border-accent' : ''} ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-primary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </button>
          )}
        </div>
        {error ? (
          <p className="text-sm text-accent" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'