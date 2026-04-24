import { listingsApi, type ListingDetail } from '@/lib/api/listings'
import { locationsApi, type Location } from '@/lib/api/locations'
import type { Listing } from '@/lib/api/listings'

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4000/api/v1'

async function fetchFromApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 },
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`)
  }
  return response.json()
}

export async function fetchListingById(id: string): Promise<ListingDetail | null> {
  try {
    return await fetchFromApi<ListingDetail>(`/listings/${id}`)
  } catch {
    return null
  }
}

export async function fetchRelatedListings(id: string, limit: number = 4): Promise<Listing[]> {
  try {
    const data = await fetchFromApi<{ data: Listing[] }>(`/listings?limit=${limit}&excludeId=${id}`)
    return data.data ?? []
  } catch {
    return []
  }
}

export async function fetchSellerForListing(id: string): Promise<Listing['seller'] | null> {
  const listing = await fetchListingById(id)
  return listing?.seller ?? null
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