import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-[#f7f8f5]">
        <ChatPageClient threadId={threadId?.[0]} />
      </main>
      <Footer />
    </div>
  )
}
