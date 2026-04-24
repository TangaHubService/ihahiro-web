import { Container } from '@/components/layout/Container'
import { ArrowRight, Handshake, MapPinned, Sprout } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Fragment } from 'react'

export async function HomeHowItWorks() {
  const t = await getTranslations('home')

  const steps = [
    {
      icon: Sprout,
      title: t('step1Title'),
      body: t('step1Body'),
    },
    {
      icon: MapPinned,
      title: t('step2Title'),
      body: t('step2Body'),
    },
    {
      icon: Handshake,
      title: t('step3Title'),
      body: t('step3Body'),
    },
  ]

  return (
    <section className="bg-white py-10 md:py-12">
      <Container>
        <div className="text-center">
          <h2 className="text-[2rem] font-black leading-tight tracking-[-0.04em] text-[#173b1b] sm:text-[2.35rem]">
            {t('howTitle')}
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#d9e7d4]" />
        </div>

        <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-start md:gap-4">
          {steps.map(({ icon: Icon, title, body }, index) => (
            <Fragment key={title}>
              <article className="text-center">
                <div className="relative mx-auto flex size-32 items-center justify-center rounded-full bg-[#f3f8ef] shadow-[inset_0_0_0_1px_rgba(27,94,32,0.08)]">
                  <span className="absolute left-1 top-2 flex size-9 items-center justify-center rounded-full bg-primary text-sm font-black text-white shadow-sm">
                    {index + 1}
                  </span>
                  <span className="flex size-20 items-center justify-center rounded-full bg-white text-primary shadow-[0_12px_24px_rgba(17,60,22,0.08)]">
                    <Icon className="size-10" strokeWidth={1.9} aria-hidden />
                  </span>
                </div>
                <h3 className="mt-5 text-[1.15rem] font-black leading-snug text-[#173b1b]">
                  {title}
                </h3>
                <p className="mx-auto mt-2 max-w-[16rem] text-[0.93rem] leading-relaxed text-[#5f6c61]">
                  {body}
                </p>
              </article>
              {index < steps.length - 1 ? (
                <div
                  className="flex items-center justify-center text-primary md:px-2"
                  aria-hidden
                >
                  <div className="h-8 w-px bg-primary/20 md:hidden" />
                  <ArrowRight className="hidden size-7 md:block" strokeWidth={1.8} />
                </div>
              ) : null}
            </Fragment>
          ))}
        </div>
      </Container>
    </section>
  )
}
