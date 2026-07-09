import { apiClient, API_ENDPOINTS } from './client'

export interface ReviewStats {
  averageRating: number
  reviewCount: number
}

export interface Review {
  id: string
  rating: number
  comment: string | null
  reviewer: { id: string; firstName: string; lastName: string }
  listingId: string | null
  createdAt: string
}

export interface CreateReviewInput {
  userId: string
  listingId?: string
  rating: number
  comment?: string
}

export const reviewsApi = {
  getUserStats: async (userId: string): Promise<ReviewStats> => {
    return apiClient.get(API_ENDPOINTS.REVIEWS.USER_STATS(userId))
  },

  listForUser: async (userId: string): Promise<Review[]> => {
    const res = await apiClient.get<{ items: Review[] } | Review[]>(API_ENDPOINTS.REVIEWS.USER(userId))
    return Array.isArray(res) ? res : res.items
  },

  create: async (data: CreateReviewInput): Promise<Review> => {
    return apiClient.post(API_ENDPOINTS.REVIEWS.LIST, data)
  },
}
