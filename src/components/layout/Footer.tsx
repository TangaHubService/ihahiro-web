import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";
import { Camera, Mail, MapPin, Phone, Share2 } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tLang = await getTranslations("lang");
  const tCommon = await getTranslations("common");
  const year = new Date().getFullYear();

  const linkClass = "text-sm text-white/90 hover:text-white";
  const flags: Record<"rw" | "en" | "fr" | "sw", string> = {
    rw: "🇷🇼",
    en: "🇬🇧",
    fr: "🇫🇷",
    sw: "🇹🇿",
  };

  return (
    <footer className="mt-auto bg-[#04531c] text-primary-foreground">
      <Container className="grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-6">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt=""
              width={52}
              height={52}
              className="size-12 object-contain"
            />
            <span className="font-semibold">{tCommon("appName")}</span>
          </Link>
          <p className="max-w-[220px] text-sm leading-relaxed text-white/85">{t("mission")}</p>
          <div className="flex gap-3">
            <a
              href="https://facebook.com"
              className="rounded-full border border-white/30 p-2 hover:bg-white/10"
              aria-label="Facebook"
            >
              <Share2 className="size-4" />
            </a>
            <a
              href="https://instagram.com"
              className="rounded-full border border-white/30 p-2 hover:bg-white/10"
              aria-label="Instagram"
            >
              <Camera className="size-4" />
            </a>
            <a
              href={`https://wa.me/${t("phone").replace(/\D/g, "")}`}
              className="rounded-full border border-white/30 p-2 hover:bg-white/10"
              aria-label="WhatsApp"
            >
              <Phone className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">{t("linksTitle")}</h3>
          <ul className="space-y-2">
            <li>
              <Link className={linkClass} href="/listings">
                {tNav("market")}
              </Link>
            </li>
            <li>
              <Link className={linkClass} href="/how-it-works">
                {tNav("howItWorks")}
              </Link>
            </li>
            <li>
              <Link className={linkClass} href="/about">
                {tNav("about")}
              </Link>
            </li>
            <li>
              <Link className={linkClass} href="/contact">
                {tNav("contact")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">{t("supportTitle")}</h3>
          <ul className="space-y-2">
            <li>
              <Link className={linkClass} href="/how-it-works">
                {tNav("howItWorks")}
              </Link>
            </li>
            <li>
              <Link className={linkClass} href="/post-harvest">
                {tNav("postHarvest")}
              </Link>
            </li>
            <li>
              <Link className={linkClass} href="/about">
                {tNav("about")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">{t("contactTitle")}</h3>
          <ul className="space-y-3 text-sm text-white/90">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 shrink-0" aria-hidden />
              <a href={`tel:${t("phone").replace(/\s/g, "")}`}>{t("phone")}</a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 size-4 shrink-0" aria-hidden />
              <a href={`mailto:${t("email")}`}>{t("email")}</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>{t("address")}</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">{t("languageTitle")}</h3>
          <ul className="space-y-1 text-sm text-white/90">
            {(["rw", "en", "fr", "sw"] as const).map((loc) => (
              <li key={loc}>
                <Link href="/" locale={loc} className={linkClass}>
                  {flags[loc]} {tLang(loc)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <div className="py-4 text-center text-xs text-white/80">
        {t("rights", { year })}
      </div>
    </footer>
  );
}
