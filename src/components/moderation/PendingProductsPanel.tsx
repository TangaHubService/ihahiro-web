'use client'

import { useTranslations } from 'next-intl'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { moderationApi } from '@/lib/api/moderation'
import { queryKeys } from '@/lib/queryKeys'
import { getErrorMessage } from '@/lib/utils/getErrorMessage'
import { useToast } from '@/providers/ToastProvider'

export function PendingProductsPanel() {
  const t = useTranslations('moderation')
  const { toast } = useToast()
  const queryClient = useQueryClient()

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

  if (isPending) {
    return (
      <div className="space-y-3">
        {[0, 1].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
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
    <div className="space-y-3">
      {data.map((product) => (
        <Card key={product.id} className="border-[#e1e7df] p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-bold text-[#18251a]">{product.name}</p>
              {product.description ? (
                <p className="mt-1 truncate text-sm text-[#5f6c61]">{product.description}</p>
              ) : null}
            </div>
            <Button
              className="h-10 shrink-0 rounded-xl px-4 text-sm font-bold"
              disabled={approveMutation.isPending}
              onClick={() => approveMutation.mutate(product.id)}
            >
              {t('approve')}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
