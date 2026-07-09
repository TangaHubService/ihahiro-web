import type { LocationCascadeValue } from '@/components/features/LocationCascade'

export function extractLocationId(location?: LocationCascadeValue): string | undefined {
  if (!location) return undefined
  if (location.villageId) return location.villageId
  if (location.cellId) return location.cellId
  if (location.sectorId) return location.sectorId
  if (location.districtId) return location.districtId
  if (location.provinceId) return location.provinceId
  return undefined
}
