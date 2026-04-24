'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

type ToastVariant = 'success' | 'error' | 'info'

type ToastInput = {
  title?: string
  description: string
  variant?: ToastVariant
  duration?: number
}

type ToastRecord = ToastInput & {
  id: string
}

type ToastContextValue = {
  toast: (input: ToastInput) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

function getToastStyles(variant: ToastVariant) {
  switch (variant) {
    case 'success':
      return {
        container: 'border-[#d3e8cf] bg-[#f4fbf2] text-[#19321d]',
        iconWrap: 'bg-[#e6f4e1] text-primary',
        Icon: CheckCircle2,
      }
    case 'error':
      return {
        container: 'border-[#f1c9c2] bg-[#fff6f4] text-[#612c25]',
        iconWrap: 'bg-[#fde6e2] text-[#b34c3e]',
        Icon: TriangleAlert,
      }
    default:
      return {
        container: 'border-[#d7e1ec] bg-[#f5f9fd] text-[#1e3446]',
        iconWrap: 'bg-[#e7f0f7] text-[#2f6b98]',
        Icon: Info,
      }
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const tCommon = useTranslations('common')
  const [toasts, setToasts] = useState<ToastRecord[]>([])
  const timeoutRefs = useRef<Map<string, number>>(new Map())

  const dismiss = useCallback((id: string) => {
    const timeoutId = timeoutRefs.current.get(id)

    if (timeoutId) {
      window.clearTimeout(timeoutId)
      timeoutRefs.current.delete(id)
    }

    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const toast = useCallback(
    ({ duration = 4500, variant = 'info', ...input }: ToastInput) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

      setToasts((current) => [...current, { id, variant, duration, ...input }])

      const timeoutId = window.setTimeout(() => {
        dismiss(id)
      }, duration)

      timeoutRefs.current.set(id, timeoutId)
    },
    [dismiss]
  )

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
      timeoutRefs.current.clear()
    }
  }, [])

  const value = useMemo(
    () => ({
      toast,
      dismiss,
    }),
    [toast, dismiss]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-4 top-4 z-[120] flex flex-col gap-3 sm:left-auto sm:right-4 sm:max-w-sm"
      >
        {toasts.map((item) => {
          const styles = getToastStyles(item.variant ?? 'info')
          const Icon = styles.Icon

          return (
            <div
              key={item.id}
              className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-[0_18px_45px_rgba(21,45,25,0.12)] backdrop-blur-sm ${styles.container}`}
              role="status"
            >
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl ${styles.iconWrap}`}>
                  <Icon className="size-4" aria-hidden />
                </span>

                <div className="min-w-0 flex-1">
                  {item.title ? (
                    <p className="text-sm font-bold tracking-[-0.01em]">{item.title}</p>
                  ) : null}
                  <p className={`text-sm leading-6 ${item.title ? 'mt-0.5' : ''}`}>{item.description}</p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  className="size-8 shrink-0 rounded-xl p-0 text-current hover:bg-black/5"
                  onClick={() => dismiss(item.id)}
                  aria-label={tCommon('close')}
                >
                  <X className="size-4" aria-hidden />
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}
