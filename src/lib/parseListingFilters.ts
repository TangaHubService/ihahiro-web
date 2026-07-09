import type { ListingFilters } from '@/lib/api/listings'

const SORT_TO_API: Record<string, { sortBy: string; sortOrder: 'asc' | 'desc' }> = {
  newest: { sortBy: 'createdAt', sortOrder: 'desc' },
  price_asc: { sortBy: 'price', sortOrder: 'asc' },
  price_desc: { sortBy: 'price', sortOrder: 'desc' },
}

function first(param: string | string[] | undefined): string | undefined {
  if (Array.isArray(param)) return param[0]
  return param
}

export function listingFiltersFromSearchParams(
  sp: Record<string, string | string[] | undefined>
): Partial<ListingFilters> {
  const q = first(sp.q)
  const categoryId = first(sp.categoryId)
  const locationId = first(sp.locationId)
  const minPriceRaw = first(sp.minPrice)
  const maxPriceRaw = first(sp.maxPrice)
  const sortRaw = first(sp.sort) ?? 'newest'
  const { sortBy, sortOrder } = SORT_TO_API[sortRaw] ?? SORT_TO_API.newest

  const pageRaw = first(sp.page)
  const page = pageRaw ? Math.max(1, Number(pageRaw) || 1) : 1

  return {
    q,
    categoryId,
    locationId,
    minPrice: minPriceRaw ? Number(minPriceRaw) : undefined,
    maxPrice: maxPriceRaw ? Number(maxPriceRaw) : undefined,
    sortBy,
    sortOrder,
    page,
  }
}
