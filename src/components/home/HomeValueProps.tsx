import { Container } from '@/components/layout/Container'
import { Handshake, Leaf, MapPin, Tag } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export async function HomeValueProps() {
  const t = await getTranslations('home')

  const items = [
    { icon: MapPin, title: t('whyNearbyTitle'), body: t('whyNearbyBody') },
    { icon: Handshake, title: t('whyConnectTitle'), body: t('whyConnectBody') },
    { icon: Tag, title: t('whyPricesTitle'), body: t('whyPricesBody') },
    { icon: Leaf, title: t('whyFarmersTitle'), body: t('whyFarmersBody') },
  ]

  return (
    <section className="bg-white py-10 md:py-12">
      <Container>
        <div className="text-center">
          <h2 className="text-center text-[2rem] font-black tracking-[-0.04em] text-[#173b1b] sm:text-[2.35rem]">
            {t('whyTitle')}
          </h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:gap-0">
          {items.map(({ icon: Icon, title, body }, index) => (
            <article
              key={title}
              className={`rounded-[1.25rem] border border-[#dfe6dc] bg-white px-5 py-5 shadow-[0_12px_24px_rgba(21,45,25,0.03)] xl:rounded-none xl:border-0 xl:bg-transparent xl:shadow-none ${
                index > 0 ? 'xl:border-l xl:border-[#dfe6dc] xl:pl-8' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#eef5ea] text-primary">
                  <Icon className="size-6" strokeWidth={1.8} aria-hidden />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-[#17311b]">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#5f6b60]">
                    {body}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
