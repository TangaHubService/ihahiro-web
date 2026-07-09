import { apiClient, API_ENDPOINTS } from './client'

export interface PendingListing {
  id: string
  title: string
  price: number
  createdAt: string
  seller: { id: string; firstName: string; lastName: string } | null
  product: { id: string; name: string } | null
}

export interface PaginatedPendingListings {
  items: PendingListing[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ModerationStats {
  listings: {
    pending: number
    published: number
    rejected: number
    archived: number
  }
  pendingCategories: number
  pendingProducts: number
}

export interface PendingCategory {
  id: string
  name: string
  description: string | null
  parentId: string | null
  createdAt: string
}

export interface PendingProduct {
  id: string
  name: string
  description: string | null
  categoryId: string
  createdAt: string
}

export const moderationApi = {
  pendingListings: async (page = 1, limit = 12): Promise<PaginatedPendingListings> => {
    return apiClient.get(API_ENDPOINTS.MODERATION.PENDING, {
      page: String(page),
      limit: String(limit),
    })
  },

  stats: async (): Promise<ModerationStats> => {
    return apiClient.get(API_ENDPOINTS.MODERATION.STATS)
  },

  approveListing: async (id: string) => {
    return apiClient.post(API_ENDPOINTS.MODERATION.APPROVE(id))
  },

  rejectListing: async (id: string, reason: string) => {
    return apiClient.post(API_ENDPOINTS.MODERATION.REJECT(id), { reason })
  },

  pendingCategories: async (): Promise<PendingCategory[]> => {
    return apiClient.get(API_ENDPOINTS.MODERATION.CATEGORIES_PENDING)
  },

  approveCategory: async (id: string) => {
    return apiClient.post(API_ENDPOINTS.MODERATION.CATEGORY_APPROVE(id))
  },

  pendingProducts: async (): Promise<PendingProduct[]> => {
    return apiClient.get(API_ENDPOINTS.MODERATION.PRODUCTS_PENDING)
  },

  approveProduct: async (id: string) => {
    return apiClient.post(API_ENDPOINTS.MODERATION.PRODUCT_APPROVE(id))
  },
}
