"use client";

import { Container } from "@/components/layout/Container";
import { defaultListingFilters } from "@/lib/defaultFilters";
import { useListings } from "@/hooks/useListings";
import { Link } from "@/i18n/navigation";
import { ChevronRight, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

export function HomeLiveMarketStrip() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const tProducts = useTranslations("products");
  const { data, isPending, isError } = useListings({
    ...defaultListingFilters,
    sort: "newest",
    pageSize: 5,
    page: 1,
  });

  return (
    <section className="bg-white py-6 md:py-8">
      <Container>
        <div className="rounded-xl border border-[#dce3df] bg-[#f3f6f4] p-4 md:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[1.85rem] font-bold text-primary">{t("liveTitle")}</h2>
            <Link
              href="/listings"
              className="group inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              {tCommon("viewAll")}
              <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {isError ? (
            <p className="py-2 text-sm text-muted">{tCommon("error")}</p>
          ) : null}

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {isPending
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded-md bg-white/70" />
                ))
              : data?.items.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/listings/${listing.id}`}
                    className="rounded-md bg-white p-2.5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <p className="truncate text-[0.92rem] font-semibold text-foreground">
                      {tProducts(listing.productKey)}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {listing.quantityKg} {tCommon("kg")}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted">
                      <MapPin className="size-3 shrink-0" aria-hidden />
                      {listing.locationLabel}
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-primary">
                      {listing.pricePerKg} {listing.currency} {tCommon("perKg")}
                    </p>
                  </Link>
                ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
