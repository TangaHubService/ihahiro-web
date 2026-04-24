import { Container } from '@/components/layout/Container'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { PostHarvestForm } from '@/components/features/PostHarvestForm'
import { getTranslations } from 'next-intl/server'

export default async function PostHarvestPage() {
  const tNav = await getTranslations('nav')
  const t = await getTranslations('postHarvest')

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-[#f7f8f5] py-7">
        <Container>
          <p className="text-sm font-medium text-[#566157]">
            {tNav('home')}
            <span className="mx-2 text-[#a8aea9]">/</span>
            <span className="font-bold text-primary">{tNav('postHarvest')}</span>
          </p>

          <div className="mt-5">
            <h1 className="text-[2.45rem] font-black leading-none tracking-[-0.04em] text-primary sm:text-[3rem]">
              {tNav('postHarvest')}
            </h1>
            <p className="mt-3 max-w-2xl text-[1.03rem] leading-relaxed text-[#505b52]">
              {t('subtitle')}
            </p>
          </div>

          <div className="mt-4">
            <PostHarvestForm />
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
