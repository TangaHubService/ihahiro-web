'use client'

import { useState, useEffect } from 'react'
import { locationsApi, type Location } from '@/lib/api/locations'
import type { LocationCascadeValue } from './LocationCascade'
import { useTranslations } from 'next-intl'
import { ChevronDown } from 'lucide-react'

interface LocationBarProps {
  value: LocationCascadeValue
  onChange: (value: LocationCascadeValue) => void
  compact?: boolean
}

export function LocationBar({ value, onChange }: LocationBarProps) {
  const t = useTranslations('filters')
  const [provinces, setProvinces] = useState<Location[]>([])
  const [districts, setDistricts] = useState<Location[]>([])
  const [sectors, setSectors] = useState<Location[]>([])
  const [cells, setCells] = useState<Location[]>([])
  const [villages, setVillages] = useState<Location[]>([])

  // Load provinces once
  useEffect(() => {
    locationsApi.getProvinces().then(setProvinces).catch(() => setProvinces([]))
  }, [])

  // Province → districts
  useEffect(() => {
    setSectors([])
    setCells([])
    setVillages([])
    if (value.provinceId) {
      locationsApi.getDistricts(value.provinceId).then(setDistricts).catch(() => setDistricts([]))
    } else {
      setDistricts([])
    }
  }, [value.provinceId])

  // District → sectors
  useEffect(() => {
    setCells([])
    setVillages([])
    if (value.districtId) {
      locationsApi.getSectors(value.districtId).then(setSectors).catch(() => setSectors([]))
    } else {
      setSectors([])
    }
  }, [value.districtId])

  // Sector → cells
  useEffect(() => {
    setVillages([])
    if (value.sectorId) {
      locationsApi.getCells(value.sectorId).then(setCells).catch(() => setCells([]))
    } else {
      setCells([])
    }
  }, [value.sectorId])

  // Cell → villages
  useEffect(() => {
    if (value.cellId) {
      locationsApi.getVillages(value.cellId).then(setVillages).catch(() => setVillages([]))
    } else {
      setVillages([])
    }
  }, [value.cellId])

  function update(partial: Partial<LocationCascadeValue>) {
    const next: LocationCascadeValue = { ...value, ...partial }
    // Cascade: clearing a parent clears all deeper children
    if ('provinceId' in partial) {
      next.districtId = undefined
      next.sectorId = undefined
      next.cellId = undefined
      next.villageId = undefined
    }
    if ('districtId' in partial) {
      next.sectorId = undefined
      next.cellId = undefined
      next.villageId = undefined
    }
    if ('sectorId' in partial) {
      next.cellId = undefined
      next.villageId = undefined
    }
    if ('cellId' in partial) {
      next.villageId = undefined
    }
    onChange(next)
  }

  const hasSelection = Object.values(value).some(Boolean)

  return (
    <div className="flex items-center gap-2 flex-nowrap overflow-x-auto w-full">
      {/* Province — always active */}
      <div className="relative shrink-0">
        <select
          value={value.provinceId ?? ''}
          onChange={(e) => update({ provinceId: e.target.value || undefined })}
          className="h-12 appearance-none rounded-xl border border-[#d8ddd8] bg-white pl-4 pr-8 text-sm text-[#18251a] outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/10"
        >
          <option value="">{t('province')}</option>
          {provinces.map((p) => (
            <option key={p.id} value={p.id}>{p.name.trim()}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#7d867f]" />
      </div>

      {/* District — active only when province selected */}
      <div className={`relative shrink-0 ${!value.provinceId ? 'opacity-40 pointer-events-none' : ''}`}>
        <select
          value={value.districtId ?? ''}
          onChange={(e) => update({ districtId: e.target.value || undefined })}
          disabled={!value.provinceId}
          className="h-12 appearance-none rounded-xl border border-[#d8ddd8] bg-white pl-4 pr-8 text-sm text-[#18251a] outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/10 disabled:cursor-not-allowed"
        >
          <option value="">{t('district')}</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>{d.name.trim()}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#7d867f]" />
      </div>

      {/* Sector — active only when district selected */}
      <div className={`relative shrink-0 ${!value.districtId ? 'opacity-40 pointer-events-none' : ''}`}>
        <select
          value={value.sectorId ?? ''}
          onChange={(e) => update({ sectorId: e.target.value || undefined })}
          disabled={!value.districtId}
          className="h-12 appearance-none rounded-xl border border-[#d8ddd8] bg-white pl-4 pr-8 text-sm text-[#18251a] outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/10 disabled:cursor-not-allowed"
        >
          <option value="">{t('sector')}</option>
          {sectors.map((s) => (
            <option key={s.id} value={s.id}>{s.name.trim()}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#7d867f]" />
      </div>

      {/* Cell — active only when sector selected */}
      <div className={`relative shrink-0 ${!value.sectorId ? 'opacity-40 pointer-events-none' : ''}`}>
        <select
          value={value.cellId ?? ''}
          onChange={(e) => update({ cellId: e.target.value || undefined })}
          disabled={!value.sectorId}
          className="h-12 appearance-none rounded-xl border border-[#d8ddd8] bg-white pl-4 pr-8 text-sm text-[#18251a] outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/10 disabled:cursor-not-allowed"
        >
          <option value="">{t('cell')}</option>
          {cells.map((c) => (
            <option key={c.id} value={c.id}>{c.name.trim()}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#7d867f]" />
      </div>

      {/* Village — active only when cell selected */}
      <div className={`relative shrink-0 ${!value.cellId ? 'opacity-40 pointer-events-none' : ''}`}>
        <select
          value={value.villageId ?? ''}
          onChange={(e) => update({ villageId: e.target.value || undefined })}
          disabled={!value.cellId}
          className="h-12 appearance-none rounded-xl border border-[#d8ddd8] bg-white pl-4 pr-8 text-sm text-[#18251a] outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/10 disabled:cursor-not-allowed"
        >
          <option value="">{t('village')}</option>
          {villages.map((v) => (
            <option key={v.id} value={v.id}>{v.name.trim()}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#7d867f]" />
      </div>

      {/* Clear button */}
      {hasSelection && (
        <button
          type="button"
          onClick={() => onChange({})}
          className="h-12 shrink-0 rounded-xl border border-[#d4d9d3] bg-white px-4 text-sm font-semibold text-[#536057] transition hover:border-primary hover:text-primary"
        >
          {t('clearLocation')}
        </button>
      )}
    </div>
  )
}
