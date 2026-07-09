import { listingsApi, type ListingDetail } from '@/lib/api/listings'
import { locationsApi, type Location } from '@/lib/api/locations'

export async function fetchListingById(id: string): Promise<ListingDetail | null> {
  try {
    return await listingsApi.getById(id)
  } catch {
    return null
  }
}

export async function fetchRelatedListings(id: string, limit: number = 4) {
  try {
    const result = await listingsApi.list({ limit, status: 'PUBLISHED', excludeId: id })
    return result.items
  } catch {
    return []
  }
}

export async function fetchProvinces(): Promise<Location[]> {
  try {
    return await locationsApi.getProvinces()
  } catch {
    return []
  }
}

export async function fetchDistricts(provinceId: string): Promise<Location[]> {
  try {
    return await locationsApi.getDistricts(provinceId)
  } catch {
    return []
  }
}

export async function fetchSectors(districtId: string): Promise<Location[]> {
  try {
    return await locationsApi.getSectors(districtId)
  } catch {
    return []
  }
}

export async function fetchCells(sectorId: string): Promise<Location[]> {
  try {
    return await locationsApi.getCells(sectorId)
  } catch {
    return []
  }
}

export async function fetchVillages(cellId: string): Promise<Location[]> {
  try {
    return await locationsApi.getVillages(cellId)
  } catch {
    return []
  }
}