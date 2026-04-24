import { Container } from '@/components/layout/Container'
import { Link } from '@/i18n/navigation'
import { ArrowRight, CheckCircle2, ShoppingBasket, Sprout } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

const audienceStyles = {
  buyers: 'border-[#dce7db] bg-white shadow-[0_18px_48px_rgba(21,45,25,0.05)]',
  sellers:
    'border-transparent bg-[#eaf2e7] shadow-[0_18px_48px_rgba(21,45,25,0.04)]',
} as const

const audienceIcons = {
  buyers: ShoppingBasket,
  sellers: Sprout,
} as const

export async function HomeAudienceHighlights() {
  const t = await getTranslations('home')

  const sections = [
    {
      key: 'buyers' as const,
      eyebrow: t('buyersEyebrow'),
      title: t('buyersSectionTitle'),
      body: t('buyersSectionBody'),
      cta: t('buyerCta'),
      href: '/listings',
      points: [t('buyersPointOne'), t('buyersPointTwo'), t('buyersPointThree')],
    },
    {
      key: 'sellers' as const,
      eyebrow: t('sellersEyebrow'),
      title: t('sellersSectionTitle'),
      body: t('sellersSectionBody'),
      cta: t('farmerCta'),
      href: '/register',
      points: [
        t('sellersPointOne'),
        t('sellersPointTwo'),
        t('sellersPointThree'),
      ],
    },
  ]

  return (
    <section className="bg-white py-12 md:py-14">
      <Container>
        <div className="grid gap-5 lg:grid-cols-2">
          {sections.map(({ key, eyebrow, title, body, cta, href, points }) => {
            const Icon = audienceIcons[key]

            return (
              <article
                key={key}
                className={`rounded-[2rem] border p-6 md:p-8 ${audienceStyles[key]}`}
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary ring-1 ring-primary/10">
                  <Icon className="size-4" aria-hidden />
                  {eyebrow}
                </span>
                <h2 className="mt-5 text-[2rem] font-black leading-tight tracking-[-0.04em] text-[#173b1b]">
                  {title}
                </h2>
                <p className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-[#556357]">
                  {body}
                </p>

                <ul className="mt-6 space-y-3">
                  {points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-sm leading-relaxed text-[#304033]"
                    >
                      <CheckCircle2
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        aria-hidden
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={href}
                  className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                >
                  {cta}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </article>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
