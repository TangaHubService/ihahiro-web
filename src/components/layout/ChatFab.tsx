'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { useAuth } from '@/hooks/useAuth'
import { MessageCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function ChatFab() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()

  const isChatRoute = pathname === '/chat' || pathname.startsWith('/chat/')

  if (!isAuthenticated || isChatRoute) return null

  return (
    <Link
      href="/chat"
      aria-label={t('chat')}
      title={t('chat')}
      className="fixed bottom-5 right-5 z-40 inline-flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_30px_rgba(21,45,25,0.3)] transition-transform hover:scale-105 hover:opacity-90 sm:bottom-6 sm:right-6"
    >
      <span
        className="absolute inset-0 animate-ping rounded-full bg-primary/60"
        aria-hidden
      />
      <MessageCircle className="relative size-6" aria-hidden />
    </Link>
  )
}
