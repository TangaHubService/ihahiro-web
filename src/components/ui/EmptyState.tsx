import type { ReactNode } from 'react'

export type EmptyStateProps = {
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-2xl border border-[#e1e7df] bg-white px-6 py-10 text-center shadow-[0_14px_40px_rgba(21,45,25,0.04)] ${className}`}
    >
      <h3 className="text-lg font-bold text-[#18251a]">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-[#5f6c61]">
        {description}
      </p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  )
}
