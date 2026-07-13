'use client'

import { useState } from 'react'
import { LanguageSwitcher } from '@/components/features/LanguageSwitcher'
import { ChatFab } from '@/components/layout/ChatFab'
import { Drawer } from '@/components/ui/Drawer'
import { Link, usePathname } from '@/i18n/navigation'
import { useAuth } from '@/hooks/useAuth'
import { type AuthUser } from '@/lib/api/auth'
import { getInitials } from '@/lib/utils/getInitials'
import { cn } from '@/lib/utils/cn'
import { LogOut, Menu } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { LucideIcon } from 'lucide-react'

export type DashboardNavItem =
  | {
      kind: 'link'
      key: string
      label: string
      icon: LucideIcon
      href: string
    }
  | {
      kind: 'button'
      key: string
      label: string
      icon: LucideIcon
      onClick: () => void
      active: boolean
    }

export type DashboardShellProps = {
  title: string
  navItems: DashboardNavItem[]
  children: React.ReactNode
}

function isNavItemActive(item: DashboardNavItem, pathname: string) {
  if (item.kind === 'link') {
    return pathname === item.href || pathname.startsWith(`${item.href}/`)
  }
  return item.active
}

function DashboardNavList({
  navItems,
  pathname,
  onNavigate,
}: {
  navItems: DashboardNavItem[]
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const active = isNavItemActive(item, pathname)
        const itemClassName = cn(
          'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
          active
            ? 'bg-[#eff6ec] text-primary'
            : 'text-[#3d483f] hover:bg-[#f5f8f3] hover:text-primary'
        )

        if (item.kind === 'link') {
          return (
            <Link
              key={item.key}
              href={item.href}
              className={itemClassName}
              onClick={onNavigate}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          )
        }

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              item.onClick()
              onNavigate?.()
            }}
            className={itemClassName}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}

export function DashboardShell({
  title,
  navItems,
  children,
}: DashboardShellProps) {
  const tCommon = useTranslations('common')
  const tNav = useTranslations('nav')
  const pathname = usePathname()
  const { user, isLoading, logout } = useAuth()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const typedUser = user as AuthUser | undefined
  const userDisplayName = typedUser
    ? `${typedUser.firstName} ${typedUser.lastName}`.trim()
    : ''

  const brand = (
    <Link href="/" className="flex items-center gap-2.5 px-2">
      <Image
        src="/logo.png"
        alt=""
        width={36}
        height={36}
        className="size-9 shrink-0 object-contain"
      />
      <span className="font-serif text-lg font-bold tracking-tight text-primary">
        {tCommon('appName')}
      </span>
    </Link>
  )

  const userCard = (
    <div className="flex items-center gap-3 rounded-xl border border-[#e6ebe4] bg-[#f8faf7] px-3 py-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#edf7ea_0%,#dbead4_100%)] text-xs font-black text-primary">
        {isLoading ? '' : getInitials(userDisplayName)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-[#18251a]">
          {isLoading ? '' : userDisplayName}
        </p>
        <p className="truncate text-xs capitalize text-[#7a857a]">
          {isLoading ? '' : (typedUser?.role ?? '')}
        </p>
      </div>
      <button
        type="button"
        onClick={() => logout()}
        aria-label={tNav('logout')}
        title={tNav('logout')}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-[#7a857a] transition-colors hover:bg-[#eef4ec] hover:text-primary"
      >
        <LogOut className="size-4" aria-hidden />
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f7f8f5] lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r border-[#e7eee4] bg-white px-4 py-6 lg:sticky lg:top-0 lg:flex lg:h-screen">
        {brand}
        <DashboardNavList navItems={navItems} pathname={pathname} />
        <div className="mt-auto">{userCard}</div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[#e7eee4] bg-white/95 px-4 backdrop-blur-sm sm:px-6">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label={tCommon('openMenu')}
            className="inline-flex size-10 items-center justify-center rounded-xl border border-[#d8ded8] text-primary transition-colors hover:bg-[#eef4ec] lg:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>
          <h1 className="min-w-0 truncate text-lg font-black tracking-[-0.02em] text-[#18251a]">
            {title}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher />
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>

      <Drawer
        open={mobileNavOpen}
        title={tCommon('appName')}
        onClose={() => setMobileNavOpen(false)}
      >
        <div className="flex h-full flex-col gap-6">
          <DashboardNavList
            navItems={navItems}
            pathname={pathname}
            onNavigate={() => setMobileNavOpen(false)}
          />
          <div className="mt-auto">{userCard}</div>
        </div>
      </Drawer>

      <ChatFab />
    </div>
  )
}
