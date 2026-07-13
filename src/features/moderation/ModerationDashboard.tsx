'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  DashboardShell,
  type DashboardNavItem,
} from '@/components/layout/DashboardShell'
import { ModerationStatsCards } from '@/components/moderation/ModerationStatsCards'
import { PendingCategoriesPanel } from '@/components/moderation/PendingCategoriesPanel'
import { PendingListingsPanel } from '@/components/moderation/PendingListingsPanel'
import { PendingProductsPanel } from '@/components/moderation/PendingProductsPanel'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from '@/i18n/navigation'
import type { AuthUser } from '@/lib/api/auth'
import { ClipboardList, Package, Tags } from 'lucide-react'

type Tab = 'listings' | 'categories' | 'products'

export function ModerationDashboard() {
  const t = useTranslations('moderation')
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('listings')

  const typedUser = user as AuthUser | undefined
  const isModerator =
    typedUser?.role === 'admin' || typedUser?.role === 'moderator'

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      router.replace('/login?redirect=%2Fmoderation')
      return
    }
    if (!isModerator) {
      router.replace('/')
    }
  }, [isLoading, isAuthenticated, isModerator, router])

  const navItems: DashboardNavItem[] = [
    {
      kind: 'button',
      key: 'listings',
      label: t('tabListings'),
      icon: ClipboardList,
      active: tab === 'listings',
      onClick: () => setTab('listings'),
    },
    {
      kind: 'button',
      key: 'categories',
      label: t('tabCategories'),
      icon: Tags,
      active: tab === 'categories',
      onClick: () => setTab('categories'),
    },
    {
      kind: 'button',
      key: 'products',
      label: t('tabProducts'),
      icon: Package,
      active: tab === 'products',
      onClick: () => setTab('products'),
    },
  ]

  if (isLoading || !isAuthenticated || !isModerator) {
    return (
      <DashboardShell title={t('title')} navItems={navItems}>
        <div className="h-64 animate-pulse rounded-2xl bg-[#f2f5f1]" />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title={t('title')} navItems={navItems}>
      <p className="max-w-2xl text-[#5f6c61]">{t('subtitle')}</p>

      <div className="mt-6">
        <ModerationStatsCards />
      </div>

      <div className="mt-6">
        {tab === 'listings' ? <PendingListingsPanel /> : null}
        {tab === 'categories' ? <PendingCategoriesPanel /> : null}
        {tab === 'products' ? <PendingProductsPanel /> : null}
      </div>
    </DashboardShell>
  )
}
