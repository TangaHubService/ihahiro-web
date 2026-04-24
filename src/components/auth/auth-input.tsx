'use client'

import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { User } from 'lucide-react'

export interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: React.ReactNode
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[#1B5E20]">{label}</label>
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <User className="size-5 text-[#8B9A8E]" />
            </div>
          )}
          <input
            ref={ref}
            {...props}
            className={`
              w-full rounded-xl border border-[#D4E4D1] bg-white px-4 py-3
              text-[#1B5E20] placeholder:text-[#8B9A8E]
              focus:border-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20
              disabled:cursor-not-allowed disabled:opacity-50
              ${icon ? 'pl-11' : ''}
              ${error ? 'border-red-500' : ''}
              ${className}
            `}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

AuthInput.displayName = 'AuthInput'