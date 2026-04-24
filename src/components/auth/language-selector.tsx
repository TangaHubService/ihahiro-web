'use client'

import { Globe } from 'lucide-react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'rw', label: 'Kinyarwanda' },
  { code: 'sw', label: 'Kiswahili' },
]

export function LanguageSelector() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="flex items-center gap-2 text-sm text-[#5b695d]">
      <Globe className="size-4" />
      <select
        defaultValue={locale}
        onChange={(e) => {
          const newLocale = e.target.value
          const segments = pathname.split('/')
          segments[1] = newLocale
          const newPath = segments.join('/')
          router.replace(newPath)
        }}
        className="cursor-pointer bg-transparent font-medium outline-none"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  )
}