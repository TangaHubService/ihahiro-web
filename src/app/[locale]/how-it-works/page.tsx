import { Container } from '@/components/layout/Container'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { Link } from '@/i18n/navigation'
import {
  Clock3,
  MapPin,
  Search,
  Shield,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

const steps = [
  {
    image: '/how-it-work1.jpg',
    titleKey: 'step1Title',
    bodyKey: 'step1Body',
  },
  {
    image: '/how-it-work2.jpg',
    titleKey: 'step2Title',
    bodyKey: 'step2Body',
  },
  {
    image: '/how-it-work3.jpg',
    titleKey: 'step3Title',
    bodyKey: 'step3Body',
  },
  {
    image: '/logo.png',
    titleKey: 'step4Title',
    bodyKey: 'step4Body',
  },
] as const

const benefits = [
  {
    Icon: Clock3,
    titleKey: 'benefitFastTitle',
    bodyKey: 'benefitFastBody',
  },
  {
    Icon: MapPin,
    titleKey: 'benefitNearbyTitle',
    bodyKey: 'benefitNearbyBody',
  },
  {
    Icon: Shield,
    titleKey: 'benefitInfoTitle',
    bodyKey: 'benefitInfoBody',
  },
  {
    Icon: ShieldCheck,
    titleKey: 'benefitTrustTitle',
    bodyKey: 'benefitTrustBody',
  },
] as const

export default async function HowItWorksPage() {
  const tNav = await getTranslations('nav')
  const t = await getTranslations('howPage')

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-[#f7f8f5]">
        <Container className="py-10">
          <section>
            <h1 className="text-[2.55rem] font-black leading-none tracking-[-0.04em] text-primary sm:text-[3.25rem]">
              {tNav('howItWorks')}
            </h1>
            <p className="mt-3 max-w-3xl text-[1.02rem] leading-relaxed text-[#364039]">
              {t('intro')}
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-black text-primary">
              {t('stepsTitle')}
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-4">
              {steps.map(({ image, titleKey, bodyKey }, index) => (
                <article key={titleKey} className="relative text-center">
                  <span className="absolute left-0 top-2 z-10 flex size-8 items-center justify-center rounded-full bg-primary text-sm font-black text-white shadow-sm">
                    {index + 1}
                  </span>
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#edf4eb] p-2">
                    <div className="relative h-full w-full overflow-hidden rounded-full">
                      <Image
                        src={image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </div>
                  </div>
                  <h3 className="mt-4 text-[1.05rem] font-black text-[#18251a]">
                    {t(titleKey)}
                  </h3>
                  <p className="mx-auto mt-2 max-w-[14rem] text-sm leading-relaxed text-[#556158]">
                    {t(bodyKey)}
                  </p>
                  {index < steps.length - 1 ? (
                    <span
                      className="absolute right-[-1.5rem] top-14 hidden text-primary md:block"
                      aria-hidden
                    >
                      -&gt;
                    </span>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-xl bg-[#eef4ec] p-6">
            <h2 className="text-center text-xl font-black text-primary">
              {t('benefitsTitle')}
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-4">
              {benefits.map(({ Icon, titleKey, bodyKey }, index) => (
                <article
                  key={titleKey}
                  className={`px-4 py-3 text-center ${
                    index < benefits.length - 1
                      ? 'md:border-r md:border-[#d8e2d6]'
                      : ''
                  }`}
                >
                  <Icon
                    className="mx-auto size-12 text-primary"
                    strokeWidth={1.7}
                  />
                  <h3 className="mt-3 font-black text-[#18251a]">
                    {t(titleKey)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#58645b]">
                    {t(bodyKey)}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-center text-2xl font-black text-primary">
              {t('audienceTitle')}
            </h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <article className="relative min-h-52 overflow-hidden rounded-xl bg-white p-6 shadow-[0_16px_44px_rgba(21,45,25,0.06)]">
                <h3 className="text-xl font-black text-[#18251a]">
                  {t('farmersTitle')}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#4f5a52]">
                  {t('farmersBody')}
                </p>
                <div className="absolute bottom-0 right-0 h-44 w-56 overflow-hidden rounded-tl-full">
                  <Image
                    src="/how-it-work1.jpg"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="224px"
                  />
                </div>
              </article>

              <article className="relative min-h-52 overflow-hidden rounded-xl bg-white p-6 shadow-[0_16px_44px_rgba(21,45,25,0.06)]">
                <h3 className="text-xl font-black text-[#18251a]">
                  {t('buyersTitle')}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#4f5a52]">
                  {t('buyersBody')}
                </p>
                <div className="absolute bottom-0 right-0 h-44 w-56 overflow-hidden rounded-tl-full">
                  <Image
                    src="/how-it-work3.jpg"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="224px"
                  />
                </div>
              </article>
            </div>
          </section>

          <section className="mt-8 rounded-xl bg-[#04531c] p-7 text-white md:flex md:items-center md:justify-between md:gap-6">
            <div>
              <h2 className="text-3xl font-black tracking-[-0.03em]">
                {t('ctaTitle')}
              </h2>
              <p className="mt-2 max-w-xl text-white/85">{t('ctaBody')}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3 md:mt-0">
              <Link href="/listings">
                <Button className="h-12 gap-2 rounded-md bg-white px-7 font-bold text-primary hover:bg-white/90">
                  <Search className="size-4" aria-hidden />
                  {t('marketButton')}
                </Button>
              </Link>
              <Link href="/post-harvest">
                <Button
                  variant="outline"
                  className="h-12 gap-2 rounded-md border-white/55 bg-transparent px-7 font-bold text-white hover:bg-white/10"
                >
                  <Smartphone className="size-4" aria-hidden />
                  {t('postButton')}
                </Button>
              </Link>
            </div>
          </section>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
