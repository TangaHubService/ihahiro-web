'use client'

import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Link } from '@/i18n/navigation'
import type { Listing } from '@/lib/api/listings'
import { Heart, MapPin, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export type ListingCardProps = {
  listing: Listing
}

function getSellerName(listing: Listing) {
  return [listing.seller?.firstName, listing.seller?.lastName].filter(Boolean).join(' ').trim()
}

function getSellerInitials(name: string) {
  if (!name) return 'IH'

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function ListingCard({ listing }: ListingCardProps) {
  const tCommon = useTranslations('common')
  const sellerName = getSellerName(listing) || tCommon('farmer')
  const sellerInitials = getSellerInitials(sellerName)
  const price = new Intl.NumberFormat().format(listing.price)
  const quantity = new Intl.NumberFormat().format(listing.quantity)

  return (
    <Card className="group overflow-hidden rounded-[1.35rem] border-[#e4e9e3] bg-white shadow-[0_10px_28px_rgba(21,45,25,0.05)] card-hover">
      <Link
        href={`/listings/${listing.id}`}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="relative aspect-[1.5/1] w-full overflow-hidden bg-surface image-zoom">
          <Image
            src={listing.media?.[0]?.url ?? '/hero.png'}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/15 to-transparent" />

          {listing.isActive ? (
            <span className="absolute left-3 top-3">
              <Badge className="rounded-full border-0 bg-primary px-3 py-1 text-[0.72rem] font-bold text-white shadow-sm">
                {tCommon('new')}
              </Badge>
            </span>
          ) : null}

          <span className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-black/18 text-white backdrop-blur-md ring-1 ring-white/45">
            <Heart className="size-5" strokeWidth={2.2} aria-hidden />
          </span>
        </div>

        <div className="space-y-4 p-4">
          <div className="space-y-1.5">
            <h3 className="line-clamp-1 text-[1.15rem] font-bold tracking-[-0.02em] text-[#18251a]">
              {listing.product?.name ?? listing.title}
            </h3>
            <p className="flex items-center gap-1.5 text-[0.82rem] text-[#687369]">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              <span className="line-clamp-1">{listing.location?.name ?? '-'}</span>
            </p>
          </div>

          <div className="flex items-end justify-between gap-3">
            <p className="text-[1.15rem] font-black text-primary">
              {price} {tCommon('currency')} {tCommon('perKg')}
            </p>
            <p className="shrink-0 text-sm font-medium text-[#525d53]">
              {quantity} {listing.unit?.shortName ?? tCommon('kg')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-[#edf1ec] px-4 py-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f1f7ee_0%,#e1efda_100%)] text-xs font-black text-primary ring-1 ring-primary/10">
            {sellerInitials}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#2f3b31]">{sellerName}</p>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[#6a856d]">
              {tCommon('farmer')}
            </p>
          </div>

          <span className="flex size-10 items-center justify-center rounded-xl border border-primary/15 bg-[#f7fbf6] text-primary">
            <MessageCircle className="size-4" aria-hidden />
          </span>
        </div>
      </Link>
    </Card>
  )
}
