'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { ChatThreadList } from '@/components/chat/ChatThreadList'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { Container } from '@/components/layout/Container'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/hooks/useAuth'
import { useChatThreads } from '@/hooks/useChatThreads'
import { useRouter } from '@/i18n/navigation'
import type { ChatThreadListItem } from '@/lib/api/chat'
import { cn } from '@/lib/utils/cn'
import { MessageCircle } from 'lucide-react'

export function ChatPageClient({ threadId }: { threadId?: string }) {
  const t = useTranslations('chat')
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()
  const { data: threads, refetch: refetchThreads } = useChatThreads()

  const selected: ChatThreadListItem | null =
    (threadId && threads?.find((thread) => thread.id === threadId)) || null

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace('/login?redirect=%2Fchat')
    }
  }, [isAuthLoading, isAuthenticated, router])

  // A thread just created via "Message seller" may not be in the polled list yet — force a refetch.
  useEffect(() => {
    if (threadId && threads && !threads.some((thread) => thread.id === threadId)) {
      refetchThreads()
    }
  }, [threadId, threads, refetchThreads])

  function handleSelect(thread: ChatThreadListItem) {
    router.push(`/chat/${thread.id}`)
  }

  function handleBack() {
    router.push('/chat')
  }

  if (isAuthLoading || !isAuthenticated) {
    return (
      <Container className="py-10">
        <div className="h-[32rem] animate-pulse rounded-2xl bg-[#f2f5f1]" />
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <h1 className="text-[2.15rem] font-black leading-none tracking-[-0.04em] text-primary sm:text-[2.6rem]">
        {t('title')}
      </h1>

      <div className="mt-6 grid h-[36rem] overflow-hidden rounded-2xl border border-[#e1e7df] bg-white shadow-[0_14px_40px_rgba(21,45,25,0.04)] lg:grid-cols-[22rem_minmax(0,1fr)]">
        <div className={cn('min-h-0 overflow-y-auto border-[#eaefe8] lg:border-r', selected ? 'hidden lg:block' : 'block')}>
          <ChatThreadList activeThreadId={selected?.id} onSelect={handleSelect} />
        </div>

        <div className={cn('min-h-0', selected ? 'block' : 'hidden lg:block')}>
          {selected ? (
            <ChatWindow thread={selected} onBack={handleBack} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
              <MessageCircle className="size-10 text-primary/30" aria-hidden />
              <EmptyState
                className="border-none bg-transparent shadow-none"
                title={t('noThreadSelectedTitle')}
                description={t('noThreadSelectedDescription')}
              />
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
