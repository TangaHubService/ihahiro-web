import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { AuthLayout } from '@/components/auth/auth-layout'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return {
    title: t('registerTitle'),
    description: t('registerDescription'),
  }
}

function first(param: string | string[] | undefined) {
  return Array.isArray(param) ? param[0] : param
}

export default async function RegisterPage({ searchParams }: Props) {
  const t = await getTranslations('auth.register')
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const redirect = first(resolvedSearchParams.redirect)
  const loginHref =
    redirect && redirect.startsWith('/') && !redirect.startsWith('//')
      ? `/${redirect}`
      : '/login'

  return (
    <AuthLayout
      pageTitle={t('title')}
      pageSubtitle={t('subtitle')}
      alternatePrompt={t('alternatePrompt')}
      alternateLabel={t('alternateCta')}
      alternateHref={loginHref}
    >
      <RegisterForm />
    </AuthLayout>
  )
}