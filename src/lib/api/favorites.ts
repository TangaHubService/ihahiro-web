import { apiClient, API_ENDPOINTS } from './client'
import type { Listing } from './listings'

export const favoritesApi = {
  list: async (): Promise<Listing[]> => {
    return apiClient.get(API_ENDPOINTS.FAVORITES.LIST)
  },

  toggle: async (listingId: string): Promise<{ favorited: boolean }> => {
    return apiClient.post(API_ENDPOINTS.FAVORITES.TOGGLE(listingId))
  },
}
