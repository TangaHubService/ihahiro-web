import { UserDashboardShell } from '@/components/layout/UserDashboardShell'
import { ChatPageClient } from '@/features/chat/ChatPageClient'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'chat' })
  return { title: t('title') }
}

export default async function ChatPage({
  params,
}: {
  params: Promise<{ threadId?: string[] }>
}) {
  const { threadId } = await params
  const t = await getTranslations('chat')

  return (
    <UserDashboardShell title={t('title')}>
      <ChatPageClient threadId={threadId?.[0]} />
    </UserDashboardShell>
  )
}
