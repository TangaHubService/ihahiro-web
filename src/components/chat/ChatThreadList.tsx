'use client'

import { useState } from 'react'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils/cn'
import { getInitials } from '@/lib/utils/getInitials'
import type { ChatThreadListItem } from '@/lib/api/chat'
import { useChatThreads } from '@/hooks/useChatThreads'
import { useTranslations } from 'next-intl'
import { MessageSquare, SquarePen } from 'lucide-react'
import { NewChatDialog } from '@/components/chat/NewChatDialog'

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
  const [newChatOpen, setNewChatOpen] = useState(false)

  const newChatButton = (
    <button
      type="button"
      onClick={() => setNewChatOpen(true)}
      className="inline-flex items-center gap-1.5 rounded-full bg-[#eff6ec] px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-[#e2f0db]"
    >
      <SquarePen className="size-3.5" aria-hidden />
      {t('newChatButton')}
    </button>
  )

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-[#eaefe8] px-4 py-3">
        <h2 className="text-sm font-black text-[#18251a]">{t('title')}</h2>
        {newChatButton}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isPending ? (
          <div className="space-y-2 p-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : isError ? (
          <p className="p-4 text-sm text-accent">{t('threadsError')}</p>
        ) : !threads || threads.length === 0 ? (
          <EmptyState
            className="m-3 border-none bg-transparent shadow-none"
            title={t('threadsEmptyTitle')}
            description={t('threadsEmptyDescription')}
            action={newChatButton}
          />
        ) : (
          <ChatThreadItems threads={threads} activeThreadId={activeThreadId} onSelect={onSelect} />
        )}
      </div>

      <NewChatDialog open={newChatOpen} onClose={() => setNewChatOpen(false)} />
    </div>
  )
}

function ChatThreadItems({
  threads,
  activeThreadId,
  onSelect,
}: {
  threads: ChatThreadListItem[]
  activeThreadId?: string
  onSelect: (thread: ChatThreadListItem) => void
}) {
  const t = useTranslations('chat')

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
