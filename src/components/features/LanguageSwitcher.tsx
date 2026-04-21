"use client";

import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { ChevronDown, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

const FLAGS: Record<string, string> = {
  rw: "🇷🇼",
  en: "🇬🇧",
  fr: "🇫🇷",
  sw: "🇹🇿",
};

export function LanguageSwitcher() {
  const t = useTranslations("lang");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center">
      <label htmlFor="lang-switch" className="sr-only">
        {t("label")}
      </label>
      <div className="relative flex h-9 items-center rounded-md border border-[#d1d5db] bg-white pl-2 pr-7 shadow-sm">
        <Globe
          className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-primary"
          aria-hidden
        />
        <select
          id="lang-switch"
          value={locale}
          disabled={pending}
          onChange={(e) => {
            const next = e.target.value;
            startTransition(() => {
              router.replace(pathname, { locale: next });
            });
          }}
          className="h-full min-w-[7.5rem] cursor-pointer appearance-none bg-transparent py-1 pl-8 pr-1 text-[0.8125rem] font-medium text-[#1f2937] outline-none lg:min-w-[8.25rem] lg:text-sm"
        >
          {routing.locales.map((loc) => (
            <option key={loc} value={loc}>
              {`${FLAGS[loc] ?? ""} ${t(loc)}`.trim()}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-[#6b7280]"
          aria-hidden
        />
      </div>
    </div>
  );
}
