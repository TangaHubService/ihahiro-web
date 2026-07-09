import type { ListingFilters } from '@/lib/api/listings'

export const defaultAPIFilters: Partial<ListingFilters> = {
  status: 'PUBLISHED',
  page: 1,
  limit: 12,
}
