'use client'

import { useState, useEffect } from 'react'
import { locationsApi, type Location } from '@/lib/api/locations'
import { ChevronDown, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'

export type LocationSelectorProps = {
  value?: {
    provinceId?: string
    districtId?: string
    sectorId?: string
    cellId?: string
    villageId?: string
  }
  onChange: (value: LocationSelectorProps['value']) => void
}

export function LocationSelector({ value, onChange }: LocationSelectorProps) {
  const t = useTranslations('filters')
  const [provinces, setProvinces] = useState<Location[]>([])
  const [districts, setDistricts] = useState<Location[]>([])
  const [sectors, setSectors] = useState<Location[]>([])
  const [cells, setCells] = useState<Location[]>([])
  const [villages, setVillages] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)

  const selectedProvince = provinces.find(p => p.id === value?.provinceId)
  const selectedDistrict = districts.find(d => d.id === value?.districtId)
  const selectedSector = sectors.find(s => s.id === value?.sectorId)
  const selectedCell = cells.find(c => c.id === value?.cellId)

  useEffect(() => {
    locationsApi.getProvinces().then(setProvinces).catch(console.error)
  }, [])

  useEffect(() => {
    if (value?.provinceId) {
      setLoading(true)
      locationsApi.getDistricts(value.provinceId)
        .then(setDistricts)
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      setDistricts([])
    }
    onChange({ provinceId: value?.provinceId, districtId: undefined, sectorId: undefined, cellId: undefined, villageId: undefined })
  }, [value?.provinceId])

  useEffect(() => {
    if (value?.districtId) {
      setLoading(true)
      locationsApi.getSectors(value.districtId)
        .then(setSectors)
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      setSectors([])
    }
    onChange({ ...value, sectorId: undefined, cellId: undefined, villageId: undefined })
  }, [value?.districtId])

  useEffect(() => {
    if (value?.sectorId) {
      setLoading(true)
      locationsApi.getCells(value.sectorId)
        .then(setCells)
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      setCells([])
    }
    onChange({ ...value, cellId: undefined, villageId: undefined })
  }, [value?.sectorId])

  useEffect(() => {
    if (value?.cellId) {
      setLoading(true)
      locationsApi.getVillages(value.cellId)
        .then(setVillages)
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      setVillages([])
    }
    onChange({ ...value, villageId: undefined })
  }, [value?.cellId])

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-[#17251a]">Intara (Province)</label>
        <div className="relative">
          <select
            value={value?.provinceId ?? ''}
            onChange={(e) => onChange({ provinceId: e.target.value || undefined })}
            className="w-full appearance-none rounded-lg border border-[#dfe4df] bg-white px-4 py-3 pr-10 text-[0.95rem] text-[#18251a] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            <option value="">Hitamo intara</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#7d867f]" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[#17251a]">Akarere (District)</label>
        <div className="relative">
          <select
            value={value?.districtId ?? ''}
            onChange={(e) => onChange({ ...value, districtId: e.target.value || undefined })}
            disabled={!selectedProvince || loading}
            className="w-full appearance-none rounded-lg border border-[#dfe4df] bg-white px-4 py-3 pr-10 text-[0.95rem] text-[#18251a] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-[#f5f5f5] disabled:text-[#9ca3af]"
          >
            <option value="">Hitamo karere</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#7d867f]" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[#17251a]">Umurenge (Sector)</label>
        <div className="relative">
          <select
            value={value?.sectorId ?? ''}
            onChange={(e) => onChange({ ...value, sectorId: e.target.value || undefined })}
            disabled={!selectedDistrict || loading}
            className="w-full appearance-none rounded-lg border border-[#dfe4df] bg-white px-4 py-3 pr-10 text-[0.95rem] text-[#18251a] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-[#f5f5f5] disabled:text-[#9ca3af]"
          >
            <option value="">Hitamo umurenge</option>
            {sectors.map((sector) => (
              <option key={sector.id} value={sector.id}>
                {sector.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#7d867f]" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[#17251a]">Akagali (Cell)</label>
        <div className="relative">
          <select
            value={value?.cellId ?? ''}
            onChange={(e) => onChange({ ...value, cellId: e.target.value || undefined })}
            disabled={!selectedSector || loading}
            className="w-full appearance-none rounded-lg border border-[#dfe4df] bg-white px-4 py-3 pr-10 text-[0.95rem] text-[#18251a] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-[#f5f5f5] disabled:text-[#9ca3af]"
          >
            <option value="">Hitamo akagali</option>
            {cells.map((cell) => (
              <option key={cell.id} value={cell.id}>
                {cell.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#7d867f]" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[#17251a]">Umudugudu (Village)</label>
        <div className="relative">
          <select
            value={value?.villageId ?? ''}
            onChange={(e) => onChange({ ...value, villageId: e.target.value || undefined })}
            disabled={!selectedCell || loading}
            className="w-full appearance-none rounded-lg border border-[#dfe4df] bg-white px-4 py-3 pr-10 text-[0.95rem] text-[#18251a] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-[#f5f5f5] disabled:text-[#9ca3af]"
          >
            <option value="">Hitamo umudugudu</option>
            {villages.map((village) => (
              <option key={village.id} value={village.id}>
                {village.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#7d867f]" />
        </div>
      </div>
    </div>
  )
}