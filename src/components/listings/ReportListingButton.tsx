'use client'

import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from '@/i18n/navigation'
import { reportsApi, type ReportReason } from '@/lib/api/reports'
import { getErrorMessage } from '@/lib/utils/getErrorMessage'
import { useToast } from '@/providers/ToastProvider'
import { Flag } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const REASONS: ReportReason[] = ['SCAM', 'DUPLICATE', 'INAPPROPRIATE', 'WRONG_INFO', 'OTHER']

export function ReportListingButton({ listingId }: { listingId: string }) {
  const t = useTranslations('listingDetail')
  const tCommon = useTranslations('common')
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<ReportReason>('SCAM')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function openModal() {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/listings/${listingId}`)}`)
      return
    }
    setOpen(true)
  }

  async function handleSubmit() {
    setIsSubmitting(true)
    try {
      await reportsApi.create({ listingId, reason, message: message.trim() || undefined })
      toast({ variant: 'success', description: t('reportSuccess') })
      setOpen(false)
      setMessage('')
      setReason('SCAM')
    } catch (error) {
      toast({ variant: 'error', description: getErrorMessage(error, t('reportError')) })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        className="mt-5 h-11 gap-2 rounded-md border-[#dfe5df] bg-white px-6 font-bold text-primary"
        onClick={openModal}
      >
        <Flag className="size-4" aria-hidden />
        {t('reportCta')}
      </Button>

      <Modal open={open} title={t('reportTitle')} description={t('reportQuestion')} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <Select
            label={t('reportReasonLabel')}
            value={reason}
            onChange={(event) => setReason(event.target.value as ReportReason)}
          >
            {REASONS.map((value) => (
              <option key={value} value={value}>
                {t(`reportReason_${value}`)}
              </option>
            ))}
          </Select>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="report-message">
              {t('reportMessageLabel')}
            </label>
            <textarea
              id="report-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={3}
              maxLength={500}
              className="w-full resize-none rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none ring-primary/30 focus:ring-2"
              placeholder={t('reportMessagePlaceholder')}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-11 rounded-xl">
              {tCommon('cancel')}
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="h-11 rounded-xl px-5 font-bold">
              {isSubmitting ? tCommon('loading') : t('reportCta')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
