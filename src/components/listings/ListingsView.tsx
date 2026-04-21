"use client";

import { ListingCard } from "@/components/features/ListingCard";
import { ProductFilter } from "@/components/features/ProductFilter";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useListings } from "@/hooks/useListings";
import { Link } from "@/i18n/navigation";
import type { ListingFilters } from "@/lib/types/listing";
import { Plus } from "lucide-react";
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
  const { data, isPending, isError, refetch } = useListings(queryFilters);

  return (
    <Container>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-muted">
            {t("breadcrumbHome")} / {t("breadcrumbMarket")}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-primary">{t("title")}</h1>
          <p className="mt-1 max-w-xl text-muted">{t("subtitle")}</p>
        </div>
        <Card className="flex w-full max-w-md items-center gap-4 p-4 lg:shrink-0">
          <div className="relative hidden size-16 shrink-0 sm:block">
            <Image
              src="/logo.png"
              alt=""
              fill
              className="object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground">{t("ctaSellTitle")}</p>
            <p className="text-sm text-muted">{t("ctaSellBody")}</p>
            <Link href="/post-harvest" className="mt-3 inline-block">
              <Button className="gap-2">
                <Plus className="size-4" aria-hidden />
                {t("ctaSellButton")}
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="mt-10 flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-72">
          <Card className="lg:sticky lg:top-24">
            <ProductFilter value={filters} onChange={setFilters} />
          </Card>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {tCommon("resultsCount", { count: data?.total ?? 0 })}
            </p>
          </div>

          {isError ? (
            <Card className="mt-6 p-8 text-center">
              <p className="text-muted">{tCommon("error")}</p>
              <Button className="mt-4" onClick={() => refetch()}>
                {tCommon("retry")}
              </Button>
            </Card>
          ) : null}

          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {isPending
              ? Array.from({ length: filters.pageSize }).map((_, i) => (
                  <Card key={i} className="h-96 animate-pulse bg-surface" />
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
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="outline"
                disabled={filters.page <= 1 || isPending}
                onClick={() =>
                  setFilters((f) => ({ ...f, page: Math.max(1, f.page - 1) }))
                }
              >
                {tCommon("prev")}
              </Button>
              <span className="text-sm text-muted">
                {tCommon("page")} {filters.page}
              </span>
              <Button
                variant="outline"
                disabled={!data.hasMore || isPending}
                onClick={() =>
                  setFilters((f) => ({ ...f, page: f.page + 1 }))
                }
              >
                {tCommon("next")}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </Container>
  );
}
