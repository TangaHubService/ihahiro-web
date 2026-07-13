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
import { Loader2 } from 'lucide-react'

export function PendingCategoriesPanel() {
  const t = useTranslations('moderation')
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.moderation.pendingCategories,
    queryFn: moderationApi.pendingCategories,
  })

  const approveMutation = useMutation({
    mutationFn: (id: string) => moderationApi.approveCategory(id),
    onSuccess: () => {
      toast({ variant: 'success', description: t('approveSuccess') })
      queryClient.invalidateQueries({ queryKey: queryKeys.moderation.pendingCategories })
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
    return <EmptyState title={t('categoriesEmptyTitle')} description={t('categoriesEmptyDescription')} />
  }

  return (
    <div className="space-y-3">
      {data.map((category) => {
        const isApprovingThis =
          approveMutation.isPending && approveMutation.variables === category.id

        return (
          <Card key={category.id} className="border-[#e1e7df] p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-bold text-[#18251a]">{category.name}</p>
                {category.description ? (
                  <p className="mt-1 truncate text-sm text-[#5f6c61]">{category.description}</p>
                ) : null}
              </div>
              <Button
                className="h-10 shrink-0 gap-1.5 rounded-xl px-4 text-sm font-bold"
                disabled={isApprovingThis}
                onClick={() => approveMutation.mutate(category.id)}
              >
                {isApprovingThis ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
                {t('approve')}
              </Button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
