'use client'

import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Link, useRouter } from '@/i18n/navigation'
import {
  CircleDollarSign,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FormEvent, useRef, useState } from 'react'

const HERO_IMAGE = '/hero.png'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
}

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.6 + i * 0.15,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  }),
}

export function HomeHero() {
  const t = useTranslations('home')
  const router = useRouter()
  const ref = useRef(null)
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 100])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const trust = [
    { icon: ShieldCheck, label: t('trustFresh') },
    { icon: MapPin, label: t('trustNearby') },
    { icon: CircleDollarSign, label: t('trustPrices') },
    { icon: Users, label: t('trustConnect') },
  ]
  const quickSearches = [
    t('heroQuickSearchOne'),
    t('heroQuickSearchTwo'),
    t('heroQuickSearchThree'),
  ]

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const params = new URLSearchParams()

    if (query.trim()) {
      params.set('q', query.trim())
    }

    if (location.trim()) {
      params.set('location', location.trim())
    }

    router.push(`/listings${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <section
      ref={ref}
      className="relative min-h-[34rem] overflow-hidden border-b border-[#e8ebe9] bg-black sm:min-h-[35rem] lg:min-h-[32rem] xl:min-h-[34rem]"
    >
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          preload
          unoptimized
          className="h-full w-full object-cover object-[62%_center] sm:object-center"
          sizes="100vw"
        />
      </motion.div>
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.76)_0%,rgba(0,0,0,0.58)_52%,rgba(0,0,0,0.24)_100%)] sm:bg-[linear-gradient(90deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.64)_34%,rgba(0,0,0,0.28)_58%,rgba(0,0,0,0)_82%)]"
        aria-hidden
      />

      <Container className="relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex min-h-[34rem] flex-col justify-center py-10 sm:min-h-[35rem] sm:py-12 lg:min-h-[32rem] lg:max-w-[52%] xl:min-h-[34rem]"
        >
          <div className="max-w-[34rem]">
            <motion.h1
              variants={itemVariants}
              className="max-w-[32rem] text-[2.35rem] font-black leading-[1.05] tracking-[-0.045em] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] sm:text-[3.35rem] lg:text-[3.8rem]"
            >
              {t('heroTitle')}
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="mt-5 max-w-[30rem] text-[1.02rem] leading-[1.8] text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] sm:text-[1.18rem]"
            >
              {t('heroSubtitle')}
            </motion.p>

            <motion.form
              variants={itemVariants}
              onSubmit={handleSearch}
              className="mt-7 rounded-[1.75rem] border border-white/12 bg-white/10 p-4 shadow-[0_20px_55px_rgba(0,0,0,0.16)] backdrop-blur-md"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                {t('heroSearchEyebrow')}
              </p>
              <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_auto]">
                <label className="block">
                  <span className="sr-only">{t('heroSearchPlaceholder')}</span>
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/70"
                      aria-hidden
                    />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={t('heroSearchPlaceholder')}
                      className="h-12 w-full rounded-xl border border-white/15 bg-black/15 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/65 focus:border-white/30 focus:ring-4 focus:ring-white/10"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="sr-only">
                    {t('heroLocationPlaceholder')}
                  </span>
                  <div className="relative">
                    <MapPin
                      className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/70"
                      aria-hidden
                    />
                    <input
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      placeholder={t('heroLocationPlaceholder')}
                      className="h-12 w-full rounded-xl border border-white/15 bg-black/15 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/65 focus:border-white/30 focus:ring-4 focus:ring-white/10"
                    />
                  </div>
                </label>
                <Button className="h-12 rounded-xl bg-white px-5 text-sm font-bold text-primary hover:bg-white/95">
                  <Search className="size-4" aria-hidden />
                  {t('heroSearchButton')}
                </Button>
              </div>
              <p className="mt-3 text-sm text-white/75">
                {t('heroSearchHelp')}
              </p>
            </motion.form>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <motion.div custom={0} variants={buttonVariants}>
                <Link href="/listings" className="inline-flex">
                  <Button className="h-12 min-w-[210px] gap-3 rounded-md bg-primary px-7 text-[0.96rem] font-bold shadow-[0_14px_28px_rgba(27,94,32,0.22)] hover:bg-[#124817] hover:opacity-100 sm:h-[3.35rem]">
                    <Search className="size-[1.15rem] shrink-0" aria-hidden />
                    {t('ctaMarket')}
                  </Button>
                </Link>
              </motion.div>
              <motion.div custom={1} variants={buttonVariants}>
                <Link href="/post-harvest" className="inline-flex">
                  <Button
                    variant="outline"
                    className="h-12 min-w-[210px] gap-3 rounded-md border-white/75 bg-black/25 px-7 text-[0.96rem] font-bold text-white shadow-[0_12px_30px_rgba(0,0,0,0.14)] backdrop-blur-sm hover:bg-black/40 hover:opacity-100 sm:h-[3.35rem]"
                  >
                    <Plus className="size-[1.15rem] shrink-0" aria-hidden />
                    {t('ctaPost')}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.ul
              variants={itemVariants}
              className="mt-8 grid grid-cols-2 overflow-hidden rounded-2xl border border-white/15 bg-black/20 shadow-[0_18px_55px_rgba(0,0,0,0.14)] backdrop-blur-sm sm:mt-9 sm:grid-cols-4 sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none sm:backdrop-blur-0"
            >
              {trust.map(({ icon: Icon, label }, index) => (
                <li
                  key={label}
                  className={`flex min-h-24 flex-col items-center justify-center px-3 py-4 text-center ${
                    index % 2 === 0
                      ? 'border-r border-white/15 sm:border-r-0'
                      : ''
                  } ${
                    index < 2 ? 'border-b border-white/15 sm:border-b-0' : ''
                  } ${
                    index < trust.length - 1
                      ? 'sm:border-r sm:border-white/25'
                      : ''
                  }`}
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-white/12 text-white shadow-sm ring-1 ring-white/20 sm:bg-transparent sm:shadow-none sm:ring-0">
                    <Icon className="size-5" strokeWidth={2.15} aria-hidden />
                  </span>
                  <span className="mt-2 text-[0.78rem] font-semibold leading-snug text-white/90 sm:text-[0.86rem]">
                    {label}
                  </span>
                </li>
              ))}
            </motion.ul>

            <motion.div variants={itemVariants} className="mt-6">
              <p className="text-sm font-semibold text-white/80">
                {t('heroQuickSearchLabel')}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {quickSearches.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuery(item)}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white/90 backdrop-blur-sm transition hover:bg-white/15"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
