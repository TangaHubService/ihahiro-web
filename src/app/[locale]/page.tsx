import { HomeBottomCta } from '@/components/home/HomeBottomCta'
import { HomeFeaturedGrid } from '@/components/home/HomeFeaturedGrid'
import { HomeHero } from '@/components/home/HomeHero'
import { HomeHowItWorks } from '@/components/home/HomeHowItWorks'
import { HomeLiveMarketStrip } from '@/components/home/HomeLiveMarketStrip'
import { HomeValueProps } from '@/components/home/HomeValueProps'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
  }
}

export default async function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HomeHero />
        <HomeHowItWorks />
        <HomeFeaturedGrid />
        <HomeLiveMarketStrip />
        <HomeValueProps />
        <HomeBottomCta />
      </main>
      <Footer />
    </div>
  )
}
