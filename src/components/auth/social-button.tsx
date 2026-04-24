'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { LucideIcon } from 'lucide-react'

export interface SocialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon
  label: string
}

export const SocialButton = forwardRef<HTMLButtonElement, SocialButtonProps>(
  ({ icon: Icon, label, className = '', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        {...props}
        className={`
          flex w-full items-center justify-center gap-3 rounded-xl border border-[#D4E4D1] 
          bg-white px-4 py-3 font-medium text-[#1B5E20] 
          transition-all duration-200
          hover:border-[#2E7D32] hover:bg-[#E8F5E9]
          disabled:cursor-not-allowed disabled:opacity-50
          ${className}
        `}
      >
        <Icon className="size-5" />
        <span>{label}</span>
      </button>
    )
  }
)

SocialButton.displayName = 'SocialButton'