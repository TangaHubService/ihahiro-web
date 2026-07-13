'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'

type DrawerProps = {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children?: React.ReactNode
  footer?: React.ReactNode
}

export function Drawer({
  open,
  title,
  description,
  onClose,
  children,
  footer,
}: DrawerProps) {
  const tCommon = useTranslations('common')

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose])

  return (
    <div
      className={`fixed inset-0 z-[110] ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-[#0f1a12]/45 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label={tCommon('close')}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-drawer-title"
        className={`absolute inset-y-0 right-0 flex h-full w-full max-w-lg flex-col border-l border-[#dce5db] bg-white shadow-[-24px_0_60px_rgba(15,26,18,0.2)] transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#eaefe8] px-6 py-5">
          <div className="min-w-0">
            <h2
              id="app-drawer-title"
              className="text-[1.2rem] font-black tracking-[-0.02em] text-[#18251a]"
            >
              {title}
            </h2>
            {description ? (
              <p className="mt-1 truncate text-sm text-[#5a675c]">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-[#617063] transition hover:bg-[#f4f7f3] hover:text-primary"
            aria-label={tCommon('close')}
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {footer ? (
          <div className="shrink-0 border-t border-[#eaefe8] px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}
