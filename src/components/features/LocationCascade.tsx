'use client'

import { useState, useEffect, useId } from 'react'
import { locationsApi, type Location } from '@/lib/api/locations'
import { MapPin, ChevronDown, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

export interface LocationCascadeValue {
  provinceId?: string
  districtId?: string
  sectorId?: string
  cellId?: string
  villageId?: string
}

interface LocationCascadeProps {
  value?: LocationCascadeValue
  onChange?: (value: LocationCascadeValue) => void
  onApply?: (value: LocationCascadeValue) => void
  label?: string
  placeholder?: string
  error?: string
  showVillage?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_CLASSES = {
  sm: 'h-10 text-xs',
  md: 'h-12 text-sm',
  lg: 'h-14 text-base',
}

const PADDING_CLASSES = {
  sm: 'pl-9 pr-8',
  md: 'pl-11 pr-10',
  lg: 'pl-12 pr-11',
}

const ICON_SIZES = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
}

const ARROW_SIZES = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
}

function SelectDropdown({
  value,
  options,
  onChange,
  placeholder,
  loading,
  disabled,
}: {
  value: string
  options: Location[]
  onChange: (id: string) => void
  placeholder: string
  loading?: boolean
  disabled?: boolean
}) {
  const id = useId()
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
        className="w-full appearance-none rounded-lg border border-[#d8ddd8] bg-white pl-4 pr-8 text-sm text-[#18251a] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-[#f3f5f3] disabled:text-[#7a837c]"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name.trim()}
          </option>
        ))}
      </select>
      {loading ? (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-3.5 animate-spin rounded-full border border-[#7d867f] border-t-transparent" />
      ) : (
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7d867f]" />
      )}
    </div>
  )
}

export function LocationCascade({
  value = {},
  onChange,
  onApply,
  label,
  placeholder = 'Hitamo ahantu',
  error,
  showVillage = false,
  size = 'md',
}: LocationCascadeProps) {
  const t = useTranslations('filters')
  const [provinces, setProvinces] = useState<Location[]>([])
  const [districts, setDistricts] = useState<Location[]>([])
  const [sectors, setSectors] = useState<Location[]>([])
  const [cells, setCells] = useState<Location[]>([])
  const [villages, setVillages] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)
  const [showCascade, setShowCascade] = useState(false)
  const [applied, setApplied] = useState<LocationCascadeValue>(value)
  const [temp, setTemp] = useState<LocationCascadeValue>(value)
  const id = useId()

  // Load provinces
  useEffect(() => {
    locationsApi.getProvinces().then(setProvinces).catch(() => setProvinces([]))
  }, [])

  // Load districts when province selected
  useEffect(() => {
    if (temp.provinceId) {
      setLoading(true)
      locationsApi.getDistricts(temp.provinceId)
        .then(setDistricts)
        .catch(() => setDistricts([]))
        .finally(() => setLoading(false))
    } else {
      setDistricts([])
      setSectors([])
      setCells([])
      setVillages([])
    }
  }, [temp.provinceId])

  // Load sectors when district selected
  useEffect(() => {
    if (temp.districtId) {
      setLoading(true)
      locationsApi.getSectors(temp.districtId)
        .then(setSectors)
        .catch(() => setSectors([]))
        .finally(() => setLoading(false))
    } else {
      setSectors([])
      setCells([])
      setVillages([])
    }
  }, [temp.districtId])

  // Load cells when sector selected
  useEffect(() => {
    if (temp.sectorId) {
      setLoading(true)
      locationsApi.getCells(temp.sectorId)
        .then(setCells)
        .catch(() => setCells([]))
        .finally(() => setLoading(false))
    } else {
      setCells([])
      setVillages([])
    }
  }, [temp.sectorId])

  // Load villages when cell selected
  useEffect(() => {
    if (temp.cellId && showVillage) {
      setLoading(true)
      locationsApi.getVillages(temp.cellId)
        .then(setVillages)
        .catch(() => setVillages([]))
        .finally(() => setLoading(false))
    } else {
      setVillages([])
    }
  }, [temp.cellId, showVillage])

  function updateTemp(partial: Partial<LocationCascadeValue>) {
    const next = { ...temp, ...partial }
    setTemp(next)
    onChange?.(next)
  }

  function handleApply() {
    setApplied(temp)
    setShowCascade(false)
    onApply?.(temp)
    onChange?.(temp)
  }

  function handleClear() {
    const empty = {}
    setTemp(empty)
    setApplied(empty)
    setDistricts([])
    setSectors([])
    setCells([])
    setVillages([])
    setShowCascade(false)
    onChange?.(empty)
    onApply?.(empty)
  }

  const hasAnySelection = Object.values(applied).some(Boolean)

  // Build display label for the trigger button
  function buildDisplayLabel() {
    const { provinceId, districtId, sectorId, cellId, villageId } = applied
    if (villageId) {
      const v = villages.find((l) => l.id === villageId)
      return v?.name
    }
    if (cellId) {
      const c = cells.find((l) => l.id === cellId)
      return c?.name
    }
    if (sectorId) {
      const s = sectors.find((l) => l.id === sectorId)
      return s?.name
    }
    if (districtId) {
      const d = districts.find((l) => l.id === districtId)
      return d?.name
    }
    if (provinceId) {
      const p = provinces.find((l) => l.id === provinceId)
      return p?.name
    }
    return null
  }

  const displayLabel = buildDisplayLabel()

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <div className="relative">
        <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 ${ICON_SIZES[size]} text-[#7d867f]`} aria-hidden />
        <button
          id={id}
          type="button"
          onClick={() => setShowCascade(!showCascade)}
          className={`flex w-full items-center gap-2 rounded-lg border border-[#d8ddd8] bg-white px-4 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 ${PADDING_CLASSES[size]} ${SIZE_CLASSES[size]} ${error ? 'border-accent' : ''} ${hasAnySelection ? 'text-[#18251a]' : 'text-[#939a95]'}`}
        >
          <span className="flex-1 text-left">
            {hasAnySelection && displayLabel ? displayLabel : placeholder}
          </span>
          {hasAnySelection && (
            <span
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              className="flex size-5 items-center justify-center rounded-full bg-[#e4e9e3] text-[#536057] hover:bg-[#d4d9d3]"
            >
              <X className="size-3" />
            </span>
          )}
        </button>

        {showCascade && (
          <div className="absolute left-0 top-full z-50 mt-1.5 w-full min-w-[22rem] rounded-xl border border-[#dfe5df] bg-white p-4 shadow-[0_8px_32px_rgba(21,45,25,0.12)]">
            <div className="flex flex-col gap-3">
              {/* Province */}
              <SelectDropdown
                value={temp.provinceId ?? ''}
                options={provinces}
                onChange={(id) => updateTemp({ provinceId: id, districtId: '', sectorId: '', cellId: '', villageId: '' })}
                placeholder={t('province')}
              />

              {/* District — appears once province is selected */}
              {temp.provinceId && (
                <SelectDropdown
                  value={temp.districtId ?? ''}
                  options={districts}
                  onChange={(id) => updateTemp({ districtId: id, sectorId: '', cellId: '', villageId: '' })}
                  placeholder={t('district')}
                  loading={loading}
                />
              )}

              {/* Sector — appears once district is selected */}
              {temp.districtId && (
                <SelectDropdown
                  value={temp.sectorId ?? ''}
                  options={sectors}
                  onChange={(id) => updateTemp({ sectorId: id, cellId: '', villageId: '' })}
                  placeholder={t('sector')}
                  loading={loading}
                />
              )}

              {/* Cell — appears once sector is selected */}
              {temp.sectorId && (
                <SelectDropdown
                  value={temp.cellId ?? ''}
                  options={cells}
                  onChange={(id) => updateTemp({ cellId: id, villageId: '' })}
                  placeholder={t('cell')}
                  loading={loading}
                />
              )}

              {/* Village — appears once cell is selected, if enabled */}
              {showVillage && temp.cellId && (
                <SelectDropdown
                  value={temp.villageId ?? ''}
                  options={villages}
                  onChange={(id) => updateTemp({ villageId: id })}
                  placeholder={t('village')}
                  loading={loading}
                />
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-sm text-[#536057] hover:text-primary"
                >
                  {t('clearLocation')}
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary/90"
                >
                  {t('applyLocation')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-accent" role="alert">{error}</p>
      )}
    </div>
  )
}