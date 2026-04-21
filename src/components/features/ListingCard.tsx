"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import type { Listing } from "@/lib/types/listing";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export type ListingCardProps = {
  listing: Listing;
};

export function ListingCard({ listing }: ListingCardProps) {
  const tProducts = useTranslations("products");
  const tCommon = useTranslations("common");
  const title = tProducts(listing.productKey);

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-sm">
      <Link href={`/listings/${listing.id}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <div className="relative aspect-[4/3] w-full bg-surface">
          <Image
            src={listing.imageUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover"
          />
          {listing.isNew ? (
            <span className="absolute left-2 top-2">
              <Badge>{tCommon("new")}</Badge>
            </span>
          ) : null}
        </div>
        <div className="space-y-2 p-4">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="flex items-center gap-1 text-sm text-muted">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            {listing.locationLabel}
          </p>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <p className="text-lg font-bold text-primary">
              {listing.pricePerKg} {listing.currency} {tCommon("perKg")}
            </p>
            <p className="text-sm text-muted">
              {tCommon("quantity")}: {listing.quantityKg} {tCommon("kg")}
            </p>
          </div>
          <div className="flex items-center gap-2 border-t border-border pt-3">
            <Image
              src={listing.seller.avatarUrl}
              alt=""
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {listing.seller.displayName}
              </p>
              <p className="text-xs text-muted">{tCommon("farmer")}</p>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
