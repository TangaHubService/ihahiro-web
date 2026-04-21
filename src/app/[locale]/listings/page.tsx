import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ListingsView } from "@/components/listings/ListingsView";
import { listingFiltersFromSearchParams } from "@/lib/parseListingFilters";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("listingsTitle"),
    description: t("homeDescription"),
  };
}

export default async function ListingsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const initialFilters = listingFiltersFromSearchParams(sp);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-surface py-8">
        <ListingsView initialFilters={initialFilters} />
      </main>
      <Footer />
    </div>
  );
}
