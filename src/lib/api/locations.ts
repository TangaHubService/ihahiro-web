import { apiClient, API_ENDPOINTS } from './client'

export interface Location {
  id: string
  name: string
  type: 'province' | 'district' | 'sector' | 'cell' | 'village'
  parentId: string | null
}

export interface LocationAncestor {
  id: string
  name: string
  type: string
}

export interface LocationDetail extends Location {
  ancestors?: LocationAncestor[]
}

export const locationsApi = {
  getProvinces: (): Promise<Location[]> => {
    return apiClient.get(API_ENDPOINTS.LOCATIONS.PROVINCES)
  },

  getDistricts: (provinceId: string): Promise<Location[]> => {
    return apiClient.get(API_ENDPOINTS.LOCATIONS.DISTRICTS, { parentId: provinceId })
  },

  getSectors: (districtId: string): Promise<Location[]> => {
    return apiClient.get(API_ENDPOINTS.LOCATIONS.SECTORS, { parentId: districtId })
  },

  getCells: (sectorId: string): Promise<Location[]> => {
    return apiClient.get(API_ENDPOINTS.LOCATIONS.CELLS, { parentId: sectorId })
  },

  getVillages: (cellId: string): Promise<Location[]> => {
    return apiClient.get(API_ENDPOINTS.LOCATIONS.VILLAGES, { parentId: cellId })
  },

  search: (query: string): Promise<Location[]> => {
    return apiClient.get(API_ENDPOINTS.LOCATIONS.SEARCH, { q: query })
  },

  getById: (id: string): Promise<LocationDetail> => {
    return apiClient.get(API_ENDPOINTS.LOCATIONS.DETAIL(id))
  },
}
