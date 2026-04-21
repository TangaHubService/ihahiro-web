import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";
import { Plus, Search } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function HomeBottomCta() {
  const t = await getTranslations("home");
  const tNav = await getTranslations("nav");

  return (
    <section className="bg-white py-8 md:py-10">
      <Container>
        <div className="rounded-xl bg-primary px-6 py-10 text-white md:px-10 md:py-14">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-bold leading-tight md:text-3xl">
              {t("bottomCtaTitle")}
            </h2>
            <p className="mt-2 text-sm text-white/90 md:text-base">{t("featuredSubtitle")}</p>
          </div>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/listings"
              className="inline-flex h-12 min-w-[210px] items-center justify-center gap-2 rounded-md bg-white px-7 text-base font-semibold text-primary shadow-md hover:bg-white/95"
            >
              <Search className="size-5 shrink-0" aria-hidden />
              {t("ctaMarket")}
            </Link>
            <Link
              href="/register"
              className="inline-flex h-12 min-w-[210px] items-center justify-center gap-2 rounded-md border border-white bg-transparent px-7 text-base font-semibold text-white hover:bg-white/10"
            >
              <Plus className="size-5 shrink-0" aria-hidden />
              {tNav("register")}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
