"use client";

import { LanguageSwitcher } from "@/components/features/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { Link, usePathname } from "@/i18n/navigation";
import { Search } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

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
            <span className="mt-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-secondary sm:text-[0.6875rem]">
              {tCommon("tagline")}
            </span>
          </span>
        </Link>

        <nav
          className="mx-4 hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex xl:gap-1"
          aria-label={tCommon("appName")}
        >
          {NAV_KEYS.map(({ href, key }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={key}
                href={href}
                className={`whitespace-nowrap rounded-md px-2 py-2 text-[0.8rem] font-medium transition-colors xl:px-2.5 xl:text-[0.875rem] ${
                  active
                    ? "font-semibold text-primary"
                    : "text-[#374151] hover:text-primary"
                }`}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link
            href="/listings"
            className="inline-flex rounded-md p-2 text-primary hover:bg-trust"
            aria-label={tCommon("search")}
          >
            <Search className="size-5" />
          </Link>
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
        </div>
      </Container>
    </header>
  );
}
