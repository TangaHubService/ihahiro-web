import { apiClient, API_ENDPOINTS } from './client'

export interface Location {
  id: string
  name: string
  type: 'province' | 'district' | 'sector' | 'cell' | 'village'
  parentId: string | null
}

interface ApiResponse {
  items?: Location[]
  data?: Location[]
}

function mapResponse(response: unknown): Location[] {
  if (Array.isArray(response)) return response as Location[]
  const res = response as ApiResponse
  if (Array.isArray(res.items)) return res.items
  if (Array.isArray(res.data)) return res.data
  return []
}

function getAllLocations(): Promise<Location[]> {
  return apiClient.get<{ data: Location[] }>(API_ENDPOINTS.LOCATIONS.PROVINCES.replace('/provinces', '')).then(mapResponse)
}

export const locationsApi = {
  getProvinces: async (): Promise<Location[]> => {
    const all = await getAllLocations()
    return all.filter((l) => l.type === 'province')
  },

  getDistricts: async (provinceId: string): Promise<Location[]> => {
    const all = await getAllLocations()
    return all.filter((l) => l.type === 'district' && l.parentId === provinceId)
  },

  getSectors: async (districtId: string): Promise<Location[]> => {
    const all = await getAllLocations()
    return all.filter((l) => l.type === 'sector' && l.parentId === districtId)
  },

  getCells: async (sectorId: string): Promise<Location[]> => {
    const all = await getAllLocations()
    return all.filter((l) => l.type === 'cell' && l.parentId === sectorId)
  },

  getVillages: async (cellId: string): Promise<Location[]> => {
    const all = await getAllLocations()
    return all.filter((l) => l.type === 'village' && l.parentId === cellId)
  },

  getByParentId: async (parentId: string): Promise<Location[]> => {
    const all = await getAllLocations()
    return all.filter((l) => l.parentId === parentId)
  },

  search: async (query: string): Promise<Location[]> => {
    const response = await apiClient.get(API_ENDPOINTS.LOCATIONS.SEARCH, { q: query })
    return mapResponse(response)
  },

  getById: async (id: string): Promise<Location> => {
    const all = await getAllLocations()
    return all.find((l) => l.id === id)!
  },
}
