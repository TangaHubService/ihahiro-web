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
    <section className="relative overflow-hidden border-b border-[#e8ebe9] bg-black">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          className="hero-3d object-cover object-center"
          sizes="100vw"
        />
      </div>

      <Container className="relative z-10 px-4 sm:px-6 lg:px-10">
        <div className="flex min-h-[80vh] flex-col justify-center py-10 lg:max-w-[52%] lg:py-12">
          <h1 className="font-sans text-[1.9rem] font-bold leading-[1.2] tracking-tight text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.55)] sm:text-4xl xl:text-[2.6rem]">
            {t("heroTitle")}
          </h1>
          <p className="mt-5 max-w-[26rem] text-[0.98rem] leading-[1.7] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:text-[1.08rem]">
            {t("heroSubtitle")}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link href="/listings" className="inline-flex sm:flex-initial">
              <Button className="h-11 min-w-[200px] gap-2 rounded-md px-6 text-[0.95rem] font-semibold shadow-sm sm:h-12 sm:text-base">
                <Search className="size-[1.15rem] shrink-0" aria-hidden />
                {t("ctaMarket")}
              </Button>
            </Link>
            <Link href="/post-harvest" className="inline-flex sm:flex-initial">
              <Button
                variant="outline"
                  className="h-11 min-w-[200px] gap-2 rounded-md border-2 border-white bg-transparent px-6 text-[0.95rem] font-semibold text-white hover:bg-white hover:text-primary sm:h-12 sm:text-base"
              >
                <Plus className="size-[1.15rem] shrink-0" aria-hidden />
                {t("ctaPost")}
              </Button>
            </Link>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-y-4 sm:grid-cols-4 lg:mt-12">
            {trust.map(({ icon: Icon, label }, index) => (
              <li
                key={label}
                className={`flex flex-col items-center justify-center px-2 text-center sm:px-4 ${
                  index < trust.length - 1 ? "sm:border-r sm:border-white" : ""
                }`}
              >
                <span className="flex size-8 items-center justify-center text-white">
                  <Icon className="size-5" strokeWidth={2} aria-hidden />
                </span>
                <span className="mt-2 text-[0.8125rem] font-medium leading-snug text-white">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
