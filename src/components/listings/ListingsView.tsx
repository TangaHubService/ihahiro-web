"use client";

import { ListingCard } from "@/components/features/ListingCard";
import { ProductFilter } from "@/components/features/ProductFilter";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useListings } from "@/hooks/useListings";
import { Link } from "@/i18n/navigation";
import { LISTING_CATEGORIES } from "@/lib/constants/categories";
import type { ListingFilters } from "@/lib/types/listing";
import {
  Banana,
  Bean,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  LeafyGreen,
  List,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  ShoppingCart,
  Sprout,
  Wheat,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

export type ListingsViewProps = {
  initialFilters: ListingFilters;
};

export function ListingsView({ initialFilters }: ListingsViewProps) {
  const [filters, setFilters] = useState(initialFilters);
  const debouncedQ = useDebouncedValue(filters.q, 350);
  const queryFilters = { ...filters, q: debouncedQ };
  const t = useTranslations("listings");
  const tCommon = useTranslations("common");
  const tCategories = useTranslations("categories");
  const tFilters = useTranslations("filters");
  const { data, isPending, isError, refetch } = useListings(queryFilters);
  const pageCount = data ? Math.max(1, Math.ceil(data.total / filters.pageSize)) : 1;
  const categoryIcons: Record<ListingFilters["category"], LucideIcon> = {
    all: ShoppingCart,
    grains: Wheat,
    legumes: Bean,
    vegetables: LeafyGreen,
    fruits: Banana,
    tubers: Sprout,
    other: MoreHorizontal,
  };
  const categoryTabs: Array<{
    value: ListingFilters["category"];
    label: string;
    Icon: LucideIcon;
  }> = [
    { value: "all", label: tFilters("all"), Icon: categoryIcons.all },
    ...LISTING_CATEGORIES.map((category) => ({
      value: category,
      label: tCategories(category),
      Icon: categoryIcons[category],
    })),
  ];

  function patchFilters(partial: Partial<ListingFilters>) {
    setFilters((current) => ({ ...current, ...partial, page: 1 }));
  }

  return (
    <Container className="py-7">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-center">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#536057]">
            {t("breadcrumbHome")}
            <span className="mx-2 text-[#a5ada7]">/</span>
            <span className="font-semibold text-primary">{t("breadcrumbMarket")}</span>
          </p>
          <h1 className="mt-4 text-[2.45rem] font-black leading-none tracking-[-0.04em] text-primary sm:text-[3rem]">
            {t("title")}
          </h1>
          <p className="mt-3 max-w-2xl text-[1.02rem] leading-relaxed text-[#4e584f]">
            {t("subtitle")}
          </p>
        </div>
        <Card className="flex items-center gap-4 rounded-2xl border-0 bg-[#eaf2e7] p-4 shadow-none">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-white/60">
            <Image
              src="/logo.png"
              alt=""
              fill
              className="object-contain p-2"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-black text-[#18251a]">{t("ctaSellTitle")}</p>
            <p className="mt-1 text-sm leading-relaxed text-[#4e5a50]">
              {t("ctaSellBody")}
            </p>
            <Link href="/post-harvest" className="mt-3 inline-flex">
              <Button className="h-10 gap-2 rounded-md px-5 text-sm font-bold">
                <Plus className="size-4" aria-hidden />
                {t("ctaSellButton")}
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <form
        className="mt-7 grid gap-3 lg:grid-cols-[minmax(0,1fr)_18rem_12rem]"
        onSubmit={(event) => {
          event.preventDefault();
          patchFilters({});
        }}
      >
        <label className="relative block">
          <Search
            className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-[#7d867f]"
            aria-hidden
          />
          <input
            value={filters.q}
            onChange={(event) => patchFilters({ q: event.target.value })}
            placeholder={t("searchPlaceholder")}
            className="h-14 w-full rounded-lg border border-[#d8ddd8] bg-white pl-14 pr-4 text-[0.96rem] text-[#18251a] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </label>
        <label className="relative block">
          <MapPin
            className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-[#7d867f]"
            aria-hidden
          />
          <input
            value={filters.location}
            onChange={(event) => patchFilters({ location: event.target.value })}
            placeholder={t("locationPlaceholder")}
            className="h-14 w-full rounded-lg border border-[#d8ddd8] bg-white pl-14 pr-4 text-[0.96rem] text-[#18251a] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </label>
        <Button type="submit" className="h-14 rounded-lg text-base font-black">
          {tCommon("search")}
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-5 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-[18rem]">
          <Card className="overflow-hidden rounded-2xl border-[#e0e6df] shadow-[0_14px_45px_rgba(21,45,25,0.05)] lg:sticky lg:top-24">
            <ProductFilter value={filters} onChange={setFilters} />
          </Card>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="rounded-2xl border border-[#e4e9e3] bg-white p-3 shadow-[0_14px_45px_rgba(21,45,25,0.04)]">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="-mx-1 flex gap-1 overflow-x-auto px-1">
                {categoryTabs.map(({ value, label, Icon }) => {
                  const active = filters.category === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => patchFilters({ category: value })}
                      className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-bold transition-colors ${
                        active
                          ? "border-primary text-primary"
                          : "border-transparent text-[#3f4a41] hover:border-primary/30 hover:text-primary"
                      }`}
                    >
                      <Icon className="size-4" strokeWidth={2.2} aria-hidden />
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-3 px-1 xl:justify-end">
                <p className="text-sm font-medium text-[#626d64]">
                  {tCommon("resultsCount", { count: data?.total ?? 0 })}
                </p>
                <div className="flex rounded-lg bg-[#f3f6f2] p-1 text-primary">
                  <button
                    type="button"
                    className="flex size-9 items-center justify-center rounded-md bg-primary text-white"
                    aria-label={t("gridView")}
                  >
                    <LayoutGrid className="size-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    className="flex size-9 items-center justify-center rounded-md text-[#4f5b52]"
                    aria-label={t("listView")}
                  >
                    <List className="size-4" aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isError ? (
            <Card className="mt-6 p-8 text-center">
              <p className="text-muted">{tCommon("error")}</p>
              <Button className="mt-4" onClick={() => refetch()}>
                {tCommon("retry")}
              </Button>
            </Card>
          ) : null}

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isPending
              ? Array.from({ length: filters.pageSize }).map((_, i) => (
                  <Card key={i} className="h-80 animate-pulse rounded-xl bg-white" />
                ))
              : data?.items.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
          </div>

          {!isPending && data?.items.length === 0 ? (
            <Card className="mt-6 p-8 text-center text-muted">
              {tCommon("noResults")}
            </Card>
          ) : null}

          {data && data.total > 0 ? (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <Button
                variant="outline"
                className="size-10 rounded-md border-[#dfe5df] bg-white p-0"
                aria-label={tCommon("prev")}
                disabled={filters.page <= 1 || isPending}
                onClick={() =>
                  setFilters((f) => ({ ...f, page: Math.max(1, f.page - 1) }))
                }
              >
                <ChevronLeft className="size-4" aria-hidden />
              </Button>
              {Array.from({ length: pageCount }).map((_, index) => {
                const page = index + 1;
                return (
                  <Button
                    key={page}
                    variant={filters.page === page ? "primary" : "outline"}
                    className={`size-10 rounded-md p-0 text-sm font-bold ${
                      filters.page === page
                        ? ""
                        : "border-[#dfe5df] bg-white text-[#28332a]"
                    }`}
                    disabled={isPending}
                    onClick={() => setFilters((f) => ({ ...f, page }))}
                  >
                    {page}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                className="size-10 rounded-md border-[#dfe5df] bg-white p-0"
                aria-label={tCommon("next")}
                disabled={!data.hasMore || isPending}
                onClick={() =>
                  setFilters((f) => ({ ...f, page: f.page + 1 }))
                }
              >
                <ChevronRight className="size-4" aria-hidden />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </Container>
  );
}
