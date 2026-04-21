"use client";

import { LanguageSwitcher } from "@/components/features/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

const NAV_KEYS = [
  { href: "/", key: "home" as const },
  { href: "/listings", key: "market" as const },
  { href: "/post-harvest", key: "postHarvest" as const },
  { href: "/how-it-works", key: "howItWorks" as const },
  { href: "/about", key: "about" as const },
  { href: "/contact", key: "contact" as const },
];

export function Header() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function isActive(href: string) {
    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#e5e7eb] bg-white">
      <Container className="flex h-[4.5rem] items-center justify-between gap-3 sm:h-[4.75rem] lg:px-10">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
        >
          <Image
            src="/logo.png"
            alt=""
            width={48}
            height={48}
            className="size-11 shrink-0 object-contain sm:size-12"
            priority
          />
          <span className="hidden min-w-0 flex-col leading-[1.15] sm:flex">
            <span className="font-serif text-[1.35rem] font-bold tracking-tight text-primary sm:text-[1.45rem]">
              {tCommon("appName")}
            </span>
            <span className="mt-0.5 text-[0.38rem] font-semibold lowercase leading-none tracking-[0.18em] text-secondary sm:text-[0.44rem]">
              {tCommon("tagline")}
            </span>
          </span>
        </Link>

        <nav
          className="mx-4 hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex xl:gap-1"
          aria-label={tCommon("appName")}
        >
          {NAV_KEYS.map(({ href, key }) => {
            const active = isActive(href);
            return (
              <Link
                key={key}
                href={href}
                className={`relative whitespace-nowrap rounded-md px-2 py-2 text-[0.8rem] font-medium transition-colors xl:px-2.5 xl:text-[0.875rem] ${
                  active
                    ? "font-semibold text-primary after:absolute after:inset-x-2 after:-bottom-2 after:h-0.5 after:rounded-full after:bg-primary"
                    : "text-[#374151] hover:text-primary"
                }`}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link href="/login" className="hidden lg:inline-flex">
            <Button
              variant="outline"
              className="h-9 rounded-md border-primary px-3.5 text-xs font-semibold text-primary hover:bg-[#e8f5e9] lg:text-sm"
            >
              {t("login")}
            </Button>
          </Link>
          <Link href="/register" className="hidden xl:inline-flex">
            <Button className="h-9 rounded-md px-3.5 text-xs font-semibold lg:text-sm">
              {t("register")}
            </Button>
          </Link>
          <LanguageSwitcher />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md border border-[#d8ded8] text-primary transition-colors hover:bg-[#eef4ec] lg:hidden"
            aria-controls="mobile-header-menu"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? tCommon("closeMenu") : tCommon("openMenu")}
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
          className="border-t border-[#e5e7eb] bg-white shadow-[0_18px_35px_rgba(21,45,25,0.08)] lg:hidden"
        >
          <Container className="py-3">
            <nav
              className="grid gap-1"
              aria-label={tCommon("appName")}
            >
              {NAV_KEYS.map(({ href, key }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={key}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-[#eef4ec] text-primary"
                        : "text-[#2f3a32] hover:bg-[#f5f8f4] hover:text-primary"
                    }`}
                  >
                    {t(key)}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#edf0ed] pt-3">
              <Link
                href="/login"
                className="min-w-0"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-md border-primary text-sm font-bold text-primary hover:bg-[#e8f5e9]"
                >
                  {t("login")}
                </Button>
              </Link>
              <Link
                href="/register"
                className="min-w-0"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button className="h-11 w-full rounded-md text-sm font-bold">
                  {t("register")}
                </Button>
              </Link>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
