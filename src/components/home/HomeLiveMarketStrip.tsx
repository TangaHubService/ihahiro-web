'use client'

import {
  HOME_LIVE_PRODUCT_ORDER,
  getHomeProductVisual,
  type HomeCatalogKey,
} from '@/components/home/homeMarketplaceCatalog'
import { Container } from '@/components/layout/Container'
import { useListings } from '@/hooks/useListings'
import { Link } from '@/i18n/navigation'
import { ChevronRight, MapPin } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

type HomeLiveItem = {
  id: string
  href: string
  image: string
  location: string
  name: string
  price: number
  quantity: number
}

export function HomeLiveMarketStrip() {
  const t = useTranslations('home')
  const tCommon = useTranslations('common')
  const tProducts = useTranslations('products')
  const { data, isError } = useListings({
    status: 'PUBLISHED',
    limit: 5,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  const sampleItems: HomeLiveItem[] = HOME_LIVE_PRODUCT_ORDER.map((key) => {
    const visual = getHomeProductVisual(key)

    return {
      id: key,
      href: '/listings',
      image: visual.image,
      location: visual.location,
      name: tProducts(key as HomeCatalogKey),
      price: visual.price,
      quantity: visual.quantity,
    }
  })

  const items: HomeLiveItem[] =
    data?.items?.length && !isError
      ? data.items.slice(0, 5).map((listing, index) => {
          const visual = getHomeProductVisual(
            listing.product?.name ?? listing.title,
            index
          )

          return {
            id: listing.id,
            href: `/listings/${listing.id}`,
            image: visual.image,
            location: listing.location?.name ?? visual.location,
            name: listing.product?.name ?? listing.title,
            price: listing.price || visual.price,
            quantity: listing.quantity || visual.quantity,
          }
        })
      : sampleItems

  return (
    <section className="bg-white py-8 md:py-10">
      <Container>
        <div className="rounded-[1.75rem] border border-[#dce6d7] bg-[#f7faf3] px-5 py-6 shadow-[0_14px_28px_rgba(21,45,25,0.03)] md:px-6">
          <div className="relative">
            <h2 className="text-center text-[2rem] font-black leading-tight tracking-[-0.04em] text-[#173b1b] sm:text-[2.35rem]">
              {t('liveTitle')}
            </h2>
            <Link
              href="/listings"
              className="group mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline md:absolute md:right-0 md:top-1 md:mt-0"
            >
              {tCommon('viewAll')}
              <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5 xl:gap-0">
            {items.map((item, index) => (
              <Link
                key={item.id}
                href={item.href}
                className={`rounded-[1.1rem] bg-white px-4 py-4 shadow-sm ring-1 ring-[#e3eadf] transition-shadow hover:shadow-md xl:rounded-none xl:bg-transparent xl:shadow-none xl:ring-0 ${
                  index > 0 ? 'xl:border-l xl:border-[#dae4d6] xl:pl-6' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-[#e7f0e3]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[0.98rem] font-semibold text-[#17311b]">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-[#5f6a60]">
                      {item.quantity} {tCommon('kg')}
                    </p>
                    <p className="mt-1 flex items-center gap-1 truncate text-xs text-[#7a857a]">
                      <MapPin className="size-3 shrink-0" aria-hidden />
                      {item.location}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-primary">
                        {item.price} RWF {tCommon('perKg')}
                      </p>
                      <span className="rounded-full bg-[#e8f3e3] px-2 py-1 text-[0.65rem] font-semibold text-primary">
                        {tCommon('new')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
