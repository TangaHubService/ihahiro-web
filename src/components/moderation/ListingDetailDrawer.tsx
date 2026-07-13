'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { Skeleton } from '@/components/ui/Skeleton'
import { useListing } from '@/hooks/useListings'
import { getInitials } from '@/lib/utils/getInitials'
import {
  BadgeCheck,
  CalendarDays,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Tag,
} from 'lucide-react'

const FALLBACK_IMAGE = '/hero.png'

function formatDate(value?: string | null) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export type ListingDetailDrawerProps = {
  listingId: string | null
  onClose: () => void
  onApprove: (id: string) => void
  onReject: (listing: { id: string; title: string }) => void
  isApproving: boolean
}

export function ListingDetailDrawer({
  listingId,
  onClose,
  onApprove,
  onReject,
  isApproving,
}: ListingDetailDrawerProps) {
  const t = useTranslations('moderation')
  const tListingDetail = useTranslations('listingDetail')
  const tCommon = useTranslations('common')
  const [activePhoto, setActivePhoto] = useState(0)

  const {
    data: listing,
    isPending,
    isError,
  } = useListing(listingId ?? undefined)

  const photos = listing?.media?.length ? listing.media : []
  const mainPhoto = photos[activePhoto]?.url ?? FALLBACK_IMAGE
  const sellerName = listing
    ? [listing.seller.firstName, listing.seller.lastName]
        .filter(Boolean)
        .join(' ')
        .trim() || tCommon('farmer')
    : ''
  const ancestors = listing?.location?.ancestors ?? []

  return (
    <Drawer
      open={Boolean(listingId)}
      title={
        listing?.product?.name ?? listing?.title ?? t('listingDetailsTitle')
      }
      onClose={onClose}
      footer={
        listing ? (
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="h-11 flex-1 rounded-xl border-[#dfe5df] text-sm font-bold text-accent hover:bg-[#fff6f4]"
              onClick={() => onReject({ id: listing.id, title: listing.title })}
            >
              {t('reject')}
            </Button>
            <Button
              className="h-11 flex-1 rounded-xl text-sm font-bold"
              disabled={isApproving}
              onClick={() => onApprove(listing.id)}
            >
              {isApproving ? tCommon('loading') : t('approve')}
            </Button>
          </div>
        ) : undefined
      }
    >
      {isPending ? (
        <div className="space-y-4">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : isError || !listing ? (
        <p className="text-sm text-accent">{t('loadError')}</p>
      ) : (
        <div className="space-y-6">
          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#eef4ea]">
              <Image
                src={mainPhoto}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            {photos.length > 1 ? (
              <div className="mt-2 flex gap-2 overflow-x-auto">
                {photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setActivePhoto(index)}
                    className={`relative size-14 shrink-0 overflow-hidden rounded-lg ring-2 transition ${
                      index === activePhoto
                        ? 'ring-primary'
                        : 'ring-transparent'
                    }`}
                  >
                    <Image
                      src={photo.url}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <h3 className="text-lg font-black text-[#18251a]">
              {listing.product?.name ?? listing.title}
            </h3>
            <p className="mt-1 text-2xl font-black text-primary">
              {listing.price} {tCommon('currency')} /{' '}
              {listing.unit?.shortName ?? tCommon('kg')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-y border-[#eaefe8] py-4">
            <div className="flex items-start gap-2.5">
              <Package
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden
              />
              <div>
                <p className="text-xs text-[#5d665f]">{tCommon('available')}</p>
                <p className="mt-0.5 font-bold text-[#222b24]">
                  {listing.quantity} {listing.unit?.shortName ?? tCommon('kg')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CalendarDays
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden
              />
              <div>
                <p className="text-xs text-[#5d665f]">{tCommon('postedOn')}</p>
                <p className="mt-0.5 font-bold text-[#222b24]">
                  {formatDate(listing.createdAt) ?? '—'}
                </p>
              </div>
            </div>
            {listing.product?.category?.name ? (
              <div className="flex items-start gap-2.5">
                <Tag
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden
                />
                <div>
                  <p className="text-xs text-[#5d665f]">
                    {tCommon('category')}
                  </p>
                  <p className="mt-0.5 font-bold text-[#222b24]">
                    {listing.product.category.name}
                  </p>
                </div>
              </div>
            ) : null}
            {listing.location?.name ? (
              <div className="flex items-start gap-2.5">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden
                />
                <div>
                  <p className="text-xs text-[#5d665f]">{t('locationLabel')}</p>
                  <p className="mt-0.5 font-bold text-[#222b24]">
                    {listing.location.name}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#18251a]">
              {tCommon('description')}
            </h4>
            <p className="mt-2 text-sm leading-6 text-[#485249]">
              {listing.description}
            </p>
          </div>

          {listing.qualityGrade ||
          ancestors.length > 0 ||
          listing.deliveryNote ? (
            <div className="rounded-xl bg-[#eef4ec] p-4">
              <ul className="space-y-3 text-sm text-[#2f3b31]">
                {listing.qualityGrade ? (
                  <li className="flex items-start gap-2.5">
                    <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>
                      <strong>{tListingDetail('quality')}:</strong>{' '}
                      {listing.qualityGrade}
                    </span>
                  </li>
                ) : null}
                {ancestors.map((ancestor) => (
                  <li key={ancestor.id} className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>
                      <strong className="capitalize">{ancestor.type}:</strong>{' '}
                      {ancestor.name}
                    </span>
                  </li>
                ))}
                {listing.deliveryNote ? (
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>
                      <strong>{tListingDetail('delivery')}:</strong>{' '}
                      {listing.deliveryNote}
                    </span>
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}

          <div className="rounded-xl border border-[#e6ebe4] p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#edf7ea_0%,#dbead4_100%)] text-sm font-black text-primary">
                {getInitials(sellerName)}
              </span>
              <div className="min-w-0">
                <p className="truncate font-bold text-[#18251a]">
                  {sellerName}
                </p>
                <p className="text-xs text-[#7a857a]">
                  {tCommon('memberSince')}:{' '}
                  {formatDate(listing.seller.createdAt) ?? '—'}
                </p>
              </div>
            </div>
            {listing.contactPhone || listing.seller.phone ? (
              <p className="mt-3 flex items-center gap-2 text-sm text-[#3f4b42]">
                <Phone className="size-4 shrink-0 text-primary" aria-hidden />
                {listing.contactPhone ?? listing.seller.phone}
              </p>
            ) : null}
          </div>
        </div>
      )}
    </Drawer>
  )
}
