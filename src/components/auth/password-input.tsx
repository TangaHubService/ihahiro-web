'use client'

import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { Lock } from 'lucide-react'
import { Eye, EyeOff } from 'lucide-react'

export interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  showForgot?: boolean
  forgotHref?: string
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, showForgot, forgotHref, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-[#1B5E20]">{label}</label>
          {showForgot && forgotHref && (
            <a
              href={forgotHref}
              className="text-sm font-medium text-[#2E7D32] hover:underline"
            >
              Forgot password?
            </a>
          )}
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Lock className="size-5 text-[#8B9A8E]" />
          </div>
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            {...props}
            className={`
              w-full rounded-xl border border-[#D4E4D1] bg-white px-4 py-3
              pr-11 text-[#1B5E20] placeholder:text-[#8B9A8E]
              focus:border-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20
              disabled:cursor-not-allowed disabled:opacity-50
              pl-11 ${error ? 'border-red-500' : ''} ${className}
            `}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#8B9A8E] hover:text-[#2E7D32]"
          >
            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'