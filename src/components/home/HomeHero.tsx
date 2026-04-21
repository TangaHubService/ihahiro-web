"use client";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { CircleDollarSign, MapPin, Plus, Search, ShieldCheck, Users } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const HERO_IMAGE = "/hero.png";

export function HomeHero() {
  const t = useTranslations("home");

  const trust = [
    { icon: ShieldCheck, label: t("trustFresh") },
    { icon: MapPin, label: t("trustNearby") },
    { icon: CircleDollarSign, label: t("trustPrices") },
    { icon: Users, label: t("trustConnect") },
  ];

  return (
    <section className="relative min-h-[34rem] overflow-hidden border-b border-[#e8ebe9] bg-black sm:min-h-[35rem] lg:min-h-[32rem] xl:min-h-[34rem]">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          preload
          unoptimized
          className="h-full w-full object-cover object-[62%_center] sm:object-center"
          sizes="100vw"
        />
      </div>
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.76)_0%,rgba(0,0,0,0.58)_52%,rgba(0,0,0,0.24)_100%)] sm:bg-[linear-gradient(90deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.64)_34%,rgba(0,0,0,0.28)_58%,rgba(0,0,0,0)_82%)]"
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="flex min-h-[34rem] flex-col justify-center py-10 sm:min-h-[35rem] sm:py-12 lg:min-h-[32rem] lg:max-w-[52%] xl:min-h-[34rem]">
          <div className="max-w-[34rem]">
            <h1 className="max-w-[32rem] text-[2.35rem] font-black leading-[1.05] tracking-[-0.045em] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] sm:text-[3.35rem] lg:text-[3.8rem]">
              {t("heroTitle")}
            </h1>
            <p className="mt-5 max-w-[30rem] text-[1.02rem] leading-[1.8] text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] sm:text-[1.18rem]">
              {t("heroSubtitle")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="/listings" className="inline-flex">
                <Button className="h-12 min-w-[210px] gap-3 rounded-md bg-primary px-7 text-[0.96rem] font-bold shadow-[0_14px_28px_rgba(27,94,32,0.22)] hover:bg-[#124817] hover:opacity-100 sm:h-[3.35rem]">
                  <Search className="size-[1.15rem] shrink-0" aria-hidden />
                  {t("ctaMarket")}
                </Button>
              </Link>
              <Link href="/post-harvest" className="inline-flex">
                <Button
                  variant="outline"
                  className="h-12 min-w-[210px] gap-3 rounded-md border-white/75 bg-black/25 px-7 text-[0.96rem] font-bold text-white shadow-[0_12px_30px_rgba(0,0,0,0.14)] backdrop-blur-sm hover:bg-black/40 hover:opacity-100 sm:h-[3.35rem]"
                >
                  <Plus className="size-[1.15rem] shrink-0" aria-hidden />
                  {t("ctaPost")}
                </Button>
              </Link>
            </div>

            <ul className="mt-8 grid grid-cols-2 overflow-hidden rounded-2xl border border-white/15 bg-black/20 shadow-[0_18px_55px_rgba(0,0,0,0.14)] backdrop-blur-sm sm:mt-9 sm:grid-cols-4 sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none sm:backdrop-blur-0">
              {trust.map(({ icon: Icon, label }, index) => (
                <li
                  key={label}
                  className={`flex min-h-24 flex-col items-center justify-center px-3 py-4 text-center ${
                    index % 2 === 0 ? "border-r border-white/15 sm:border-r-0" : ""
                  } ${
                    index < 2 ? "border-b border-white/15 sm:border-b-0" : ""
                  } ${
                    index < trust.length - 1 ? "sm:border-r sm:border-white/25" : ""
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
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
