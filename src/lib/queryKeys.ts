import type { ListingFilters } from '@/lib/api/listings'
import type { Category } from '@/lib/api/products'

export const queryKeys = {
  auth: {
    user: ['auth', 'user'] as const,
  },
  listings: {
    all: ['listings'] as const,
    lists: () => ['listings', 'list'] as const,
    list: (filters: ListingFilters) => ['listings', 'list', filters] as const,
    detail: (id: string) => ['listings', 'detail', id] as const,
  },
  categories: {
    all: ['categories'] as const,
    lists: () => ['categories', 'list'] as const,
    list: (filters: { parentId?: string }) => ['categories', 'list', filters] as const,
  },
} as const
