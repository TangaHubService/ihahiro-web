'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'

type ModalProps = {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children?: React.ReactNode
}

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
}: ModalProps) {
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

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        className="absolute inset-0 bg-[#0f1a12]/45 backdrop-blur-[2px]"
        aria-label={tCommon('close')}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-modal-title"
        className="relative z-10 w-full max-w-md rounded-[1.75rem] border border-[#dce5db] bg-white p-6 shadow-[0_24px_60px_rgba(15,26,18,0.2)]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-xl text-[#617063] transition hover:bg-[#f4f7f3] hover:text-primary"
          aria-label={tCommon('close')}
        >
          <X className="size-4" aria-hidden />
        </button>

        <div className="pr-10">
          <h2 id="app-modal-title" className="text-[1.35rem] font-black tracking-[-0.02em] text-[#18251a]">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 text-sm leading-6 text-[#5a675c]">{description}</p>
          ) : null}
        </div>

        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </div>
  )
}
