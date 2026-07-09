// rwanda-geo-structure@1.4.0 ships a broken "types" path in package.json
// (dist/index.d.ts is missing from the published package), so TypeScript
// can't resolve it. This mirrors the real dist/src/rwanda.d.ts API.
declare module 'rwanda-geo-structure' {
  export interface SearchEntry {
    id: number
    level: number
    location: {
      province?: string
      district?: string
      sector?: string
      cell?: string
      village?: string
    }
  }

  export function search(query: string): SearchEntry[]
  export function getCountry(): string
  export function getProvinces(): string[]
  export function getDistricts(): string[]
  export function getDistrictsByProvince(province: string): string[]
  export function getSectors(): string[]
  export function getSectorsByDistrict(province: string, district: string): string[]
  export function getCells(): string[]
  export function getCellsBySector(province: string, district: string, sector: string): string[]
  export function getVillages(): string[]
  export function getVillagesByCell(
    province: string,
    district: string,
    sector: string,
    cell: string
  ): string[]
  export function getRandomLocation(): {
    province: string
    district: string
    sector: string
    cell: string
    village: string
  }
  export function countLocations(): {
    provinces: number
    districts: number
    sectors: number
    cells: number
    villages: number
  }
}
