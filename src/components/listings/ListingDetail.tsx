import { ListingCard } from '@/components/features/ListingCard'
import { Container } from '@/components/layout/Container'
import { MessageSellerButton } from '@/components/chat/MessageSellerButton'
import { ListingGallery } from '@/components/listings/ListingGallery'
import { ReportListingButton } from '@/components/listings/ReportListingButton'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Link } from '@/i18n/navigation'
import type { Listing, ListingDetail as ApiListingDetail } from '@/lib/api/listings'
import { reviewsApi } from '@/lib/api/reviews'
import { getInitials } from '@/lib/utils/getInitials'
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Shield,
  ShieldCheck,
  Star,
  Tag,
} from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

export type ListingDetailProps = {
  listing: ApiListingDetail
  related: Listing[]
}

function formatDate(value?: string | null) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export async function ListingDetail({ listing, related }: ListingDetailProps) {
  const t = await getTranslations('listingDetail')
  const tCommon = await getTranslations('common')
  const tNav = await getTranslations('nav')

  const seller = listing.seller
  const title = listing.product?.name ?? listing.title
  const sellerName = [seller.firstName, seller.lastName].filter(Boolean).join(' ').trim() || tCommon('farmer')
  const contactPhone = listing.contactPhone ?? seller.phone
  const contactWhatsapp = listing.contactWhatsapp
  const wa = contactWhatsapp ? `https://wa.me/${contactWhatsapp.replace(/\D/g, '')}` : null
  const phoneHref = contactPhone ? `tel:${contactPhone.replace(/\s/g, '')}` : null
  const postedLabel = formatDate(listing.publishedAt ?? listing.createdAt) ?? 'N/A'
  const memberSinceLabel = formatDate(seller.createdAt) ?? 'N/A'
  const locationName = listing.location?.name ?? null
  const ancestors = listing.location?.ancestors ?? []
  const reviewStats = await reviewsApi.getUserStats(seller.id).catch(() => null)

  return (
    <Container className="py-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-medium text-[#5c665f]">
          {tNav('home')}
          <span className="mx-2 text-[#a8aea9]">/</span>
          {t('breadcrumbLabel')}
          <span className="mx-2 text-[#a8aea9]">/</span>
          <span className="font-bold text-primary">{title}</span>
        </p>
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {t('backToMarket')}
        </Link>
      </div>

      <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.78fr)_26rem] xl:items-start">
        <ListingGallery listing={listing} />

        <section className="min-w-0">
          <h1 className="text-[2.35rem] font-black leading-none tracking-[-0.04em] text-[#1d251f]">
            {title}
          </h1>
          {locationName ? (
            <p className="mt-4 flex items-center gap-2 text-[#475148]">
              <MapPin className="size-4 shrink-0" aria-hidden />
              {locationName}
            </p>
          ) : null}
          <p className="mt-5 text-[2rem] font-black text-primary">
            {listing.price} {tCommon('currency')} / {listing.unit?.shortName ?? tCommon('kg')}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-4 border-b border-[#dfe5df] pb-6">
            <div className="flex items-start gap-3">
              <Package className="mt-1 size-5 text-primary" aria-hidden />
              <div>
                <p className="text-sm text-[#5d665f]">{tCommon('available')}</p>
                <p className="mt-1 font-bold text-[#222b24]">
                  {listing.quantity} {listing.unit?.shortName ?? tCommon('kg')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-1 size-5 text-primary" aria-hidden />
              <div>
                <p className="text-sm text-[#5d665f]">{tCommon('postedOn')}</p>
                <p className="mt-1 font-bold text-[#222b24]">{postedLabel}</p>
              </div>
            </div>
            {listing.product?.category?.name ? (
              <div className="flex items-start gap-3">
                <Tag className="mt-1 size-5 text-primary" aria-hidden />
                <div>
                  <p className="text-sm text-[#5d665f]">{tCommon('category')}</p>
                  <p className="mt-1 font-bold text-[#222b24]">{listing.product.category.name}</p>
                </div>
              </div>
            ) : null}
          </div>

          <section className="mt-7">
            <h2 className="text-xl font-black text-[#18251a]">
              {tCommon('description')}
            </h2>
            <p className="mt-3 leading-8 text-[#485249]">
              {listing.description}
            </p>
          </section>

          {(listing.qualityGrade || ancestors.length > 0 || listing.deliveryNote) ? (
            <section className="mt-5 rounded-xl bg-[#eef4ec] p-5">
              <ul className="space-y-4 text-[#2f3b31]">
                {listing.qualityGrade ? (
                  <li className="flex items-start gap-3">
                    <BadgeCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span>
                      <strong>{t('quality')}:</strong> {listing.qualityGrade}
                    </span>
                  </li>
                ) : null}
                {ancestors.map((ancestor) => (
                  <li key={ancestor.id} className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span>
                      <strong className="capitalize">{ancestor.type}:</strong> {ancestor.name}
                    </span>
                  </li>
                ))}
                {listing.deliveryNote ? (
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span>
                      <strong>{t('delivery')}:</strong> {listing.deliveryNote}
                    </span>
                  </li>
                ) : null}
              </ul>
            </section>
          ) : null}
        </section>

        <aside className="space-y-5">
          <Card className="rounded-xl border-[#dfe5df] p-5 shadow-[0_16px_45px_rgba(21,45,25,0.05)]">
            <h2 className="text-xl font-black text-[#18251a]">
              {tCommon('seller')}
            </h2>
            <div className="mt-5 flex items-center gap-4">
              {seller.avatarUrl ? (
                <Image
                  src={seller.avatarUrl}
                  alt=""
                  width={88}
                  height={88}
                  className="size-24 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#edf7ea_0%,#dbead4_100%)] text-2xl font-black text-primary">
                  {getInitials(sellerName)}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xl font-black text-[#18251a]">
                    {sellerName}
                  </p>
                  <Badge className="bg-trust font-bold text-primary">
                    {tCommon('farmer')}
                  </Badge>
                </div>
                {seller.location?.name ? (
                  <p className="mt-2 flex items-center gap-2 text-[#4e594f]">
                    <MapPin className="size-4" aria-hidden />
                    {seller.location.name}
                  </p>
                ) : null}
                <p className="mt-3 flex items-center gap-2 text-[#4e594f]">
                  <Star className="size-4 fill-[#f4c542] text-[#f4c542]" />
                  {reviewStats && reviewStats.reviewCount > 0
                    ? `${reviewStats.averageRating.toFixed(1)} (${reviewStats.reviewCount} ${tCommon('reviews')})`
                    : t('noReviewsYet')}
                </p>
              </div>
            </div>
            <p className="mt-4 text-[#4e594f]">
              {tCommon('memberSince')}: {memberSinceLabel}
            </p>

            <div className="mt-7 flex flex-col gap-3">
              {phoneHref ? (
                <a href={phoneHref}>
                  <Button className="h-12 w-full gap-2 rounded-md text-base font-black">
                    <Phone className="size-5" aria-hidden />
                    {tCommon('call')}
                  </Button>
                </a>
              ) : null}
              {wa ? (
                <a href={wa} rel="noopener noreferrer" target="_blank">
                  <Button
                    variant="outline"
                    className="h-12 w-full gap-2 rounded-md border-primary bg-white text-base font-black text-primary"
                  >
                    <MessageCircle className="size-5" aria-hidden />
                    {tCommon('whatsapp')}
                  </Button>
                </a>
              ) : null}
              <MessageSellerButton sellerId={seller.id} listingId={listing.id} />
            </div>

            <div className="mt-7 rounded-xl bg-[#eef4ec] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-black text-primary">
                    {t('trustBuyerTitle')}
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm text-[#3f4b42]">
                    <li className="flex gap-2">
                      <ShieldCheck className="size-4 shrink-0 text-primary" />
                      {t('trustBuyerRealSeller')}
                    </li>
                    <li className="flex gap-2">
                      <ShieldCheck className="size-4 shrink-0 text-primary" />
                      {t('trustBuyerNoHiddenFees')}
                    </li>
                    <li className="flex gap-2">
                      <ShieldCheck className="size-4 shrink-0 text-primary" />
                      {t('trustBuyerVerified')}
                    </li>
                  </ul>
                </div>
                <Shield className="size-20 text-primary/20" strokeWidth={1.5} />
              </div>
            </div>
          </Card>
        </aside>
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_26rem]">
        <section>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black text-primary">
              {t('youMayLike')}
            </h2>
            <Link
              href="/listings"
              className="font-bold text-primary hover:underline"
            >
              {tCommon('viewAll')} -&gt;
            </Link>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        </section>

        <Card className="h-fit rounded-xl border-[#dfe5df] p-6">
          <h3 className="text-xl font-black text-primary">
            {t('reportTitle')}
          </h3>
          <p className="mt-4 text-[#4f5a52]">{t('reportQuestion')}</p>
          <ReportListingButton listingId={listing.id} />
        </Card>
      </div>
    </Container>
  )
}
