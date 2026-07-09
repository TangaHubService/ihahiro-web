import { apiClient, API_ENDPOINTS } from './client'

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  whatsapp: string | null
  avatarUrl: string | null
  isBuyer: boolean
  isSeller: boolean
  isVerified: boolean
  createdAt: string
  location: { id: string; name: string } | null
}

export interface UpdateProfileInput {
  firstName?: string
  lastName?: string
  phone?: string
  whatsapp?: string
  locationId?: string
}

export const usersApi = {
  getProfile: async (): Promise<UserProfile> => {
    return apiClient.get(API_ENDPOINTS.USERS.PROFILE)
  },

  updateProfile: async (data: UpdateProfileInput): Promise<UserProfile> => {
    return apiClient.put(API_ENDPOINTS.USERS.PROFILE, data)
  },
}
