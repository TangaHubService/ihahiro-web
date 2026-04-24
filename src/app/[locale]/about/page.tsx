import { Container } from '@/components/layout/Container'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { Link } from '@/i18n/navigation'
import {
  BarChart3,
  Handshake,
  Leaf,
  Mail,
  ShieldCheck,
  Smartphone,
  Sprout,
  Users,
} from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

const goals = [
  {
    Icon: Users,
    titleKey: 'goalConnectTitle',
    bodyKey: 'goalConnectBody',
  },
  {
    Icon: Sprout,
    titleKey: 'goalValueTitle',
    bodyKey: 'goalValueBody',
  },
  {
    Icon: BarChart3,
    titleKey: 'goalGrowthTitle',
    bodyKey: 'goalGrowthBody',
  },
  {
    Icon: Leaf,
    titleKey: 'goalSustainableTitle',
    bodyKey: 'goalSustainableBody',
  },
] as const

const approach = [
  {
    Icon: Smartphone,
    titleKey: 'approachTechTitle',
    bodyKey: 'approachTechBody',
  },
  {
    Icon: BarChart3,
    titleKey: 'approachMarketTitle',
    bodyKey: 'approachMarketBody',
  },
  {
    Icon: Handshake,
    titleKey: 'approachPartnersTitle',
    bodyKey: 'approachPartnersBody',
  },
  {
    Icon: ShieldCheck,
    titleKey: 'approachSafetyTitle',
    bodyKey: 'approachSafetyBody',
  },
] as const

export default async function AboutPage() {
  const tNav = await getTranslations('nav')
  const t = await getTranslations('aboutPage')

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-[#f7f8f5]">
        <section className="relative overflow-hidden bg-white">
          <Container className="grid min-h-[22rem] gap-8 py-12 md:grid-cols-[0.82fr_1.18fr] md:items-center md:py-14">
            <div className="relative z-10">
              <h1 className="text-[2.55rem] font-black leading-none tracking-[-0.04em] text-primary sm:text-[3.25rem]">
                {tNav('about')}
              </h1>
              <p className="mt-5 max-w-md text-[1.05rem] leading-8 text-[#303b33]">
                {t('intro1')}
              </p>
              <p className="mt-5 max-w-md text-[1.05rem] leading-8 text-[#303b33]">
                {t('intro2')}
              </p>
            </div>
            <div className="relative min-h-[20rem] overflow-hidden rounded-none md:absolute md:inset-y-0 md:right-0 md:w-[58%]">
              <Image
                src="/hero.png"
                alt=""
                fill
                preload
                unoptimized
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 58vw"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-white via-white/45 to-transparent"
                aria-hidden
              />
            </div>
          </Container>
        </section>

        <Container className="py-8">
          <section className="rounded-xl border border-[#dfe5df] bg-white p-6 shadow-[0_16px_50px_rgba(21,45,25,0.04)]">
            <h2 className="text-center text-2xl font-black text-primary">
              {t('goalsTitle')}
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {goals.map(({ Icon, titleKey, bodyKey }, index) => (
                <article
                  key={titleKey}
                  className={`px-5 py-4 text-center ${
                    index < goals.length - 1
                      ? 'md:border-r md:border-[#dce5db]'
                      : ''
                  }`}
                >
                  <Icon
                    className="mx-auto size-12 text-primary"
                    strokeWidth={1.7}
                  />
                  <h3 className="mt-4 font-black text-[#18251a]">
                    {t(titleKey)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#58645b]">
                    {t(bodyKey)}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-xl border border-[#dfe5df] bg-[#f1f6ef] p-6">
            <h2 className="text-center text-2xl font-black text-primary">
              {t('approachTitle')}
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {approach.map(({ Icon, titleKey, bodyKey }) => (
                <article
                  key={titleKey}
                  className="rounded-xl border border-[#e3e9e2] bg-white p-5 text-center shadow-[0_10px_30px_rgba(21,45,25,0.04)]"
                >
                  <Icon
                    className="mx-auto size-10 text-primary"
                    strokeWidth={1.7}
                  />
                  <h3 className="mt-4 font-black text-[#18251a]">
                    {t(titleKey)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#58645b]">
                    {t(bodyKey)}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8 grid overflow-hidden rounded-xl bg-white shadow-[0_16px_50px_rgba(21,45,25,0.05)] md:grid-cols-[0.85fr_1.15fr]">
            <div className="p-7">
              <h2 className="text-2xl font-black text-primary">
                {t('teamTitle')}
              </h2>
              <p className="mt-4 max-w-lg leading-relaxed text-[#4f5a52]">
                {t('teamBody')}
              </p>
              <Link href="/contact" className="mt-6 inline-flex">
                <Button className="h-11 gap-2 rounded-md px-6 font-bold">
                  <Mail className="size-4" aria-hidden />
                  {t('contactButton')}
                </Button>
              </Link>
            </div>
            <div className="relative min-h-64 bg-[#dce5d9]">
              <Image
                src="/hero.png"
                alt=""
                fill
                unoptimized
                className="object-cover object-[70%_center]"
                sizes="(max-width: 768px) 100vw, 55vw"
              />
            </div>
          </section>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
