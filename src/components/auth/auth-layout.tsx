'use client'

import { Container } from '@/components/layout/Container'
import { LanguageSelector } from '@/components/auth/language-selector'
import { FeatureBadge } from '@/components/auth/feature-badge'
import { HelpCircle, Leaf, Shield, Wallet, ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export interface AuthLayoutProps {
  children: ReactNode
  alternatePrompt: string
  alternateLabel: string
  alternateHref: string
  pageTitle?: string
  pageSubtitle?: string
}

const features = [
  { icon: Leaf, title: 'Quality Products', description: 'Fresh and reliable from trusted sellers' },
  { icon: Wallet, title: 'Fair Prices', description: 'Great prices for everyone' },
  { icon: Shield, title: 'Secure & Safe', description: 'Your data and transactions are protected' },
]

export function AuthLayout({
  children,
  alternatePrompt,
  alternateLabel,
  alternateHref,
  pageTitle = 'Welcome back',
  pageSubtitle = 'Sign in to your Ihahiro account',
}: AuthLayoutProps) {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <main className="flex h-screen w-screen bg-white">
        <div className="flex w-1/2 items-center justify-center px-8">
          <div className="w-full max-w-lg space-y-6">
            <div className="w-32 h-4 bg-[#e8eee4] rounded animate-pulse" />
            <div className="w-48 h-8 bg-[#e8eee4] rounded animate-pulse" />
            <div className="w-full h-12 bg-[#e8eee4] rounded animate-pulse" />
            <div className="w-full h-12 bg-[#e8eee4] rounded animate-pulse" />
          </div>
        </div>
        <div className="hidden w-1/2 lg:block bg-[#e8eee4]" />
      </main>
    )
  }
  return (
    <main className="flex h-screen w-screen bg-white">
      {/* Left Panel - Form (50%) - Scrollable */}
      <div className="flex w-full flex-col overflow-y-auto px-6 md:px-8 lg:w-1/2 lg:px-12 xl:px-16">
        <Container className="mx-auto w-full max-w-lg py-6 md:py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[#5b695d] hover:text-[#2E7D32]"
            >
              <ArrowLeft className="size-4" />
              <span>Back to home</span>
            </Link>
          </div>
          
          {/* Brand */}
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1B5E20]">
                <Leaf className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1B5E20]">Ihahiro</h1>
                <p className="text-xs font-medium text-[#2E7D32]">
                  Fresh Produce. Strong Communities.
                </p>
              </div>
            </Link>
          </div>

          {/* Welcome */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1B5E20]">{pageTitle}</h2>
            <p className="mt-1 text-[#5b695d]">{pageSubtitle}</p>
          </div>

          {/* Form */}
          <div className="mb-6 flex-1">{children}</div>

          {/* Register Link */}
          <p className="mb-8 text-sm text-[#5b695d]">
            {alternatePrompt}{' '}
            <a href={alternateHref} className="font-semibold text-[#2E7D32] hover:underline">
              {alternateLabel}
            </a>
          </p>

          {/* Trust Features */}
          <div className="border-t border-[#D4E4D1] pt-6">
            <div className="grid grid-cols-3 gap-4">
              {features.map((feature) => (
                <FeatureBadge
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-between border-t border-[#D4E4D1] pt-4">
            <LanguageSelector />
            <a
              href="/support"
              className="flex items-center gap-2 text-sm text-[#5b695d] hover:text-[#2E7D32]"
            >
              <HelpCircle className="size-4" />
              <span>Need help?</span>
            </a>
          </div>
        </Container>
      </div>

      {/* Right Panel - Hero Image (50%) */}
      <div className="relative w-1/2">
        <div className="absolute inset-0 h-full w-full">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/hero.png)' }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

          {/* Content */}
          <div className="relative flex h-full flex-col justify-between p-8 xl:p-12">
            {/* Top Content */}
            <div className="text-white">
              <h2 className="max-w-lg text-3xl font-bold leading-tight xl:text-4xl">
                Connecting farmers and buyers across Rwanda.
              </h2>
              <p className="mt-4 max-w-md text-lg text-white/80">
                Buy and sell fresh produce easily and grow together.
              </p>
            </div>

            {/* Bottom Badge */}
            <div className="rounded-xl bg-black/40 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#2E7D32]">
                  <Leaf className="size-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Supporting local farmers</h3>
                  <p className="text-sm text-white/70">
                    Building stronger communities through agriculture.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}