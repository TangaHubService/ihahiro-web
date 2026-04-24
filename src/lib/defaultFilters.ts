import type { ListingFilters as APIFilters } from '@/lib/api/listings'
import type { ListingFilters as UIFilters } from '@/lib/types/listing'

export const defaultListingFilters: UIFilters = {
  q: '',
  location: '',
  category: 'all',
  sort: 'newest',
  page: 1,
  pageSize: 12,
}

export const defaultAPIFilters: Partial<APIFilters> = {
  status: 'PUBLISHED',
  page: 1,
  limit: 12,
}
