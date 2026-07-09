'use client'

import { useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { moderationApi } from '@/lib/api/moderation'
import { queryKeys } from '@/lib/queryKeys'

export function ModerationStatsCards() {
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

  const cards = [
    { label: t('statPendingListings'), value: data.listings.pending },
    { label: t('statPublishedListings'), value: data.listings.published },
    { label: t('statRejectedListings'), value: data.listings.rejected },
    { label: t('statArchivedListings'), value: data.listings.archived },
    { label: t('statPendingCategories'), value: data.pendingCategories },
    { label: t('statPendingProducts'), value: data.pendingProducts },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.label} className="border-[#e1e7df] p-4">
          <p className="text-2xl font-black text-primary">{card.value}</p>
          <p className="mt-1 text-xs font-medium text-[#5f6c61]">{card.label}</p>
        </Card>
      ))}
    </div>
  )
}
