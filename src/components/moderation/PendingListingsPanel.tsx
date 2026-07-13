'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { ListingDetailDrawer } from '@/components/moderation/ListingDetailDrawer'
import { moderationApi } from '@/lib/api/moderation'
import { queryKeys } from '@/lib/queryKeys'
import { getErrorMessage } from '@/lib/utils/getErrorMessage'
import { useToast } from '@/providers/ToastProvider'
import { Eye, Loader2 } from 'lucide-react'

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function PendingListingsPanel() {
  const t = useTranslations('moderation')
  const tCommon = useTranslations('common')
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [rejectTarget, setRejectTarget] = useState<{
    id: string
    title: string
  } | null>(null)
  const [reason, setReason] = useState('')
  const [detailId, setDetailId] = useState<string | null>(null)

  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.moderation.pendingListings(page),
    queryFn: () => moderationApi.pendingListings(page, 10),
  })

  function invalidate() {
    queryClient.invalidateQueries({
      queryKey: ['moderation', 'pending-listings'],
    })
    queryClient.invalidateQueries({ queryKey: queryKeys.moderation.stats })
  }

  const approveMutation = useMutation({
    mutationFn: (id: string) => moderationApi.approveListing(id),
    onSuccess: () => {
      toast({ variant: 'success', description: t('approveSuccess') })
      invalidate()
    },
    onError: (error) => {
      toast({
        variant: 'error',
        description: getErrorMessage(error, t('actionError')),
      })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      moderationApi.rejectListing(id, reason),
    onSuccess: () => {
      toast({ variant: 'success', description: t('rejectSuccess') })
      setRejectTarget(null)
      setReason('')
      invalidate()
    },
    onError: (error) => {
      toast({
        variant: 'error',
        description: getErrorMessage(error, t('actionError')),
      })
    },
  })

  if (isPending) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    )
  }

  if (isError) {
    return <p className="text-sm text-accent">{t('loadError')}</p>
  }

  if (!data || data.items.length === 0) {
    return (
      <EmptyState
        title={t('listingsEmptyTitle')}
        description={t('listingsEmptyDescription')}
      />
    )
  }

  return (
    <div className="space-y-3">
      {data.items.map((listing) => {
        const sellerName = listing.seller
          ? `${listing.seller.firstName} ${listing.seller.lastName}`.trim()
          : t('unknownSeller')
        const isApprovingThis =
          approveMutation.isPending && approveMutation.variables === listing.id
        const isRejectingThis =
          rejectMutation.isPending && rejectMutation.variables?.id === listing.id

        return (
          <Card key={listing.id} className="border-[#e1e7df] p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-bold text-[#18251a]">{listing.title}</p>
                <p className="mt-1 text-sm text-[#5f6c61]">
                  {listing.product?.name ?? '—'} · {sellerName} ·{' '}
                  {formatDate(listing.createdAt)}
                </p>
                <p className="mt-1 text-sm font-semibold text-primary">
                  {listing.price} {tCommon('currency')}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  variant="outline"
                  className="h-10 gap-1.5 rounded-xl border-[#dfe5df] px-4 text-sm font-bold text-[#3d483f] hover:bg-[#f5f8f3]"
                  onClick={() => setDetailId(listing.id)}
                >
                  <Eye className="size-4" aria-hidden />
                  {t('viewDetails')}
                </Button>
                <Button
                  variant="outline"
                  className="h-10 gap-1.5 rounded-xl border-[#dfe5df] px-4 text-sm font-bold text-accent hover:bg-[#fff6f4]"
                  disabled={isRejectingThis}
                  onClick={() => setRejectTarget(listing)}
                >
                  {isRejectingThis ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
                  {t('reject')}
                </Button>
                <Button
                  className="h-10 gap-1.5 rounded-xl px-4 text-sm font-bold"
                  disabled={isApprovingThis}
                  onClick={() => approveMutation.mutate(listing.id)}
                >
                  {isApprovingThis ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
                  {t('approve')}
                </Button>
              </div>
            </div>
          </Card>
        )
      })}

      {data.meta.totalPages > 1 ? (
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            className="h-10 rounded-xl px-4 text-sm font-semibold"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {tCommon('prev')}
          </Button>
          <p className="text-sm text-[#5f6c61]">
            {tCommon('page')} {data.meta.page} / {data.meta.totalPages}
          </p>
          <Button
            variant="outline"
            className="h-10 rounded-xl px-4 text-sm font-semibold"
            disabled={page >= data.meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            {tCommon('next')}
          </Button>
        </div>
      ) : null}

      <Modal
        open={Boolean(rejectTarget)}
        title={t('rejectTitle')}
        description={rejectTarget?.title}
        onClose={() => {
          setRejectTarget(null)
          setReason('')
        }}
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="reject-reason"
            >
              {t('reasonLabel')}
            </label>
            <textarea
              id="reject-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={3}
              maxLength={500}
              className="w-full resize-none rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none ring-primary/30 focus:ring-2"
              placeholder={t('reasonPlaceholder')}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setRejectTarget(null)
                setReason('')
              }}
              className="h-11 rounded-xl"
            >
              {tCommon('cancel')}
            </Button>
            <Button
              type="button"
              onClick={() =>
                rejectTarget &&
                rejectMutation.mutate({
                  id: rejectTarget.id,
                  reason: reason.trim(),
                })
              }
              disabled={!reason.trim() || rejectMutation.isPending}
              className="h-11 rounded-xl px-5 font-bold"
            >
              {rejectMutation.isPending ? tCommon('loading') : t('reject')}
            </Button>
          </div>
        </div>
      </Modal>

      <ListingDetailDrawer
        listingId={detailId}
        onClose={() => setDetailId(null)}
        isApproving={approveMutation.isPending}
        onApprove={(id) => {
          setDetailId(null)
          approveMutation.mutate(id)
        }}
        onReject={(target) => {
          setDetailId(null)
          setRejectTarget(target)
        }}
      />
    </div>
  )
}
