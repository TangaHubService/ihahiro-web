'use client'

import { useEffect, useState } from 'react'
import { ListingCard } from '@/components/features/ListingCard'
import { LocationBar } from '@/components/features/LocationBar'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useListings } from '@/hooks/useListings'
import { categoriesApi, type Category } from '@/lib/api/products'
import { Link } from '@/i18n/navigation'
import type { ListingFilters } from '@/lib/api/listings'
import type { LocationCascadeValue } from '@/components/features/LocationCascade'
import {
  Apple,
  Carrot,
  ChevronLeft,
  ChevronRight,
  CircleEllipsis,
  Grid2x2,
  LayoutList,
  Leaf,
  MapPin,
  Plus,
  Search,
  SlidersHorizontal,
  Sprout,
  Wheat,
  X,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export type ListingsViewProps = {
  initialFilters?: Partial<ListingFilters>
}

interface ListingsFilterState {
  location: LocationCascadeValue
  q: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  sort: string
  page: number
}

type PaginationItem = number | 'ellipsis'

function extractLocationId(loc?: LocationCascadeValue): string | undefined {
  if (!loc) return undefined
  if (loc.villageId) return loc.villageId
  if (loc.cellId) return loc.cellId
  if (loc.sectorId) return loc.sectorId
  if (loc.districtId) return loc.districtId
  if (loc.provinceId) return loc.provinceId
  return undefined
}

function getInitialSort(initialFilters?: Partial<ListingFilters>) {
  if (initialFilters?.sortBy === 'price') {
    return initialFilters.sortOrder === 'asc' ? 'price_asc' : 'price_desc'
  }

  return 'newest'
}

function getCategoryPresentation(name: string) {
  const normalized = name.toLowerCase()

  if (
    normalized.includes('grain') ||
    normalized.includes('cereal') ||
    normalized.includes('ibinyampeke')
  ) {
    return {
      Icon: Wheat,
      iconClassName: 'bg-[#f3f8e8] text-[#527326]',
      activeClassName: 'bg-[#eef8e9] text-primary',
    }
  }

  if (
    normalized.includes('legume') ||
    normalized.includes('bean') ||
    normalized.includes('ibinyamis') ||
    normalized.includes('imbuto z')
  ) {
    return {
      Icon: Sprout,
      iconClassName: 'bg-[#edf7ec] text-[#2f7d43]',
      activeClassName: 'bg-[#eef8ee] text-primary',
    }
  }

  if (
    normalized.includes('vegetable') ||
    normalized.includes('leaf') ||
    normalized.includes('imboga')
  ) {
    return {
      Icon: Leaf,
      iconClassName: 'bg-[#ebf7ef] text-[#22744a]',
      activeClassName: 'bg-[#edf8f1] text-primary',
    }
  }

  if (
    normalized.includes('fruit') ||
    normalized.includes('banana') ||
    normalized.includes('avocado') ||
    normalized.includes('imbuto')
  ) {
    return {
      Icon: Apple,
      iconClassName: 'bg-[#fff2e8] text-[#d76d17]',
      activeClassName: 'bg-[#fff5ec] text-[#9b5b13]',
    }
  }

  if (
    normalized.includes('tuber') ||
    normalized.includes('root') ||
    normalized.includes('cassava') ||
    normalized.includes('potato') ||
    normalized.includes('ibinyabijumba')
  ) {
    return {
      Icon: Carrot,
      iconClassName: 'bg-[#fff4eb] text-[#c96b22]',
      activeClassName: 'bg-[#fff6ed] text-[#9b561b]',
    }
  }

  return {
    Icon: CircleEllipsis,
    iconClassName: 'bg-[#f1f3ef] text-[#556157]',
    activeClassName: 'bg-[#f4f7f2] text-primary',
  }
}

function getPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 'ellipsis', totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages]
}

export function ListingsView({ initialFilters }: ListingsViewProps) {
  const [filters, setFilters] = useState<ListingsFilterState>({
    location: {},
    q: initialFilters?.q ?? '',
    categoryId: initialFilters?.categoryId,
    sort: getInitialSort(initialFilters),
    minPrice: initialFilters?.minPrice,
    maxPrice: initialFilters?.maxPrice,
    page: initialFilters?.page ?? 1,
  })

  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    categoriesApi.list().then(setCategories).catch(() => setCategories([]))
  }, [])

  const debouncedQ = useDebouncedValue(filters.q, 400)
  const locationId = extractLocationId(filters.location)

  const queryFilters: ListingFilters = {
    q: debouncedQ,
    status: 'PUBLISHED',
    limit: 12,
    sortBy:
      filters.sort === 'price_asc' || filters.sort === 'price_desc' ? 'price' : 'createdAt',
    sortOrder: filters.sort === 'price_asc' ? 'asc' : 'desc',
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    page: filters.page,
    locationId,
    categoryId: filters.categoryId,
  }

  const t = useTranslations('listings')
  const tCommon = useTranslations('common')
  const tFilters = useTranslations('filters')
  const { data, isPending, isError, refetch } = useListings(queryFilters)

  const pageCount = data?.meta ? Math.max(1, Math.ceil(data.meta.total / data.meta.limit)) : 1
  const paginationItems = getPaginationItems(filters.page, pageCount)
  const resultsCount = data?.meta.total ?? 0
  const hasLocationSelection = Object.values(filters.location).some(Boolean)
  const hasActiveFilters =
    hasLocationSelection ||
    filters.q.trim().length > 0 ||
    filters.categoryId !== undefined ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.sort !== 'newest'

  function updateFilters(partial: Partial<ListingsFilterState>) {
    setFilters((current) => ({ ...current, ...partial }))
  }

  function clearAllFilters() {
    setFilters({
      location: {},
      q: '',
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sort: 'newest',
      page: 1,
    })
  }

  return (
    <Container className="py-6 sm:py-8">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_31rem] lg:items-start">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-medium text-[#69766c]">
            <span>{t('breadcrumbHome')}</span>
            <span className="text-[#a3aca4]">/</span>
            <span className="font-semibold text-primary">{t('breadcrumbMarket')}</span>
          </p>
          <h1 className="mt-3 text-[2.35rem] font-black leading-none tracking-[-0.045em] text-primary sm:text-[3.15rem]">
            {t('title')}
          </h1>
          <p className="mt-3 max-w-2xl text-[1rem] leading-7 text-[#4f5b52] sm:text-[1.06rem]">
            {t('subtitle')}
          </p>
        </div>

        <Card className="overflow-hidden rounded-[1.9rem] border-0 bg-[linear-gradient(135deg,#edf5e8_0%,#e9f1e8_55%,#f4f8f2_100%)] shadow-none">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.5rem] bg-white/75 shadow-[0_18px_30px_rgba(27,94,32,0.08)]">
              <Image src="/logo.png" alt="" fill className="object-contain p-3" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[1.15rem] font-black text-[#172519]">{t('ctaSellTitle')}</p>
              <p className="mt-1.5 max-w-md text-sm leading-6 text-[#546155]">{t('ctaSellBody')}</p>
              <Link href="/post-harvest" className="mt-4 inline-flex">
                <Button className="h-11 rounded-xl px-5 text-sm font-bold shadow-[0_10px_18px_rgba(27,94,32,0.18)]">
                  {t('ctaSellButton')}
                  <Plus className="size-4" aria-hidden />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto]">
          <div className="relative min-w-0">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#7d867f]"
              aria-hidden
            />
            <input
              value={filters.q}
              onChange={(event) => updateFilters({ q: event.target.value, page: 1 })}
              placeholder={t('searchPlaceholder')}
              className="h-[3.25rem] w-full rounded-2xl border border-[#d8ddd8] bg-white pl-12 pr-4 text-[0.95rem] text-[#18251a] outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/10"
            />
          </div>
          <div className="min-w-0 overflow-hidden rounded-2xl border border-transparent bg-transparent">
            <LocationBar
              value={filters.location}
              onChange={(location) => updateFilters({ location, page: 1 })}
            />
          </div>
        </div>
        <Button
          className="h-12 rounded-2xl px-8 text-sm font-bold shadow-[0_12px_22px_rgba(27,94,32,0.15)]"
          onClick={() => updateFilters({ page: 1 })}
        >
          {tCommon('search')}
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="w-full shrink-0 lg:w-[17rem]">
          <Card className="overflow-hidden rounded-[1.7rem] border-[#e0e6df] bg-white shadow-[0_18px_45px_rgba(21,45,25,0.06)] lg:sticky lg:top-24">
            <div className="border-b border-[#e7ece6] px-5 py-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-5 text-primary" aria-hidden />
                <h2 className="text-[1.35rem] font-bold tracking-[-0.02em] text-[#17251a]">
                  {tFilters('title')}
                </h2>
              </div>
            </div>

            <div className="space-y-6 p-5">
              <div>
                <p className="text-sm font-semibold text-[#18251a]">{tFilters('location')}</p>
                <div className="mt-3 rounded-2xl border border-[#e4e9e3] bg-[#f7faf5] p-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#2f3a31]">
                    <MapPin className="size-4 text-primary" aria-hidden />
                    <span>{hasLocationSelection ? tFilters('location') : t('locationPlaceholder')}</span>
                  </div>
                  {hasLocationSelection ? (
                    <button
                      type="button"
                      onClick={() => updateFilters({ location: {}, page: 1 })}
                      className="mt-3 inline-flex text-xs font-semibold text-primary hover:underline"
                    >
                      {tFilters('clearLocation')}
                    </button>
                  ) : null}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#18251a]">{tFilters('priceRange')}</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.minPrice ?? ''}
                    onChange={(event) =>
                      updateFilters({
                        minPrice: event.target.value ? Number(event.target.value) : undefined,
                        page: 1,
                      })
                    }
                    placeholder={tFilters('priceMin')}
                    min={0}
                    className="h-11 rounded-xl border border-[#d8ddd8] bg-white px-3 text-sm text-[#18251a] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice ?? ''}
                    onChange={(event) =>
                      updateFilters({
                        maxPrice: event.target.value ? Number(event.target.value) : undefined,
                        page: 1,
                      })
                    }
                    placeholder={tFilters('priceMax')}
                    min={0}
                    className="h-11 rounded-xl border border-[#d8ddd8] bg-white px-3 text-sm text-[#18251a] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#18251a]">{tFilters('category')}</p>
                <div className="mt-3 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => updateFilters({ categoryId: undefined, page: 1 })}
                    className={`flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left text-sm transition ${
                      !filters.categoryId ? 'bg-[#f1f7ee]' : 'hover:bg-[#f7faf5]'
                    }`}
                  >
                    <span
                      className={`flex size-5 items-center justify-center rounded-md border ${
                        !filters.categoryId
                          ? 'border-primary bg-primary text-white'
                          : 'border-[#d6ddd7] bg-white'
                      }`}
                    >
                      {!filters.categoryId ? (
                        <span className="block h-2 w-2 rounded-sm bg-white" />
                      ) : null}
                    </span>
                    <span className="font-medium text-[#2f3a31]">{tFilters('all')}</span>
                  </button>

                  {categories.map((category) => {
                    const presentation = getCategoryPresentation(category.name)
                    const active = filters.categoryId === category.id
                    const Icon = presentation.Icon

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => updateFilters({ categoryId: category.id, page: 1 })}
                        className={`flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left text-sm transition ${
                          active ? 'bg-[#f1f7ee]' : 'hover:bg-[#f7faf5]'
                        }`}
                      >
                        <span
                          className={`flex size-5 items-center justify-center rounded-md border ${
                            active ? 'border-primary bg-primary text-white' : 'border-[#d6ddd7] bg-white'
                          }`}
                        >
                          {active ? <span className="block h-2 w-2 rounded-sm bg-white" /> : null}
                        </span>
                        <span className={`flex size-7 items-center justify-center rounded-full ${presentation.iconClassName}`}>
                          <Icon className="size-4" aria-hidden />
                        </span>
                        <span className="font-medium text-[#2f3a31]">{category.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#18251a]">{tFilters('sortBy')}</p>
                <div className="mt-3 relative">
                  <select
                    value={filters.sort}
                    onChange={(event) => updateFilters({ sort: event.target.value, page: 1 })}
                    className="h-11 w-full appearance-none rounded-xl border border-[#d8ddd8] bg-white px-3 pr-10 text-sm text-[#18251a] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  >
                    <option value="newest">{t('sortNewest')}</option>
                    <option value="price_asc">{t('sortPriceAsc')}</option>
                    <option value="price_desc">{t('sortPriceDesc')}</option>
                  </select>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                className="h-11 w-full rounded-xl bg-[#edf4ea] font-bold text-primary hover:bg-[#e6f0e2]"
                onClick={clearAllFilters}
              >
                <X className="size-4" aria-hidden />
                {tFilters('clear')}
              </Button>
            </div>
          </Card>
        </aside>

        <div className="min-w-0 flex-1">
          <Card className="overflow-hidden rounded-[1.7rem] border-[#e1e7df] bg-white shadow-[0_20px_50px_rgba(21,45,25,0.05)]">
            <div className="border-b border-[#e8ede8] px-4 py-4 sm:px-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="-mx-1 flex items-center gap-1 overflow-x-auto px-1 pb-1">
                  <button
                    type="button"
                    onClick={() => updateFilters({ categoryId: undefined, page: 1 })}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                      !filters.categoryId
                        ? 'border-[#d7e8d2] bg-[#eff8eb] text-primary'
                        : 'border-transparent text-[#3d483f] hover:bg-[#f6f9f5]'
                    }`}
                  >
                    <span className="flex size-7 items-center justify-center rounded-full bg-[#edf6eb] text-primary">
                      <Grid2x2 className="size-4" aria-hidden />
                    </span>
                    {tFilters('all')}
                  </button>

                  {categories.map((category) => {
                    const presentation = getCategoryPresentation(category.name)
                    const active = filters.categoryId === category.id
                    const Icon = presentation.Icon

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => updateFilters({ categoryId: category.id, page: 1 })}
                        className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                          active
                            ? `border-[#d7e8d2] ${presentation.activeClassName}`
                            : 'border-transparent text-[#3d483f] hover:bg-[#f6f9f5]'
                        }`}
                      >
                        <span className={`flex size-7 items-center justify-center rounded-full ${presentation.iconClassName}`}>
                          <Icon className="size-4" aria-hidden />
                        </span>
                        {category.name}
                      </button>
                    )
                  })}
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <p className="text-sm font-medium text-[#5d6a60]">
                    {tCommon('resultsCount', { count: resultsCount })}
                  </p>
                  <div className="flex items-center gap-1 rounded-xl border border-[#e3e8e2] bg-[#f8faf7] p-1">
                    <button
                      type="button"
                      aria-label={t('gridView')}
                      className="flex size-9 items-center justify-center rounded-lg bg-[#e8f3e3] text-primary"
                    >
                      <Grid2x2 className="size-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      aria-label={t('listView')}
                      className="flex size-9 items-center justify-center rounded-lg text-[#78837a]"
                    >
                      <LayoutList className="size-4" aria-hidden />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {isError ? (
                <Card className="rounded-2xl border-[#e3e8e2] p-8 text-center shadow-none">
                  <p className="text-muted">{tCommon('error')}</p>
                  <Button className="mt-4" onClick={() => refetch()}>
                    {tCommon('retry')}
                  </Button>
                </Card>
              ) : null}

              {!isError ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {isPending
                    ? Array.from({ length: 8 }).map((_, index) => (
                        <Card
                          key={index}
                          className="h-[22rem] rounded-[1.4rem] border-[#edf1ec] bg-[#f8faf7] animate-pulse"
                        />
                      ))
                    : data?.items.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
                </div>
              ) : null}

              {!isPending && !isError && data?.items.length === 0 ? (
                <Card className="rounded-2xl border-dashed border-[#d8dfd7] bg-[#fbfcfa] p-10 text-center shadow-none">
                  <p className="text-sm text-[#667367]">{tCommon('noResults')}</p>
                  {hasActiveFilters ? (
                    <Button className="mt-4" variant="outline" onClick={clearAllFilters}>
                      {tFilters('clear')}
                    </Button>
                  ) : null}
                </Card>
              ) : null}

              {data && data.meta.total > 0 ? (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    className="size-10 rounded-xl border-[#dfe5df] bg-white p-0 text-sm text-[#334034]"
                    aria-label={tCommon('prev')}
                    disabled={filters.page <= 1 || isPending}
                    onClick={() => updateFilters({ page: Math.max(1, filters.page - 1) })}
                  >
                    <ChevronLeft className="size-4" aria-hidden />
                  </Button>

                  {paginationItems.map((item, index) =>
                    item === 'ellipsis' ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="flex size-10 items-center justify-center text-sm text-[#7d867f]"
                      >
                        ...
                      </span>
                    ) : (
                      <Button
                        key={item}
                        variant={filters.page === item ? 'primary' : 'outline'}
                        className={`size-10 rounded-xl p-0 text-sm font-bold ${
                          filters.page === item
                            ? 'shadow-[0_12px_20px_rgba(27,94,32,0.16)]'
                            : 'border-[#dfe5df] bg-white text-[#28332a]'
                        }`}
                        disabled={isPending}
                        onClick={() => updateFilters({ page: item })}
                      >
                        {item}
                      </Button>
                    )
                  )}

                  <Button
                    variant="outline"
                    className="size-10 rounded-xl border-[#dfe5df] bg-white p-0 text-sm text-[#334034]"
                    aria-label={tCommon('next')}
                    disabled={filters.page >= pageCount || isPending}
                    onClick={() => updateFilters({ page: filters.page + 1 })}
                  >
                    <ChevronRight className="size-4" aria-hidden />
                  </Button>
                </div>
              ) : null}
            </div>
          </Card>
        </div>
      </div>
    </Container>
  )
}
