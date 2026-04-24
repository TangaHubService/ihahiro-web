import { type ButtonHTMLAttributes, forwardRef } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'border border-transparent bg-primary text-primary-foreground hover:opacity-90',
  secondary:
    'border border-transparent bg-secondary text-white hover:opacity-90',
  outline: 'border border-primary bg-white text-primary hover:bg-trust',
  ghost: 'border border-transparent text-primary hover:bg-trust',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  )
)

Button.displayName = 'Button'
