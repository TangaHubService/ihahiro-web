'use client'

import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { Link } from '@/i18n/navigation'
import { useMyListings } from '@/hooks/useListings'
import type { Listing } from '@/lib/api/listings'
import { Plus } from 'lucide-react'

const STATUS_STYLES: Record<Listing['status'], string> = {
  DRAFT: 'bg-[#f1f3ef] text-[#556157]',
  PENDING_REVIEW: 'bg-[#fef6e3] text-[#9a6b0c]',
  PUBLISHED: 'bg-[#eaf7e6] text-primary',
  REJECTED: 'bg-[#fdecec] text-[#b3352c]',
  ARCHIVED: 'bg-[#f1f3ef] text-[#556157]',
}

const STATUS_KEYS: Record<Listing['status'], string> = {
  DRAFT: 'statusDraft',
  PENDING_REVIEW: 'statusPendingReview',
  PUBLISHED: 'statusPublished',
  REJECTED: 'statusRejected',
  ARCHIVED: 'statusArchived',
}

export function MyListingsSection() {
  const t = useTranslations('profile')
  const tListings = useTranslations('listings')
  const tCommon = useTranslations('common')
  const { data, isPending, isError } = useMyListings()

  const listings = data?.items ?? []

  return (
    <Card className="rounded-[1.7rem] border-[#e1e7df] p-5 shadow-[0_14px_40px_rgba(21,45,25,0.04)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[1.15rem] font-black text-[#18251a]">{t('myListingsTitle')}</h2>
        <Link href="/post-harvest">
          <Button variant="ghost" className="h-9 gap-1.5 rounded-lg px-3 text-xs font-bold">
            <Plus className="size-3.5" aria-hidden />
            {tListings('ctaSellButton')}
          </Button>
        </Link>
      </div>

      <div className="mt-4">
        {isPending ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-sm text-accent">{t('myListingsError')}</p>
        ) : listings.length === 0 ? (
          <EmptyState
            className="border-none bg-transparent p-0 shadow-none"
            title={t('myListingsEmpty')}
            description={tListings('ctaSellBody')}
          />
        ) : (
          <ul className="divide-y divide-[#eaefe8]">
            {listings.map((listing) => (
              <li key={listing.id}>
                <Link
                  href={`/listings/${listing.id}`}
                  className="flex items-center gap-3 py-3 transition-colors hover:bg-[#f5f8f3]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-[#18251a]">
                      {listing.product?.name ?? listing.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-[#7c877e]">
                      {listing.price} {tCommon('currency')} {tCommon('perKg')}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLES[listing.status]}`}
                  >
                    {t(STATUS_KEYS[listing.status])}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}
