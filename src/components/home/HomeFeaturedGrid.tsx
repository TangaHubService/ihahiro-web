'use client'

import { Container } from '@/components/layout/Container'
import { useListings } from '@/hooks/useListings'
import { Link } from '@/i18n/navigation'
import { ChevronRight, MapPin } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export function HomeFeaturedGrid() {
  const t = useTranslations('home')
  const tCommon = useTranslations('common')
  const { data, isPending } = useListings({
    status: 'PUBLISHED',
    limit: 6,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  const listings = data?.items ?? []

  if (listings.length === 0) return null

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
          {listings.map((listing, index) => (
            <article
              key={listing.id}
              className="overflow-hidden rounded-[1.05rem] border border-[#dfe7dc] bg-white shadow-[0_12px_24px_rgba(21,45,25,0.04)]"
            >
              <div className="relative aspect-[1.45/1] w-full overflow-hidden bg-[#eef4ea]">
                {listing.media?.[0]?.url ? (
                  <Image
                    src={listing.media[0].url}
                    alt={listing.product?.name ?? listing.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 16vw"
                    priority={index < 2 && !isPending}
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-[#9aaa98]">
                    {listing.product?.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="truncate text-[1.05rem] font-bold text-[#17311b]">
                  {listing.product?.name ?? listing.title}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-[#687269]">
                  <MapPin className="size-3.5 shrink-0" aria-hidden />
                  <span className="truncate">
                    {listing.location?.name ?? ''}
                  </span>
                </p>
                <p className="mt-4 text-[1.15rem] font-black text-primary">
                  {listing.price} RWF {tCommon('perKg')}
                </p>
                <Link
                  href={`/listings/${listing.id}`}
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
