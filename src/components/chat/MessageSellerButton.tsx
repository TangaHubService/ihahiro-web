'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from '@/i18n/navigation'
import { chatApi } from '@/lib/api/chat'
import { getErrorMessage } from '@/lib/utils/getErrorMessage'
import { useToast } from '@/providers/ToastProvider'

export type MessageSellerButtonProps = {
  sellerId: string
  listingId: string
}

export function MessageSellerButton({ sellerId, listingId }: MessageSellerButtonProps) {
  const t = useTranslations('chat')
  const tCommon = useTranslations('common')
  const { isAuthenticated, user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isStarting, setIsStarting] = useState(false)

  if (isAuthenticated && user?.id === sellerId) {
    return null
  }

  async function handleClick() {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/listings/${listingId}`)}`)
      return
    }

    setIsStarting(true)
    try {
      const thread = await chatApi.createThread({ recipientId: sellerId, listingId })
      router.push(`/chat/${thread.id}`)
    } catch (error) {
      toast({ variant: 'error', description: getErrorMessage(error, t('startError')) })
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleClick}
      disabled={isStarting}
      className="h-12 w-full gap-2 rounded-md bg-[#eef4ec] text-base font-black text-primary"
    >
      <MessageCircle className="size-5" aria-hidden />
      {isStarting ? tCommon('loading') : tCommon('message')}
    </Button>
  )
}
