import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { ListingDetail } from '@/components/listings/ListingDetail'
import {
  fetchListingById,
  fetchRelatedListings,
  fetchSellerForListing,
} from '@/lib/api'
import type { ListingDetail as ApiListingDetail } from '@/lib/api/listings'
import type { Listing as LegacyListing, ProductNameKey, Seller } from '@/lib/types/listing'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ locale: string; id: string }> }

const PRODUCT_KEYWORDS: Record<ProductNameKey, string[]> = {
  potatoes: ['ibirayi', 'potato', 'potatoes'],
  beans: ['ibishyimbo', 'bean', 'beans'],
  maize: ['ibigori', 'maize', 'corn'],
  bananas: ['imbananira', 'banana', 'bananas', 'plantain'],
  tomatoes: ['inyanya', 'tomato', 'tomatoes'],
  cabbage: ['amashu', 'cabbage', 'kale'],
  cassava: ['imyumbati', 'cassava'],
  avocado: ['avoka', 'avocado'],
  rice: ['umuceri', 'rice'],
  sweetPotatoes: ['ibijumba', 'sweet potato', 'sweet potatoes'],
  onions: ['butunguru', 'onion', 'onions'],
  carrots: ['karoti', 'carrot', 'carrots'],
}

function normalizeProductName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function resolveProductKey(name?: string): ProductNameKey {
  const normalized = name ? normalizeProductName(name) : ''

  const entry = (Object.entries(PRODUCT_KEYWORDS) as Array<
    [ProductNameKey, string[]]
  >).find(([, keywords]) =>
    keywords.some((keyword) => normalized.includes(keyword))
  )

  return entry?.[0] ?? 'potatoes'
}

function formatPostedDate(value?: string | null) {
  if (!value) {
    return 'N/A'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'N/A'
  }

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function toLegacyListing(listing: ApiListingDetail): LegacyListing {
  const displayName =
    `${listing.seller.firstName} ${listing.seller.lastName}`.trim() ||
    listing.title
  const imageUrl = listing.media[0]?.url ?? '/hero.png'

  return {
    id: listing.id,
    productKey: resolveProductKey(listing.product?.name ?? listing.title),
    category: 'vegetables',
    quantityKg: listing.quantity,
    pricePerKg: listing.price,
    currency: 'RWF',
    locationLabel: listing.location?.name ?? 'Rwanda',
    province: listing.location?.name ?? 'Rwanda',
    district: listing.location?.name ?? 'Rwanda',
    description: listing.description,
    variety: listing.product?.name ?? listing.title,
    qualityLabel: 'Standard',
    deliveryNote: 'Contact seller for delivery arrangements.',
    postedAt: formatPostedDate(listing.publishedAt ?? listing.createdAt),
    isNew: listing.isActive,
    imageUrl,
    galleryUrls: listing.media.map((item) => item.url),
    seller: {
      id: listing.seller.id,
      displayName,
      avatarUrl: '/logo.png',
    },
  }
}

function toLegacySeller(listing: ApiListingDetail): Seller {
  const displayName =
    `${listing.seller.firstName} ${listing.seller.lastName}`.trim() ||
    'Ihahiro Seller'
  const phone = listing.seller.phone ?? '+250 788 000 000'

  return {
    id: listing.seller.id,
    displayName,
    locationLabel: listing.location?.name ?? 'Rwanda',
    rating: 4.8,
    reviewCount: Math.max(listing.viewCount, 12),
    memberSinceLabel: formatPostedDate(listing.createdAt),
    phone,
    whatsapp: phone,
    avatarUrl: '/logo.png',
  }
}

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

  const [, related] = await Promise.all([
    fetchSellerForListing(id),
    fetchRelatedListings(id, 4),
  ])

  const detailListing = toLegacyListing(listing)
  const detailSeller = toLegacySeller(listing)

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8f5]">
      <Header />
      <main className="flex-1">
        <ListingDetail
          listing={detailListing}
          seller={detailSeller}
          related={related}
        />
      </main>
      <Footer />
    </div>
  )
}
