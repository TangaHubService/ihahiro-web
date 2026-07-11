'use client'

import { Container } from '@/components/layout/Container'
import { useListings } from '@/hooks/useListings'
import { Link } from '@/i18n/navigation'
import { ChevronRight, MapPin } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export function HomeLiveMarketStrip() {
  const t = useTranslations('home')
  const tCommon = useTranslations('common')
  const { data } = useListings({
    status: 'PUBLISHED',
    limit: 5,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  const listings = data?.items ?? []

  if (listings.length === 0) return null

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
            {listings.map((listing, index) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className={`rounded-[1.1rem] bg-white px-4 py-4 shadow-sm ring-1 ring-[#e3eadf] transition-shadow hover:shadow-md xl:rounded-none xl:bg-transparent xl:shadow-none xl:ring-0 ${
                  index > 0 ? 'xl:border-l xl:border-[#dae4d6] xl:pl-6' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-[#e7f0e3]">
                    {listing.media?.[0]?.url ? (
                      <Image
                        src={listing.media[0].url}
                        alt={listing.product?.name ?? listing.title}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-sm font-semibold text-[#9aaa98]">
                        {listing.product?.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[0.98rem] font-semibold text-[#17311b]">
                      {listing.product?.name ?? listing.title}
                    </p>
                    <p className="mt-1 text-xs text-[#5f6a60]">
                      {listing.quantity} {tCommon('kg')}
                    </p>
                    <p className="mt-1 flex items-center gap-1 truncate text-xs text-[#7a857a]">
                      <MapPin className="size-3 shrink-0" aria-hidden />
                      {listing.location?.name ?? ''}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-primary">
                        {listing.price} RWF {tCommon('perKg')}
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
