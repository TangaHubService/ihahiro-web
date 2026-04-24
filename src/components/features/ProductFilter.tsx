'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { RefreshCw, SlidersHorizontal } from 'lucide-react'
import { useTranslations } from 'next-intl'

// Extends LocationCascadeValue so ListingsView can spread its full filter state into ProductFilter
export type ProductFilterValue = {
  q?: string
  location?: Record<string, never>
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: string
  page?: number
}

export type ProductFilterProps = {
  value: ProductFilterValue
  onChange: (next: Partial<ProductFilterValue>) => void
}

export function ProductFilter({ value, onChange }: ProductFilterProps) {
  const tFilters = useTranslations('filters')
  const tListings = useTranslations('listings')

  function patch(partial: Partial<ProductFilterValue>) {
    onChange({ ...value, ...partial })
  }

  function clear() {
    onChange({
      q: '',
      category: 'all',
      sort: 'newest',
      minPrice: undefined,
      maxPrice: undefined,
    })
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <SlidersHorizontal className="size-5 text-primary" aria-hidden />
        <h2 className="text-lg font-bold text-[#17251a]">
          {tFilters('title')}
        </h2>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-[#17251a]">
          {tFilters('priceRange')}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Input
            aria-label={tFilters('priceMin')}
            placeholder={tFilters('priceMin')}
            type="number"
            min={0}
            value={value.minPrice ?? ''}
            onChange={(e) =>
              patch({
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="h-11 rounded-md border-[#dfe4df] bg-white"
          />
          <Input
            aria-label={tFilters('priceMax')}
            placeholder={tFilters('priceMax')}
            type="number"
            min={0}
            value={value.maxPrice ?? ''}
            onChange={(e) =>
              patch({
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="h-11 rounded-md border-[#dfe4df] bg-white"
          />
        </div>
      </div>

      <Select
        label={tFilters('sortBy')}
        value={value.sort ?? 'newest'}
        onChange={(e) => patch({ sort: e.target.value })}
        className="h-11 rounded-md border-[#dfe4df] bg-white"
      >
        <option value="newest">{tListings('sortNewest')}</option>
        <option value="price_asc">{tListings('sortPriceAsc')}</option>
        <option value="price_desc">{tListings('sortPriceDesc')}</option>
      </Select>

      <Button
        type="button"
        variant="outline"
        className="mt-2 h-11 w-full gap-2 rounded-md border-transparent bg-[#e9f1e6] font-bold text-primary hover:bg-[#deead9]"
        onClick={clear}
      >
        <RefreshCw className="size-4" aria-hidden />
        {tFilters('clear')}
      </Button>
    </div>
  )
}