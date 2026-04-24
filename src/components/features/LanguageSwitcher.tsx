'use client'

import { routing } from '@/i18n/routing'
import { usePathname, useRouter } from '@/i18n/navigation'
import { Check, ChevronDown, Globe, Languages } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useTransition, useState, useRef, useEffect } from 'react'

const FLAGS: Record<string, string> = {
  rw: '🇷🇼',
  en: '🇬🇧',
  fr: '🇫🇷',
  sw: '🇹🇿',
}

const LOCALES = routing.locales

export function LanguageSwitcher() {
  const t = useTranslations('lang')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLocale = locale as typeof LOCALES[number]
  const currentLabel = t(currentLocale)
  const currentFlag = FLAGS[currentLocale] ?? ''

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(nextLocale: string) {
    setIsOpen(false)
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale })
    })
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        aria-label={t('label')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen(!isOpen)}
        disabled={pending}
        className="group flex h-11 items-center gap-2 rounded-xl border border-[#dfe5df] bg-white px-3 py-2 text-sm font-medium text-[#1f2937] shadow-sm transition-all duration-200 hover:border-primary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
      >
        <Globe className="size-4 text-primary" aria-hidden />
        <span className="hidden sm:inline">{currentFlag}</span>
        <span className="min-w-[3.5rem] text-left">{currentLabel}</span>
        <ChevronDown
          className={`size-4 text-[#6b7280] transition-transform duration-200 group-hover:text-primary ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>

      <div
        role="listbox"
        aria-label={t('label')}
        className={`absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-[#dfe5df] bg-white py-1 shadow-[0_12px_40px_rgba(21,45,25,0.15)] transition-all duration-200 ${
          isOpen
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-2 opacity-0'
        }`}
      >
        {LOCALES.map((loc) => {
          const isActive = loc === locale
          return (
            <button
              key={loc}
              type="button"
              role="option"
              aria-selected={isActive}
              onClick={() => handleSelect(loc)}
              disabled={pending}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-[#1f2937] hover:bg-[#f3f5f3]'
              }`}
            >
              <span className="text-base">{FLAGS[loc]}</span>
              <span className="flex-1 text-left">{t(loc)}</span>
              {isActive && <Check className="size-4 text-primary" aria-hidden />}
            </button>
          )
        })}
      </div>
    </div>
  )
}