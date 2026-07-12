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
    mine: (filters: ListingFilters) => ['listings', 'mine', filters] as const,
  },
  categories: {
    all: ['categories'] as const,
    lists: () => ['categories', 'list'] as const,
    list: (filters: { parentId?: string }) => ['categories', 'list', filters] as const,
  },
  favorites: {
    all: ['favorites'] as const,
  },
  profile: {
    detail: ['profile'] as const,
  },
  chat: {
    threads: ['chat', 'threads'] as const,
    messages: (threadId: string) => ['chat', 'messages', threadId] as const,
  },
  moderation: {
    stats: ['moderation', 'stats'] as const,
    pendingListings: (page: number) => ['moderation', 'pending-listings', page] as const,
    pendingCategories: ['moderation', 'pending-categories'] as const,
    pendingProducts: ['moderation', 'pending-products'] as const,
  },
} as const
