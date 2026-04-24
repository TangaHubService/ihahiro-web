import { Container } from '@/components/layout/Container'
import { Link } from '@/i18n/navigation'
import { Camera, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

export async function Footer() {
  const t = await getTranslations('footer')
  const tNav = await getTranslations('nav')
  const tLang = await getTranslations('lang')
  const tCommon = await getTranslations('common')
  const year = new Date().getFullYear()

  const linkClass =
    'text-sm text-white/88 transition-colors hover:text-white'

  const flags: Record<'rw' | 'en' | 'fr' | 'sw', string> = {
    rw: '🇷🇼',
    en: '🇬🇧',
    fr: '🇫🇷',
    sw: '🇹🇿',
  }

  const hubLinks = [
    { href: '/', label: tNav('home') },
    { href: '/listings', label: tNav('market') },
    { href: '/post-harvest', label: tNav('postHarvest') },
    { href: '/how-it-works', label: tNav('howItWorks') },
    { href: '/about', label: tNav('about') },
  ]

  const supportLinks = [
    { href: '/how-it-works', label: tNav('howItWorks') },
    { href: '/contact', label: tNav('contact') },
    { href: '/about', label: tNav('about') },
  ]

  return (
    <footer className="mt-auto bg-[#04531c] text-primary-foreground">
      <Container className="grid gap-10 py-10 md:grid-cols-2 lg:grid-cols-[1.35fr_repeat(4,minmax(0,1fr))] lg:gap-8">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt=""
              width={52}
              height={52}
              className="size-20 object-contain rounded-full"
            />
            <span className="flex flex-col">
              <span className="font-serif text-[2rem] font-bold leading-none tracking-tight">
                {tCommon('appName')}
              </span>
              <span className="mt-1 text-[0.48rem] font-semibold uppercase tracking-[0.3em] text-white/80">
                {tCommon('tagline')}
              </span>
            </span>
          </Link>

          <p className="max-w-[17rem] text-sm leading-relaxed text-white/85">
            {t('mission')}
          </p>

          <div className="flex gap-3">
            <a
              href="https://facebook.com"
              className="rounded-full border border-white/30 p-2 hover:bg-white/10"
              aria-label="Facebook"
            >
              <MessageCircle className="size-4" />
            </a>
            <a
              href="https://instagram.com"
              className="rounded-full border border-white/30 p-2 hover:bg-white/10"
              aria-label="Instagram"
            >
              <Camera className="size-4" />
            </a>
            <a
              href={`https://wa.me/${t('phone').replace(/\D/g, '')}`}
              className="rounded-full border border-white/30 p-2 hover:bg-white/10"
              aria-label="WhatsApp"
            >
              <Phone className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">{t('linksTitle')}</h3>
          <ul className="space-y-2">
            {hubLinks.map((item) => (
              <li key={item.href}>
                <Link className={linkClass} href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">{t('supportTitle')}</h3>
          <ul className="space-y-2">
            {supportLinks.map((item) => (
              <li key={item.href}>
                <Link className={linkClass} href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">{t('contactTitle')}</h3>
          <ul className="space-y-3 text-sm text-white/90">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 shrink-0" aria-hidden />
              <a href={`tel:${t('phone').replace(/\s/g, '')}`}>{t('phone')}</a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 size-4 shrink-0" aria-hidden />
              <a href={`mailto:${t('email')}`}>{t('email')}</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>{t('address')}</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">{t('languageTitle')}</h3>
          <ul className="space-y-1 text-sm text-white/90">
            {(['rw', 'en', 'fr', 'sw'] as const).map((loc) => (
              <li key={loc}>
                <Link href="/" locale={loc} className={linkClass}>
                  {flags[loc]} {tLang(loc)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/80">
        {t('rights', { year })}
      </div>
    </footer>
  )
}
