import { LoginForm } from '@/features/auth/components/LoginForm'
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
    title: t('loginTitle'),
    description: t('loginDescription'),
  }
}

function first(param: string | string[] | undefined) {
  return Array.isArray(param) ? param[0] : param
}

export default async function LoginPage({ searchParams }: Props) {
  const t = await getTranslations('auth.login')
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const redirect = first(resolvedSearchParams.redirect)
  const registerHref =
    redirect && redirect.startsWith('/') && !redirect.startsWith('//')
      ? `/${redirect}`
      : '/register'

  return (
    <AuthLayout
      pageTitle={t('title')}
      pageSubtitle={t('subtitle')}
      alternatePrompt={t('alternatePrompt')}
      alternateLabel={t('alternateCta')}
      alternateHref={registerHref}
    >
      <LoginForm />
    </AuthLayout>
  )
}