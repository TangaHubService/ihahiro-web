import { Container } from '@/components/layout/Container'
import { Link } from '@/i18n/navigation'
import { Search, User } from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

export async function HomeBottomCta() {
  const t = await getTranslations('home')
  const tNav = await getTranslations('nav')

  return (
    <section className="bg-white py-8 md:py-10">
      <Container>
        <div className="relative overflow-hidden rounded-[1.35rem] bg-primary text-white shadow-[0_18px_42px_rgba(17,60,22,0.18)]">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-[13rem] md:block"
            aria-hidden
          >
            <Image
              src="/home-products/cta-farmer.png"
              alt=""
              fill
              className="object-cover object-left"
              sizes="205px"
            />
          </div>
          <div
            className="pointer-events-none absolute -right-12 -top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-[-4rem] right-6 h-32 w-32 rounded-full bg-[#2d7f37]/60 blur-3xl"
            aria-hidden
          />

          <div className="relative grid gap-6 px-6 py-7 md:grid-cols-[13rem_minmax(0,1fr)] md:px-8 lg:grid-cols-[13rem_minmax(0,1fr)_auto] lg:items-center lg:px-10">
            <div className="hidden md:block" />
            <div className="max-w-2xl">
              <h2 className="text-2xl font-black leading-tight md:text-[2rem]">
                {t('bottomCtaTitle')}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
                {t('bottomCtaBody')}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                href="/register"
                className="inline-flex h-12 min-w-[200px] items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-primary shadow-sm transition-colors hover:bg-[#f4f8f2]"
              >
                <User className="size-4 shrink-0" aria-hidden />
                {tNav('register')}
              </Link>
              <Link
                href="/listings"
                className="inline-flex h-12 min-w-[200px] items-center justify-center gap-2 rounded-xl border border-white/70 bg-transparent px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Search className="size-4 shrink-0" aria-hidden />
                {t('ctaMarket')}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
