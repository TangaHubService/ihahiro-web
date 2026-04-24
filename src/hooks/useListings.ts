'use client'

import { listingsApi, type ListingFilters } from '@/lib/api/listings'
import { queryKeys } from '@/lib/queryKeys'
import { useQuery } from '@tanstack/react-query'

export function useListings(filters: Partial<ListingFilters> = {}) {
  const normalizedFilters: ListingFilters = {
    q: filters.q ?? '',
    locationId: filters.locationId,
    productId: filters.productId,
    categoryId: filters.categoryId,
    sellerId: filters.sellerId,
    status: filters.status ?? 'PUBLISHED',
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    page: filters.page ?? 1,
    limit: filters.limit ?? 12,
    sortBy: filters.sortBy ?? 'createdAt',
    sortOrder: filters.sortOrder ?? 'desc',
  }

  return useQuery({
    queryKey: queryKeys.listings.list(normalizedFilters),
    queryFn: () => listingsApi.list(normalizedFilters),
  })
}

export function useListing(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.listings.detail(id) : queryKeys.listings.detail(''),
    queryFn: () => listingsApi.getById(id!),
    enabled: Boolean(id),
  })
}
