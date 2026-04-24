'use client'

import {
  HOME_PRODUCT_ORDER,
  getHomeProductVisual,
  type HomeCatalogKey,
} from '@/components/home/homeMarketplaceCatalog'
import { Container } from '@/components/layout/Container'
import { useListings } from '@/hooks/useListings'
import { Link } from '@/i18n/navigation'
import { ChevronRight, MapPin } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

type HomeFeaturedCard = {
  id: string
  href: string
  image: string
  location: string
  name: string
  price: number
}

export function HomeFeaturedGrid() {
  const t = useTranslations('home')
  const tCommon = useTranslations('common')
  const tProducts = useTranslations('products')
  const { data, isPending, isError } = useListings({
    status: 'PUBLISHED',
    limit: 6,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  const sampleCards: HomeFeaturedCard[] = HOME_PRODUCT_ORDER.map((key) => {
    const visual = getHomeProductVisual(key)

    return {
      id: key,
      href: '/listings',
      image: visual.image,
      location: visual.location,
      name: tProducts(key as HomeCatalogKey),
      price: visual.price,
    }
  })

  const cards: HomeFeaturedCard[] =
    data?.items?.length && !isError
      ? data.items.slice(0, 6).map((listing, index) => {
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
          }
        })
      : sampleCards

  return (
    <section className="bg-white py-12 md:py-14">
      <Container>
        <div className="relative">
          <h2 className="text-center text-[2rem] font-black leading-tight tracking-[-0.04em] text-[#173b1b] sm:text-[2.35rem]">
            {t('featuredTitle')}
          </h2>
          <Link
            href="/listings"
            className="group mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline md:absolute md:right-0 md:top-1 md:mt-0"
          >
            {tCommon('viewAll')}
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {cards.map((card, index) => (
            <article
              key={card.id}
              className="overflow-hidden rounded-[1.05rem] border border-[#dfe7dc] bg-white shadow-[0_12px_24px_rgba(21,45,25,0.04)]"
            >
              <div className="relative aspect-[1.45/1] w-full overflow-hidden bg-[#eef4ea]">
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 16vw"
                  priority={index < 2 && !isPending}
                />
              </div>
              <div className="p-4">
                <h3 className="truncate text-[1.05rem] font-bold text-[#17311b]">
                  {card.name}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-[#687269]">
                  <MapPin className="size-3.5 shrink-0" aria-hidden />
                  <span className="truncate">{card.location}</span>
                </p>
                <p className="mt-4 text-[1.15rem] font-black text-primary">
                  {card.price} RWF {tCommon('perKg')}
                </p>
                <Link
                  href={card.href}
                  className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-[#14671a]"
                >
                  {tCommon('view')}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
