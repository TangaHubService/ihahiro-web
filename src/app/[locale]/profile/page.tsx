import { UserDashboardShell } from '@/components/layout/UserDashboardShell'
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
    <UserDashboardShell title={t('title')}>
      <div className="grid max-w-3xl gap-6">
        <ProfileForm />
        <MyListingsSection />
      </div>
    </UserDashboardShell>
  )
}
