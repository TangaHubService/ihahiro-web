'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/Container'
import { ModerationStatsCards } from '@/components/moderation/ModerationStatsCards'
import { PendingCategoriesPanel } from '@/components/moderation/PendingCategoriesPanel'
import { PendingListingsPanel } from '@/components/moderation/PendingListingsPanel'
import { PendingProductsPanel } from '@/components/moderation/PendingProductsPanel'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils/cn'
import type { AuthUser } from '@/lib/api/auth'

type Tab = 'listings' | 'categories' | 'products'

export function ModerationDashboard() {
  const t = useTranslations('moderation')
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('listings')

  const typedUser = user as AuthUser | undefined
  const isModerator = typedUser?.role === 'admin' || typedUser?.role === 'moderator'

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

  if (isLoading || !isAuthenticated || !isModerator) {
    return (
      <Container className="py-10">
        <div className="h-64 animate-pulse rounded-2xl bg-[#f2f5f1]" />
      </Container>
    )
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'listings', label: t('tabListings') },
    { key: 'categories', label: t('tabCategories') },
    { key: 'products', label: t('tabProducts') },
  ]

  return (
    <Container className="py-8">
      <h1 className="text-[2.15rem] font-black leading-none tracking-[-0.04em] text-primary sm:text-[2.6rem]">
        {t('title')}
      </h1>
      <p className="mt-3 max-w-2xl text-[#5f6c61]">{t('subtitle')}</p>

      <div className="mt-6">
        <ModerationStatsCards />
      </div>

      <div className="mt-8 inline-flex rounded-xl border border-[#e1e7df] bg-white p-1">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-bold transition-colors',
              tab === key ? 'bg-primary text-primary-foreground' : 'text-[#5f6c61] hover:text-primary'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === 'listings' ? <PendingListingsPanel /> : null}
        {tab === 'categories' ? <PendingCategoriesPanel /> : null}
        {tab === 'products' ? <PendingProductsPanel /> : null}
      </div>
    </Container>
  )
}
