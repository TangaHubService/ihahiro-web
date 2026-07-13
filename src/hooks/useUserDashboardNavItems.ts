'use client'

import type { DashboardNavItem } from '@/components/layout/DashboardShell'
import { useAuth } from '@/hooks/useAuth'
import type { AuthUser } from '@/lib/api/auth'
import { MessageCircle, Plus, ShieldCheck, User } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function useUserDashboardNavItems(): DashboardNavItem[] {
  const t = useTranslations('nav')
  const { user, isLoading } = useAuth()
  const typedUser = user as AuthUser | undefined
  // Gated on !isLoading: useAuth's cached user is read from localStorage
  // synchronously on the client but is unavailable during SSR, so including
  // this item based on role before isLoading settles would make the client's
  // first render diverge from the server-rendered HTML (hydration mismatch).
  const isModerator =
    !isLoading &&
    (typedUser?.role === 'admin' || typedUser?.role === 'moderator')

  const items: DashboardNavItem[] = [
    {
      kind: 'link',
      key: 'profile',
      label: t('profile'),
      icon: User,
      href: '/profile',
    },
    {
      kind: 'link',
      key: 'chat',
      label: t('chat'),
      icon: MessageCircle,
      href: '/chat',
    },
    {
      kind: 'link',
      key: 'postHarvest',
      label: t('postHarvest'),
      icon: Plus,
      href: '/post-harvest',
    },
  ]

  if (isModerator) {
    items.push({
      kind: 'link',
      key: 'moderation',
      label: t('moderation'),
      icon: ShieldCheck,
      href: '/moderation',
    })
  }

  return items
}
