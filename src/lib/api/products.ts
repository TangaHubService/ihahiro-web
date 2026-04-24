import { apiClient, API_ENDPOINTS } from './client'

export interface Category {
  id: string
  name: string
  description: string | null
  parentId: string | null
  imageUrl: string | null
  isActive: boolean
}

export interface Unit {
  id: string
  name: string
  slug: string
  shortName: string | null
}

export interface Product {
  id: string
  name: string
  description: string | null
  categoryId: string
  category?: Category
  unitId: string | null
  unit?: Unit
  isActive: boolean
}

export const categoriesApi = {
  list: async (): Promise<Category[]> => {
    const res = await apiClient.get<{ success: boolean; data: Category[] }>(API_ENDPOINTS.CATEGORIES)
    if (Array.isArray(res)) return res
    return (res as { data?: Category[] }).data ?? []
  },

  create: async (data: { name: string; description?: string; parentId?: string }): Promise<Category> => {
    const res = await apiClient.post<{ success: boolean; data: Category }>(API_ENDPOINTS.CATEGORIES, data) as { success: boolean; data: Category }
    if (!res?.data?.id) throw new Error('Invalid response')
    return res.data
  },
}

export const unitsApi = {
  list: async (): Promise<Unit[]> => {
    const res = await apiClient.get<{ success: boolean; data: Unit[] }>(API_ENDPOINTS.UNITS)
    if (Array.isArray(res)) return res
    return res.data ?? []
  },
}

export const productsApi = {
  list: async (params?: { categoryId?: string; search?: string }): Promise<Product[]> => {
    const res = await apiClient.get<{ success: boolean; data: Product[] }>(API_ENDPOINTS.PRODUCTS, params as Record<string, string>)
    if (Array.isArray(res)) return res
    return (res as { data?: Product[] }).data ?? []
  },

  getById: async (id: string): Promise<Product> => {
    const res = await apiClient.get(`${API_ENDPOINTS.PRODUCTS}/${id}`)
    return (res as { data: Product }).data
  },

  create: async (data: { name: string; categoryId: string; description?: string; unitId?: string }): Promise<Product> => {
    const res = await apiClient.post<{ success: boolean; data: Product }>(API_ENDPOINTS.PRODUCTS, data) as { success: boolean; data: Product }
    if (!res?.data?.id) throw new Error('Invalid response')
    return res.data
  },
}