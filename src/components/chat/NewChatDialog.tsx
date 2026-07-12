'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { MapPin, MessageCircle } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAuth } from '@/hooks/useAuth'
import { useListings } from '@/hooks/useListings'
import { useRouter } from '@/i18n/navigation'
import { chatApi } from '@/lib/api/chat'
import type { ListingSeller } from '@/lib/api/listings'
import { getErrorMessage } from '@/lib/utils/getErrorMessage'
import { getInitials } from '@/lib/utils/getInitials'
import { useToast } from '@/providers/ToastProvider'

export type NewChatDialogProps = {
  open: boolean
  onClose: () => void
}

export function NewChatDialog({ open, onClose }: NewChatDialogProps) {
  const t = useTranslations('chat')
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [startingId, setStartingId] = useState<string | null>(null)

  const { data, isPending, isError } = useListings({
    status: 'PUBLISHED',
    limit: 40,
  })

  const sellers = useMemo(() => {
    const seen = new Map<string, ListingSeller>()
    for (const listing of data?.items ?? []) {
      if (listing.seller.id === user?.id) continue
      if (!seen.has(listing.seller.id)) seen.set(listing.seller.id, listing.seller)
    }
    return Array.from(seen.values())
  }, [data, user?.id])

  async function handleSelect(seller: ListingSeller) {
    setStartingId(seller.id)
    try {
      const thread = await chatApi.createThread({ recipientId: seller.id })
      onClose()
      router.push(`/chat/${thread.id}`)
    } catch (error) {
      toast({ variant: 'error', description: getErrorMessage(error, t('startError')) })
    } finally {
      setStartingId(null)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t('newChatTitle')} description={t('newChatDescription')}>
      {isPending ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-accent">{t('threadsError')}</p>
      ) : sellers.length === 0 ? (
        <p className="text-sm text-[#5f6c61]">{t('newChatEmpty')}</p>
      ) : (
        <ul className="-mx-2 max-h-80 space-y-1 overflow-y-auto">
          {sellers.map((seller) => {
            const name = `${seller.firstName} ${seller.lastName}`.trim()
            const isStarting = startingId === seller.id

            return (
              <li key={seller.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(seller)}
                  disabled={isStarting}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-[#f5f8f3] disabled:opacity-50"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#edf7ea_0%,#dbead4_100%)] text-sm font-black text-primary">
                    {getInitials(name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-[#18251a]">{name}</span>
                    {seller.location ? (
                      <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-[#7a857a]">
                        <MapPin className="size-3 shrink-0" aria-hidden />
                        {seller.location.name}
                      </span>
                    ) : null}
                  </span>
                  <MessageCircle className="size-4 shrink-0 text-primary/60" aria-hidden />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </Modal>
  )
}
