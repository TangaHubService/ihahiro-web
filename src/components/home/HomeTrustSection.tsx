import { Container } from '@/components/layout/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import {
  LocateFixed,
  MapPinned,
  PhoneCall,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'
import { getTranslations } from 'next-intl/server'

const trustItems = [
  {
    icon: MapPinned,
    titleKey: 'trustSearchTitle',
    bodyKey: 'trustSearchBody',
  },
  {
    icon: PhoneCall,
    titleKey: 'trustContactTitle',
    bodyKey: 'trustContactBody',
  },
  {
    icon: Smartphone,
    titleKey: 'trustBandwidthTitle',
    bodyKey: 'trustBandwidthBody',
  },
] as const

const districts = [
  'Kigali',
  'Musanze',
  'Huye',
  'Rubavu',
  'Bugesera',
  'Rwamagana',
]

export async function HomeTrustSection() {
  const t = await getTranslations('home')

  return (
    <section className="bg-[#f7fbf2] py-12 md:py-16">
      <Container>
        <SectionHeader
          eyebrow={t('trustEyebrow')}
          title={t('trustSectionTitle')}
          description={t('trustSectionBody')}
        />

        <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="rounded-[2rem] border border-[#dce8da] bg-white p-6 shadow-[0_20px_55px_rgba(21,45,25,0.05)] md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
                  {t('trustPanelEyebrow')}
                </p>
                <h3 className="mt-3 text-[1.7rem] font-black leading-tight tracking-[-0.04em] text-[#173b1b]">
                  {t('trustPanelTitle')}
                </h3>
              </div>
              <span className="flex size-14 items-center justify-center rounded-2xl bg-[#eef5eb] text-primary">
                <LocateFixed className="size-7" aria-hidden />
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {districts.map((district) => (
                <span
                  key={district}
                  className="rounded-full border border-[#d7e2d5] bg-[#f8fbf7] px-3 py-2 text-sm font-medium text-[#355039]"
                >
                  {district}
                </span>
              ))}
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#f4f8f2] p-4">
                <p className="text-2xl font-black text-primary">120+</p>
                <p className="mt-1 text-sm text-[#5d685e]">
                  {t('trustStatListings')}
                </p>
              </div>
              <div className="rounded-2xl bg-[#f4f8f2] p-4">
                <p className="text-2xl font-black text-primary">30</p>
                <p className="mt-1 text-sm text-[#5d685e]">
                  {t('trustStatDistricts')}
                </p>
              </div>
              <div className="rounded-2xl bg-[#f4f8f2] p-4">
                <p className="text-2xl font-black text-primary">4</p>
                <p className="mt-1 text-sm text-[#5d685e]">
                  {t('trustStatLanguages')}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {trustItems.map(({ icon: Icon, titleKey, bodyKey }) => (
              <article
                key={titleKey}
                className="rounded-[1.75rem] border border-[#dce8da] bg-white p-6 shadow-[0_18px_48px_rgba(21,45,25,0.04)]"
              >
                <div className="flex items-start gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#eef5eb] text-primary">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-lg font-black text-[#173b1b]">
                      {t(titleKey)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#5d685e]">
                      {t(bodyKey)}
                    </p>
                  </div>
                </div>
              </article>
            ))}

            <article className="rounded-[1.75rem] bg-primary p-6 text-white shadow-[0_18px_48px_rgba(21,45,25,0.12)]">
              <div className="flex items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <ShieldCheck className="size-6" aria-hidden />
                </span>
                <div>
                  <h3 className="text-lg font-black">
                    {t('trustSafetyTitle')}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/85">
                    {t('trustSafetyBody')}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </Container>
    </section>
  )
}
