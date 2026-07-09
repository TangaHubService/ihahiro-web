'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils/cn'
import { getInitials } from '@/lib/utils/getInitials'
import type { ChatThreadListItem } from '@/lib/api/chat'
import { useAuth } from '@/hooks/useAuth'
import { useChatMessages } from '@/hooks/useChatMessages'

function formatMessageTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export type ChatWindowProps = {
  thread: ChatThreadListItem
  onBack?: () => void
}

export function ChatWindow({ thread, onBack }: ChatWindowProps) {
  const t = useTranslations('chat')
  const { user } = useAuth()
  const { messages, isLoading, isError, sendMessage, isSending } = useChatMessages(thread.id)
  const [draft, setDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const otherName = thread.otherUser
    ? `${thread.otherUser.firstName} ${thread.otherUser.lastName}`.trim()
    : t('unknownUser')

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length, thread.id])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const body = draft.trim()
    if (!body || isSending) return
    sendMessage(body)
    setDraft('')
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center gap-3 border-b border-[#eaefe8] px-4 py-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-[#617063] transition hover:bg-[#f4f7f3] hover:text-primary lg:hidden"
            aria-label={t('back')}
          >
            <ArrowLeft className="size-4" aria-hidden />
          </button>
        ) : null}
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#edf7ea_0%,#dbead4_100%)] text-xs font-black text-primary">
          {getInitials(otherName)}
        </span>
        <div className="min-w-0">
          <p className="truncate font-bold text-[#18251a]">{otherName}</p>
          {thread.listing ? (
            <p className="truncate text-xs text-[#5f6c61]">{thread.listing.title}</p>
          ) : null}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="ml-auto h-10 w-1/2" />
            <Skeleton className="h-10 w-3/5" />
          </div>
        ) : isError ? (
          <p className="text-sm text-accent">{t('messagesError')}</p>
        ) : messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#7c877e]">{t('noMessagesYet')}</p>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => {
              const mine = message.senderId === user?.id
              return (
                <div key={message.id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-6',
                      mine
                        ? 'rounded-br-sm bg-primary text-primary-foreground'
                        : 'rounded-bl-sm bg-[#f1f4ef] text-[#222b24]'
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.body}</p>
                    <p className={cn('mt-1 text-[0.65rem]', mine ? 'text-primary-foreground/70' : 'text-[#8b968d]')}>
                      {formatMessageTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex shrink-0 items-end gap-2 border-t border-[#eaefe8] p-3">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              handleSubmit(event)
            }
          }}
          rows={1}
          placeholder={t('messagePlaceholder')}
          className="max-h-32 min-h-[2.75rem] flex-1 resize-none rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none ring-primary/30 focus:ring-2"
        />
        <Button type="submit" disabled={!draft.trim() || isSending} className="h-11 shrink-0 gap-2 rounded-xl px-4">
          <Send className="size-4" aria-hidden />
          <span className="hidden sm:inline">{t('send')}</span>
        </Button>
      </form>
    </div>
  )
}
