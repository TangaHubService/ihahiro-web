"use client";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { defaultListingFilters } from "@/lib/defaultFilters";
import { useListings } from "@/hooks/useListings";
import { Link } from "@/i18n/navigation";
import { ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function HomeFeaturedGrid() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const tProducts = useTranslations("products");
  const { data, isPending, isError, refetch } = useListings({
    ...defaultListingFilters,
    sort: "newest",
    pageSize: 6,
    page: 1,
  });

  return (
    <section className="bg-white py-8 md:py-10">
      <Container>
        <div>
          <h2 className="text-center text-[2rem] font-bold text-primary">
            {t("featuredTitle")}
          </h2>
          <div className="mt-1 flex justify-end">
            <Link
              href="/listings"
              className="group inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              {tCommon("viewAll")}
              <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {isError ? (
          <Card className="mt-10 p-8 text-center">
            <p className="text-muted">{tCommon("error")}</p>
            <Button className="mt-4" onClick={() => refetch()}>
              {tCommon("retry")}
            </Button>
          </Card>
        ) : null}

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {isPending
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="h-[228px] animate-pulse bg-white" />
              ))
            : data?.items.map((listing) => (
                <Card
                  key={listing.id}
                  className="flex w-full min-w-0 flex-col overflow-hidden rounded-md border border-[#dfe4e1] bg-white shadow-sm"
                >
                  <div className="relative h-[86px] w-full bg-surface">
                    <Image
                      src={listing.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="170px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-2.5">
                    <h3 className="truncate text-[1rem] font-semibold text-foreground">
                      {tProducts(listing.productKey)}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted">
                      <MapPin className="size-3 shrink-0" aria-hidden />
                      <span className="truncate">{listing.locationLabel}</span>
                    </p>
                    <p className="mt-1.5 text-[1.05rem] font-bold text-primary">
                      {listing.pricePerKg} {listing.currency} {tCommon("perKg")}
                    </p>
                    <div className="mt-auto pt-1.5">
                      <Link href={`/listings/${listing.id}`} className="block">
                        <Button className="h-7 w-full rounded-md px-2 text-xs font-semibold">
                          {tCommon("view")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
        </div>
      </Container>
    </section>
  );
}
