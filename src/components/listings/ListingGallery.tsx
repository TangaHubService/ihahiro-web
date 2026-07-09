'use client'

import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/hooks/useAuth'
import { useFavorites } from '@/hooks/useFavorites'
import { useRouter } from '@/i18n/navigation'
import type { Listing } from '@/lib/api/listings'
import { UNOPTIMIZE_MEDIA } from '@/lib/utils/mediaImageProps'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const FALLBACK_IMAGE = '/hero.png'
const NEW_LISTING_WINDOW_MS = 3 * 24 * 60 * 60 * 1000

function isRecentlyPosted(listing: Listing) {
  const postedAt = listing.publishedAt ?? listing.createdAt
  if (!postedAt) return false
  const postedTime = new Date(postedAt).getTime()
  if (Number.isNaN(postedTime)) return false
  return Date.now() - postedTime <= NEW_LISTING_WINDOW_MS
}

export function ListingGallery({ listing }: { listing: Listing }) {
  const tCommon = useTranslations('common')
  const t = useTranslations('listingDetail')
  const { isAuthenticated } = useAuth()
  const { isFavorited, toggle } = useFavorites()
  const router = useRouter()
  const favorited = isFavorited(listing.id)
  const baseUrls = (listing.media ?? []).map((item) => item.url)
  const urls = baseUrls.length > 0 ? [...baseUrls] : [FALLBACK_IMAGE]
  while (urls.length < 4 && baseUrls.length > 0) {
    urls.push(baseUrls[urls.length % baseUrls.length])
  }
  const [active, setActive] = useState(0)
  const main = urls[active] ?? FALLBACK_IMAGE

  function move(delta: number) {
    setActive((current) => (current + delta + urls.length) % urls.length)
  }

  function handleToggleFavorite() {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/listings/${listing.id}`)}`)
      return
    }
    toggle(listing.id)
  }

  return (
    <div>
      <div className="relative aspect-[1.52/1] overflow-hidden rounded-xl bg-surface">
        <Image
          src={main}
          alt=""
          fill
          preload
          unoptimized={UNOPTIMIZE_MEDIA}
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 45vw"
        />
        {isRecentlyPosted(listing) ? (
          <span className="absolute left-4 top-4 z-10">
            <Badge className="rounded-md bg-primary px-4 py-2 font-bold text-white">
              {tCommon('new')}
            </Badge>
          </span>
        ) : null}
        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-pressed={favorited}
          className="absolute right-4 top-4 flex size-12 items-center justify-center rounded-full bg-white text-primary shadow-sm transition hover:bg-[#eef4ec]"
          aria-label={t('saveListing')}
        >
          <Heart className={favorited ? 'size-6 fill-primary' : 'size-6'} aria-hidden />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-[3rem_minmax(0,1fr)_3rem] items-center gap-3">
        <button
          type="button"
          onClick={() => move(-1)}
          className="flex size-11 items-center justify-center rounded-md border border-[#dfe5df] bg-white text-primary"
          aria-label={t('previousImage')}
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>

        <div className="grid grid-cols-4 gap-3">
          {urls.slice(0, 4).map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-16 overflow-hidden rounded-md border-2 bg-surface sm:h-20 ${
                active === i ? 'border-primary' : 'border-transparent'
              }`}
            >
              <Image
                src={url}
                alt=""
                fill
                unoptimized={UNOPTIMIZE_MEDIA}
                className="object-cover"
                sizes="140px"
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => move(1)}
          className="flex size-11 items-center justify-center rounded-md border border-[#dfe5df] bg-white text-primary"
          aria-label={t('nextImage')}
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  )
}
