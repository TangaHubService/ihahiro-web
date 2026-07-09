'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, Loader2 } from 'lucide-react'
import {
  getProvinces,
  getDistrictsByProvince,
  getSectorsByDistrict,
  getCellsBySector,
  getVillagesByCell,
} from 'rwanda-geo-structure'
import { cn } from '@/lib/utils/cn'

export type RwandaLocationValue = {
  province?: string
  district?: string
  sector?: string
  cell?: string
  village?: string
}

export type RwandaLocationPickerProps = {
  value?: RwandaLocationValue
  onChange: (value: RwandaLocationValue) => void
  className?: string
}

type LevelKey = 'province' | 'district' | 'sector' | 'cell' | 'village'

const LEVEL_ORDER: LevelKey[] = ['province', 'district', 'sector', 'cell', 'village']

const LEVEL_META: Record<LevelKey, { label: string; placeholder: string }> = {
  province: { label: 'Province', placeholder: 'Select province' },
  district: { label: 'District', placeholder: 'Select district' },
  sector: { label: 'Sector', placeholder: 'Select sector' },
  cell: { label: 'Cell', placeholder: 'Select cell' },
  village: { label: 'Village', placeholder: 'Select village' },
}

export function RwandaLocationPicker({ value = {}, onChange, className }: RwandaLocationPickerProps) {
  const [provinces] = useState<string[]>(() => getProvinces())
  const [districts, setDistricts] = useState<string[]>([])
  const [sectors, setSectors] = useState<string[]>([])
  const [cells, setCells] = useState<string[]>([])
  const [villages, setVillages] = useState<string[]>([])
  const [loadingLevel, setLoadingLevel] = useState<LevelKey | null>(null)

  // Each level's options are recomputed whenever its parent selection changes.
  // Wrapped in a resolved promise (rather than called inline) so a real network-backed
  // implementation could later be swapped in without changing this effect's shape.
  useEffect(() => {
    if (!value.province) {
      setDistricts([])
      return
    }
    setLoadingLevel('district')
    let cancelled = false
    Promise.resolve(getDistrictsByProvince(value.province)).then((result) => {
      if (cancelled) return
      setDistricts(result)
      setLoadingLevel((current) => (current === 'district' ? null : current))
    })
    return () => {
      cancelled = true
    }
  }, [value.province])

  useEffect(() => {
    if (!value.province || !value.district) {
      setSectors([])
      return
    }
    setLoadingLevel('sector')
    let cancelled = false
    Promise.resolve(getSectorsByDistrict(value.province, value.district)).then((result) => {
      if (cancelled) return
      setSectors(result)
      setLoadingLevel((current) => (current === 'sector' ? null : current))
    })
    return () => {
      cancelled = true
    }
  }, [value.province, value.district])

  useEffect(() => {
    if (!value.province || !value.district || !value.sector) {
      setCells([])
      return
    }
    setLoadingLevel('cell')
    let cancelled = false
    Promise.resolve(getCellsBySector(value.province, value.district, value.sector)).then((result) => {
      if (cancelled) return
      setCells(result)
      setLoadingLevel((current) => (current === 'cell' ? null : current))
    })
    return () => {
      cancelled = true
    }
  }, [value.province, value.district, value.sector])

  useEffect(() => {
    if (!value.province || !value.district || !value.sector || !value.cell) {
      setVillages([])
      return
    }
    setLoadingLevel('village')
    let cancelled = false
    Promise.resolve(getVillagesByCell(value.province, value.district, value.sector, value.cell)).then((result) => {
      if (cancelled) return
      setVillages(result)
      setLoadingLevel((current) => (current === 'village' ? null : current))
    })
    return () => {
      cancelled = true
    }
  }, [value.province, value.district, value.sector, value.cell])

  const handleSelect = (level: LevelKey, selected: string) => {
    const next: RwandaLocationValue = { ...value, [level]: selected || undefined }
    // Changing a level invalidates every level beneath it.
    const index = LEVEL_ORDER.indexOf(level)
    for (const key of LEVEL_ORDER.slice(index + 1)) {
      next[key] = undefined
    }
    onChange(next)
  }

  const optionsByLevel: Record<LevelKey, string[]> = {
    province: provinces,
    district: districts,
    sector: sectors,
    cell: cells,
    village: villages,
  }

  const disabledByLevel: Record<LevelKey, boolean> = {
    province: false,
    district: !value.province,
    sector: !value.district,
    cell: !value.sector,
    village: !value.cell,
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {LEVEL_ORDER.map((level) => {
        const { label, placeholder } = LEVEL_META[level]
        const isDisabled = disabledByLevel[level]
        const isLoading = loadingLevel === level

        return (
          <div key={level}>
            <label className="mb-1 block text-sm font-medium text-[#17251a]">{label}</label>
            <div className="relative">
              <select
                value={value[level] ?? ''}
                onChange={(e) => handleSelect(level, e.target.value)}
                disabled={isDisabled || isLoading}
                className="w-full appearance-none rounded-lg border border-[#dfe4df] bg-white px-4 py-3 pr-10 text-[0.95rem] text-[#18251a] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-[#f5f5f5] disabled:text-[#9ca3af]"
              >
                <option value="">{isLoading ? 'Loading...' : placeholder}</option>
                {optionsByLevel[level].map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              {isLoading ? (
                <Loader2 className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 animate-spin text-primary" />
              ) : (
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#7d867f]" />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
