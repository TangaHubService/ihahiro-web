'use client'

import { LucideIcon } from 'lucide-react'

export interface FeatureBadgeProps {
  icon: LucideIcon
  title: string
  description: string
}

export function FeatureBadge({ icon: Icon, title, description }: FeatureBadgeProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9]">
        <Icon className="size-6 text-[#2E7D32]" />
      </div>
      <div className="mt-3">
        <h3 className="font-semibold text-[#1B5E20]">{title}</h3>
        <p className="mt-1 text-sm text-[#5b695d]">{description}</p>
      </div>
    </div>
  )
}