import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Container } from '@/components/layout/Container'
import { ProfileForm } from '@/components/features/ProfileForm'
import { MyListingsSection } from '@/components/features/MyListingsSection'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'profile' })
  return { title: t('title') }
}

export default async function ProfilePage() {
  const t = await getTranslations('profile')

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-[#f7f8f5]">
        <Container className="py-10">
          <h1 className="text-[2.15rem] font-black leading-none tracking-[-0.04em] text-primary sm:text-[2.6rem]">
            {t('title')}
          </h1>
          <div className="mt-6 grid max-w-3xl gap-6">
            <ProfileForm />
            <MyListingsSection />
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
