'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { moderationApi, type PendingProduct } from '@/lib/api/moderation'
import { queryKeys } from '@/lib/queryKeys'
import { getErrorMessage } from '@/lib/utils/getErrorMessage'
import { useToast } from '@/providers/ToastProvider'
import { Loader2 } from 'lucide-react'

type SortKey = 'name' | 'createdAt'
type SortDir = 'asc' | 'desc'

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function PendingProductsPanel() {
  const t = useTranslations('moderation')
  const tCommon = useTranslations('common')
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.moderation.pendingProducts,
    queryFn: moderationApi.pendingProducts,
  })

  const approveMutation = useMutation({
    mutationFn: (id: string) => moderationApi.approveProduct(id),
    onSuccess: () => {
      toast({ variant: 'success', description: t('approveSuccess') })
      queryClient.invalidateQueries({ queryKey: queryKeys.moderation.pendingProducts })
      queryClient.invalidateQueries({ queryKey: queryKeys.moderation.stats })
    },
    onError: (error) => {
      toast({ variant: 'error', description: getErrorMessage(error, t('actionError')) })
    },
  })

  const visibleProducts = useMemo(() => {
    if (!data) return []

    const fromTime = dateFrom ? new Date(dateFrom).getTime() : null
    const toTime = dateTo ? new Date(dateTo).getTime() : null

    const filtered = data.filter((product) => {
      const createdTime = new Date(product.createdAt).getTime()
      if (fromTime !== null && createdTime < fromTime) return false
      if (toTime !== null && createdTime > toTime + 24 * 60 * 60 * 1000 - 1) return false
      return true
    })

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0
      if (sortKey === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return sortDir === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [data, dateFrom, dateTo, sortKey, sortDir])

  if (isPending) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (isError) {
    return <p className="text-sm text-accent">{t('loadError')}</p>
  }

  if (!data || data.length === 0) {
    return <EmptyState title={t('productsEmptyTitle')} description={t('productsEmptyDescription')} />
  }

  return (
    <div className="space-y-4">
      <Card className="flex flex-wrap items-end gap-4 border-[#e1e7df] p-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="products-date-from" className="text-xs font-semibold text-[#5f6c61]">
            {t('filterDateFrom')}
          </label>
          <input
            id="products-date-from"
            type="date"
            value={dateFrom}
            onChange={(event) => setDateFrom(event.target.value)}
            className="h-10 rounded-lg border border-[#dfe5df] bg-white px-3 text-sm text-foreground outline-none ring-primary/30 focus:ring-2"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="products-date-to" className="text-xs font-semibold text-[#5f6c61]">
            {t('filterDateTo')}
          </label>
          <input
            id="products-date-to"
            type="date"
            value={dateTo}
            onChange={(event) => setDateTo(event.target.value)}
            className="h-10 rounded-lg border border-[#dfe5df] bg-white px-3 text-sm text-foreground outline-none ring-primary/30 focus:ring-2"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="products-sort-key" className="text-xs font-semibold text-[#5f6c61]">
            {t('sortBy')}
          </label>
          <select
            id="products-sort-key"
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value as SortKey)}
            className="h-10 rounded-lg border border-[#dfe5df] bg-white px-3 text-sm text-foreground outline-none ring-primary/30 focus:ring-2"
          >
            <option value="createdAt">{t('sortByDate')}</option>
            <option value="name">{t('sortByName')}</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="products-sort-dir" className="text-xs font-semibold text-[#5f6c61]">
            {t('sortDirection')}
          </label>
          <select
            id="products-sort-dir"
            value={sortDir}
            onChange={(event) => setSortDir(event.target.value as SortDir)}
            className="h-10 rounded-lg border border-[#dfe5df] bg-white px-3 text-sm text-foreground outline-none ring-primary/30 focus:ring-2"
          >
            <option value="desc">{t('sortDescending')}</option>
            <option value="asc">{t('sortAscending')}</option>
          </select>
        </div>

        {dateFrom || dateTo ? (
          <Button
            variant="outline"
            className="h-10 rounded-lg border-[#dfe5df] px-4 text-sm font-semibold text-[#3d483f] hover:bg-[#f5f8f3]"
            onClick={() => {
              setDateFrom('')
              setDateTo('')
            }}
          >
            {t('clearFilters')}
          </Button>
        ) : null}
      </Card>

      {visibleProducts.length === 0 ? (
        <EmptyState title={t('productsEmptyTitle')} description={t('productsFilteredEmptyDescription')} />
      ) : (
        <Card className="overflow-hidden border-[#e1e7df] p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#e1e7df] bg-[#f7faf6] text-xs font-semibold uppercase tracking-wide text-[#5f6c61]">
                  <th className="px-4 py-3">{t('columnId')}</th>
                  <th className="px-4 py-3">{t('columnName')}</th>
                  <th className="px-4 py-3">{t('columnDateAdded')}</th>
                  <th className="px-4 py-3 text-right">{t('columnActions')}</th>
                </tr>
              </thead>
              <tbody>
                {visibleProducts.map((product: PendingProduct) => {
                  const isApprovingThis =
                    approveMutation.isPending && approveMutation.variables === product.id

                  return (
                    <tr key={product.id} className="border-b border-[#eef2ec] last:border-0">
                      <td className="px-4 py-3 font-mono text-xs text-[#5f6c61]" title={product.id}>
                        {product.id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-[#18251a]">{product.name}</p>
                        {product.description ? (
                          <p className="mt-0.5 max-w-md truncate text-xs text-[#5f6c61]">
                            {product.description}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-[#3d483f]">{formatDate(product.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          className="h-9 gap-1.5 rounded-xl px-4 text-sm font-bold"
                          disabled={isApprovingThis}
                          onClick={() => approveMutation.mutate(product.id)}
                        >
                          {isApprovingThis ? (
                            <Loader2 className="size-4 animate-spin" aria-hidden />
                          ) : null}
                          {t('approve')}
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <p className="text-xs text-[#5f6c61]">
        {tCommon('showing')} {visibleProducts.length} / {data.length}
      </p>
    </div>
  )
}
