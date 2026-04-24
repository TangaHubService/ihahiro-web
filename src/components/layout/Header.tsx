'use client'

import { LanguageSwitcher } from '@/components/features/LanguageSwitcher'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Link, usePathname } from '@/i18n/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Menu, Search, X, User, LogOut } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { type AuthUser } from '@/lib/api/auth'

const NAV_KEYS = [
  { href: '/', key: 'home' as const },
  { href: '/listings', key: 'market' as const },
  { href: '/post-harvest', key: 'postHarvest' as const },
  { href: '/how-it-works', key: 'howItWorks' as const },
  { href: '/about', key: 'about' as const },
  { href: '/contact', key: 'contact' as const },
]

export function Header() {
  const t = useTranslations('nav')
  const tCommon = useTranslations('common')
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  function isActive(href: string) {
    return href === '/'
      ? pathname === '/'
      : pathname === href || pathname.startsWith(`${href}/`)
  }

  const typedUser = user as AuthUser | undefined

  const userDisplayName = typedUser
    ? `${typedUser.firstName} ${typedUser.lastName}`.trim()
    : ''

  if (isLoading) {
    return (
      <header className="sticky top-0 z-40 border-b border-[#e7eee4] bg-white/95 backdrop-blur-sm">
        <Container className="flex h-[4.6rem] items-center justify-between gap-4 sm:h-[4.85rem]">
          <div className="w-32 h-8 bg-[#e8eee4] rounded animate-pulse" />
          <div className="w-20 h-8 bg-[#e8eee4] rounded animate-pulse" />
        </Container>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#e7eee4] bg-white/95 backdrop-blur-sm">
      <Container className="flex h-[4.6rem] items-center justify-between gap-4 sm:h-[4.85rem]">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-3 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Image
            src="/logo.png"
            alt=""
            width={48}
            height={48}
            className="size-11 shrink-0 object-contain"
            priority
          />
          <span className="hidden min-w-0 flex-col leading-[1.15] sm:flex">
            <span className="font-serif text-[1.35rem] font-bold tracking-tight text-primary sm:text-[1.55rem]">
              {tCommon('appName')}
            </span>
            <span className="mt-0.5 text-[0.42rem] font-semibold lowercase leading-none tracking-[0.22em] text-secondary sm:text-[0.46rem]">
              {tCommon('tagline')}
            </span>
          </span>
        </Link>

        <nav
          className="mx-3 hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex xl:gap-2"
          aria-label={tCommon('appName')}
        >
          {NAV_KEYS.map(({ href, key }) => {
            const active = isActive(href)

            return (
              <Link
                key={key}
                href={href}
                className={`whitespace-nowrap rounded-full px-2.5 py-2 text-[0.82rem] font-medium transition-colors xl:px-3 xl:text-[0.92rem] ${
                  active
                    ? 'bg-[#eff6ec] font-semibold text-primary'
                    : 'text-[#2f3a31] hover:bg-[#f5f8f3] hover:text-primary'
                }`}
              >
                {t(key)}
              </Link>
            )
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link href="/profile" className="hidden lg:inline-flex">
                <Button
                  variant="ghost"
                  className="h-10 gap-2 rounded-xl px-4 text-sm font-semibold"
                >
                  <User className="size-4" />
                  {userDisplayName || t('profile')}
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => logout()}
                className="hidden lg:inline-flex h-10 gap-2 rounded-xl border-[#d1d5db] px-4 text-sm font-semibold text-[#536057] hover:bg-[#f5f6f5]"
              >
                <LogOut className="size-4" />
                {t('logout')}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="hidden lg:inline-flex">
                <Button
                  variant="outline"
                  className="h-10 rounded-xl border-primary px-4 text-sm font-semibold text-primary hover:bg-[#edf5ea]"
                >
                  {t('login')}
                </Button>
              </Link>
              <Link href="/register" className="hidden lg:inline-flex">
                <Button className="h-10 rounded-xl px-4 text-sm font-semibold">
                  {t('register')}
                </Button>
              </Link>
            </div>
          )}
          <LanguageSwitcher />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-xl border border-[#d8ded8] text-primary transition-colors hover:bg-[#eef4ec] lg:hidden"
            aria-controls="mobile-header-menu"
            aria-expanded={mobileMenuOpen}
            aria-label={
              mobileMenuOpen ? tCommon('closeMenu') : tCommon('openMenu')
            }
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
          </button>
        </div>
      </Container>

      {mobileMenuOpen ? (
        <div
          id="mobile-header-menu"
          className="border-t border-[#e6ece3] bg-white shadow-[0_18px_35px_rgba(21,45,25,0.08)] lg:hidden"
        >
          <Container className="py-4">
            <nav className="grid gap-1" aria-label={tCommon('appName')}>
              {NAV_KEYS.map(({ href, key }) => {
                const active = isActive(href)

                return (
                  <Link
                    key={key}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-[#eef4ec] text-primary'
                        : 'text-[#2f3a32] hover:bg-[#f5f8f4] hover:text-primary'
                    }`}
                  >
                    {t(key)}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-4 border-t border-[#edf0ed] pt-4">
              {isAuthenticated ? (
                <div className="grid gap-2">
                  <Link
                    href="/profile"
                    className="min-w-0"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="h-11 w-full gap-2 rounded-xl text-sm font-bold"
                    >
                      <User className="size-4" />
                      {userDisplayName || t('profile')}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="h-11 w-full gap-2 rounded-xl border-[#d1d5db] text-sm font-bold text-[#536057] hover:bg-[#f5f6f5]"
                  >
                    <LogOut className="size-4" />
                    {t('logout')}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    className="min-w-0"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      className="h-11 w-full rounded-xl border-primary text-sm font-bold text-primary hover:bg-[#e8f5e9]"
                    >
                      {t('login')}
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    className="min-w-0"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="h-11 w-full rounded-xl text-sm font-bold">
                      {t('register')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  )
}