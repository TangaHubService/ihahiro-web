import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { ListingDetail } from '@/components/listings/ListingDetail'
import { fetchListingById, fetchRelatedListings } from '@/lib/api'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ locale: string; id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params
  const listing = await fetchListingById(id)
  if (!listing) {
    return {}
  }
  const t = await getTranslations({ locale, namespace: 'meta' })
  const name = listing.product?.name ?? listing.title
  return {
    title: t('listingTitle', { name }),
    description: listing.description.slice(0, 160),
  }
}

export default async function ListingPage({ params }: Props) {
  const { id } = await params
  const listing = await fetchListingById(id)
  if (!listing) {
    notFound()
  }

  const related = await fetchRelatedListings(id, 4)

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8f5]">
      <Header />
      <main className="flex-1">
        <ListingDetail listing={listing} related={related} />
      </main>
      <Footer />
    </div>
  )
}
