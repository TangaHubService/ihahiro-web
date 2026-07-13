'use client'

import { useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { moderationApi } from '@/lib/api/moderation'
import { queryKeys } from '@/lib/queryKeys'

export type ModerationTab = 'listings' | 'categories' | 'products'

export type ModerationStatsCardsProps = {
  onSelectTab?: (tab: ModerationTab) => void
  activeTab?: ModerationTab
}

export function ModerationStatsCards({ onSelectTab, activeTab }: ModerationStatsCardsProps) {
  const t = useTranslations('moderation')
  const { data, isPending } = useQuery({
    queryKey: queryKeys.moderation.stats,
    queryFn: moderationApi.stats,
  })

  if (isPending) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  if (!data) return null

  const cards: { label: string; value: number; tab?: ModerationTab }[] = [
    { label: t('statPendingListings'), value: data.listings.pending, tab: 'listings' },
    { label: t('statPublishedListings'), value: data.listings.published },
    { label: t('statRejectedListings'), value: data.listings.rejected },
    { label: t('statArchivedListings'), value: data.listings.archived },
    { label: t('statPendingCategories'), value: data.pendingCategories, tab: 'categories' },
    { label: t('statPendingProducts'), value: data.pendingProducts, tab: 'products' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => {
        const isClickable = Boolean(card.tab && onSelectTab)
        const isActive = Boolean(card.tab && card.tab === activeTab)

        return (
          <Card
            key={card.label}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            aria-pressed={isClickable ? isActive : undefined}
            onClick={isClickable ? () => onSelectTab?.(card.tab as ModerationTab) : undefined}
            onKeyDown={
              isClickable
                ? (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onSelectTab?.(card.tab as ModerationTab)
                    }
                  }
                : undefined
            }
            className={`border-[#e1e7df] p-4 text-left transition-colors ${
              isClickable ? 'cursor-pointer hover:border-primary hover:bg-[#f5f8f3]' : ''
            } ${isActive ? 'border-primary bg-[#f0f6ee]' : ''}`}
          >
            <p className="text-2xl font-black text-primary">{card.value}</p>
            <p className="mt-1 text-xs font-medium text-[#5f6c61]">{card.label}</p>
          </Card>
        )
      })}
    </div>
  )
}
