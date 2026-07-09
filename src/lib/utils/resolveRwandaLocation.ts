import { locationsApi } from '@/lib/api/locations'
import type { LocationCascadeValue } from '@/components/features/LocationCascade'
import type { RwandaLocationValue } from '@/components/features/RwandaLocationPicker'

export type LocationResolution = {
  location: LocationCascadeValue
  /** How many of the picked levels were successfully matched to a backend location. */
  matchedDepth: number
}

function normalize(input: string): string {
  return input.trim().toLowerCase()
}

// Backend provinces are seeded as "Kigali City" / "Northern Province" / etc. while the
// rwanda-geo-structure package uses the short form ("Kigali" / "North"), so provinces need
// a substring match; every level below that (district, sector, cell, village) is seeded from
// the same NISR source the package uses, so those match on exact (case-insensitive) name.
function provinceNamesMatch(backendName: string, pickedName: string): boolean {
  return normalize(backendName).includes(normalize(pickedName))
}

function namesMatch(backendName: string, pickedName: string): boolean {
  return normalize(backendName) === normalize(pickedName)
}

/**
 * Walks the backend location tree to translate a name-based selection (as returned by
 * RwandaLocationPicker) into backend location IDs (as required by listingsApi.create).
 * Stops at the first level that can't be matched and returns whatever was resolved so far.
 */
export async function resolveRwandaLocationId(value: RwandaLocationValue): Promise<LocationResolution> {
  const location: LocationCascadeValue = {}

  if (!value.province) return { location, matchedDepth: 0 }

  const provinces = await locationsApi.getProvinces()
  const province = provinces.find((p) => provinceNamesMatch(p.name, value.province!))
  if (!province) return { location, matchedDepth: 0 }
  location.provinceId = province.id

  if (!value.district) return { location, matchedDepth: 1 }
  const districts = await locationsApi.getDistricts(province.id)
  const district = districts.find((d) => namesMatch(d.name, value.district!))
  if (!district) return { location, matchedDepth: 1 }
  location.districtId = district.id

  if (!value.sector) return { location, matchedDepth: 2 }
  const sectors = await locationsApi.getSectors(district.id)
  const sector = sectors.find((s) => namesMatch(s.name, value.sector!))
  if (!sector) return { location, matchedDepth: 2 }
  location.sectorId = sector.id

  if (!value.cell) return { location, matchedDepth: 3 }
  const cells = await locationsApi.getCells(sector.id)
  const cell = cells.find((c) => namesMatch(c.name, value.cell!))
  if (!cell) return { location, matchedDepth: 3 }
  location.cellId = cell.id

  if (!value.village) return { location, matchedDepth: 4 }
  const villages = await locationsApi.getVillages(cell.id)
  const village = villages.find((v) => namesMatch(v.name, value.village!))
  if (!village) return { location, matchedDepth: 4 }
  location.villageId = village.id

  return { location, matchedDepth: 5 }
}
