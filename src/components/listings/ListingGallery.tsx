'use client'

import { Badge } from '@/components/ui/Badge'
import type { Listing } from '@/lib/types/listing'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export function ListingGallery({ listing }: { listing: Listing }) {
  const tCommon = useTranslations('common')
  const t = useTranslations('listingDetail')
  const baseUrls =
    listing.galleryUrls.length > 0 ? listing.galleryUrls : [listing.imageUrl]
  const urls = [...baseUrls]
  while (urls.length < 4) {
    urls.push(baseUrls[urls.length % baseUrls.length] ?? listing.imageUrl)
  }
  const [active, setActive] = useState(0)
  const main = urls[active] ?? listing.imageUrl

  function move(delta: number) {
    setActive((current) => (current + delta + urls.length) % urls.length)
  }

  return (
    <div>
      <div className="relative aspect-[1.52/1] overflow-hidden rounded-xl bg-surface">
        <Image
          src={main}
          alt=""
          fill
          preload
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 45vw"
        />
        {listing.isNew ? (
          <span className="absolute left-4 top-4 z-10">
            <Badge className="rounded-md bg-primary px-4 py-2 font-bold text-white">
              {tCommon('new')}
            </Badge>
          </span>
        ) : null}
        <button
          type="button"
          className="absolute right-4 top-4 flex size-12 items-center justify-center rounded-full bg-white text-primary shadow-sm"
          aria-label={t('saveListing')}
        >
          <Heart className="size-6" aria-hidden />
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
