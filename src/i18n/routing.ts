import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["rw", "en", "fr", "sw"],
  defaultLocale: "rw",
  localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];
