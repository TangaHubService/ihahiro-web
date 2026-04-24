import { useQuery } from '@tanstack/react-query'
import { locationsApi } from '@/lib/api/locations'

const LOCATION_KEYS = {
  provinces: ['locations', 'provinces'] as const,
  districts: (province: string) =>
    ['locations', 'districts', province] as const,
  sectors: (province: string, district: string) =>
    ['locations', 'sectors', province, district] as const,
  cells: (province: string, district: string, sector: string) =>
    ['locations', 'cells', province, district, sector] as const,
  villages: (
    province: string,
    district: string,
    sector: string,
    cell: string
  ) => ['locations', 'villages', province, district, sector, cell] as const,
}

export function useProvinces() {
  return useQuery({
    queryKey: LOCATION_KEYS.provinces,
    queryFn: locationsApi.getProvinces,
  })
}

export function useDistricts(province: string) {
  return useQuery({
    queryKey: LOCATION_KEYS.districts(province),
    queryFn: () => locationsApi.getDistricts(province),
    enabled: !!province,
  })
}

export function useSectors(province: string, district: string) {
  return useQuery({
    queryKey: LOCATION_KEYS.sectors(province, district),
    queryFn: () => locationsApi.getSectors(district),
    enabled: !!province && !!district,
  })
}

export function useCells(province: string, district: string, sector: string) {
  return useQuery({
    queryKey: LOCATION_KEYS.cells(province, district, sector),
    queryFn: () => locationsApi.getCells(sector),
    enabled: !!province && !!district && !!sector,
  })
}

export function useVillages(
  province: string,
  district: string,
  sector: string,
  cell: string
) {
  return useQuery({
    queryKey: LOCATION_KEYS.villages(province, district, sector, cell),
    queryFn: () => locationsApi.getVillages(cell),
    enabled: !!province && !!district && !!sector && !!cell,
  })
}
