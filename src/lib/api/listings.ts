import { apiClient, API_ENDPOINTS } from './client'

export interface Listing {
  id: string
  title: string
  description: string
  price: number
  quantity: number
  unit: { id: string; name: string; shortName: string | null }
  product: { id: string; name: string }
  seller: {
    id: string
    firstName: string
    lastName: string
    phone: string | null
  }
  location: { id: string; name: string; type: string } | null
  status: 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED'
  isActive: boolean
  viewCount: number
  media?: ListingMedia[]
  createdAt: string
  publishedAt: string | null
}

export interface ListingMedia {
  id: string
  url: string
  type: string
  order: number
}

export interface AddListingMediaInput {
  listingId: string
  url: string
  type: 'image' | 'video'
  order?: number
}

export interface ListingDetail extends Listing {
  media: ListingMedia[]
}

export interface ListingFilters {
  q?: string
  locationId?: string
  productId?: string
  categoryId?: string
  sellerId?: string
  status?: 'PUBLISHED'
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedListings {
  items: Listing[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateListingInput {
  title: string
  description: string
  price: number
  quantity?: number
  unitId: string
  productId: string
  locationId?: string
  status?: 'DRAFT' | 'PENDING_REVIEW'
}

export const listingsApi = {
  list: async (filters: ListingFilters = {}): Promise<PaginatedListings> => {
    const params: Record<string, string> = {}
    
    if (filters.q) params['q'] = filters.q
    if (filters.locationId) params['locationId'] = filters.locationId
    if (filters.productId) params['productId'] = filters.productId
    if (filters.categoryId) params['categoryId'] = filters.categoryId
    if (filters.sellerId) params['sellerId'] = filters.sellerId
    if (filters.status) params['status'] = filters.status
    if (filters.minPrice) params['minPrice'] = String(filters.minPrice)
    if (filters.maxPrice) params['maxPrice'] = String(filters.maxPrice)
    if (filters.page) params['page'] = String(filters.page)
    if (filters.limit) params['limit'] = String(filters.limit)
    if (filters.sortBy) params['sortBy'] = filters.sortBy
    if (filters.sortOrder) params['sortOrder'] = filters.sortOrder
    
    return apiClient.get(API_ENDPOINTS.LISTINGS.LIST, params)
  },

  myListings: async (filters: ListingFilters = {}): Promise<PaginatedListings> => {
    const params: Record<string, string> = {}
    
    if (filters.page) params['page'] = String(filters.page)
    if (filters.limit) params['limit'] = String(filters.limit)
    if (filters.status) params['status'] = filters.status
    
    return apiClient.get(API_ENDPOINTS.LISTINGS.MY, params)
  },

  getById: async (id: string): Promise<ListingDetail> => {
    return apiClient.get(API_ENDPOINTS.LISTINGS.DETAIL(id))
  },

  create: async (data: CreateListingInput): Promise<Listing> => {
    return apiClient.post(API_ENDPOINTS.LISTINGS.LIST, data)
  },

  update: async (id: string, data: Partial<CreateListingInput>): Promise<Listing> => {
    return apiClient.put(API_ENDPOINTS.LISTINGS.DETAIL(id), data)
  },

  submit: async (id: string): Promise<Listing> => {
    return apiClient.post(API_ENDPOINTS.LISTINGS.SUBMIT(id))
  },

  archive: async (id: string): Promise<Listing> => {
    return apiClient.post(API_ENDPOINTS.LISTINGS.ARCHIVE(id))
  },
}

export const listingMediaApi = {
  add: async (data: AddListingMediaInput): Promise<ListingMedia> => {
    return apiClient.post(API_ENDPOINTS.MEDIA.UPLOAD, data)
  },

  list: async (listingId: string): Promise<ListingMedia[]> => {
    return apiClient.get(API_ENDPOINTS.MEDIA.LIST(listingId))
  },

  remove: async (id: string, listingId: string): Promise<void> => {
    return apiClient.delete(API_ENDPOINTS.MEDIA.DELETE(id, listingId))
  },
}
