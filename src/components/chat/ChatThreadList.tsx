'use client'

import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils/cn'
import { getInitials } from '@/lib/utils/getInitials'
import type { ChatThreadListItem } from '@/lib/api/chat'
import { useChatThreads } from '@/hooks/useChatThreads'
import { useTranslations } from 'next-intl'
import { MessageSquare } from 'lucide-react'

function formatThreadTime(value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const isToday = date.toDateString() === new Date().toDateString()
  return isToday
    ? date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

export type ChatThreadListProps = {
  activeThreadId?: string
  onSelect: (thread: ChatThreadListItem) => void
}

export function ChatThreadList({ activeThreadId, onSelect }: ChatThreadListProps) {
  const t = useTranslations('chat')
  const { data: threads, isPending, isError } = useChatThreads()

  if (isPending) {
    return (
      <div className="space-y-2 p-3">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (isError) {
    return <p className="p-4 text-sm text-accent">{t('threadsError')}</p>
  }

  if (!threads || threads.length === 0) {
    return (
      <EmptyState
        className="m-3 border-none bg-transparent shadow-none"
        title={t('threadsEmptyTitle')}
        description={t('threadsEmptyDescription')}
      />
    )
  }

  return (
    <ul className="divide-y divide-[#eaefe8]">
      {threads.map((thread) => {
        const name = thread.otherUser
          ? `${thread.otherUser.firstName} ${thread.otherUser.lastName}`.trim()
          : t('unknownUser')
        const active = thread.id === activeThreadId

        return (
          <li key={thread.id}>
            <button
              type="button"
              onClick={() => onSelect(thread)}
              className={cn(
                'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#f5f8f3]',
                active && 'bg-[#eff6ec]'
              )}
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#edf7ea_0%,#dbead4_100%)] text-sm font-black text-primary">
                {getInitials(name)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate font-bold text-[#18251a]">{name}</span>
                  <span className="shrink-0 text-xs text-[#7c877e]">
                    {formatThreadTime(thread.lastMessageAt ?? thread.createdAt)}
                  </span>
                </span>
                {thread.listing ? (
                  <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-[#5f6c61]">
                    <MessageSquare className="size-3 shrink-0" aria-hidden />
                    {thread.listing.title}
                  </span>
                ) : null}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
