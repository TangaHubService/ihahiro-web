import type { ReactNode } from 'react'

export type SectionHeaderProps = {
  title: string
  description?: string
  eyebrow?: string
  action?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeader({
  title,
  description,
  eyebrow,
  action,
  align = 'left',
  className = '',
}: SectionHeaderProps) {
  const centered = align === 'center'

  return (
    <div
      className={`flex flex-col gap-4 ${centered ? 'items-center text-center' : 'items-start text-left md:flex-row md:items-end md:justify-between'} ${className}`}
    >
      <div className={centered ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2 text-[2rem] font-black leading-tight tracking-[-0.04em] text-[#173b1b] sm:text-[2.45rem]">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-[0.98rem] leading-relaxed text-[#647365]">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <div className={centered ? '' : 'shrink-0'}>{action}</div>
      ) : null}
    </div>
  )
}
