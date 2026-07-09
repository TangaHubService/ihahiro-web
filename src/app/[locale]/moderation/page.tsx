import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { ModerationDashboard } from '@/features/moderation/ModerationDashboard'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'moderation' })
  return { title: t('title') }
}

export default async function ModerationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-[#f7f8f5]">
        <ModerationDashboard />
      </main>
      <Footer />
    </div>
  )
}
