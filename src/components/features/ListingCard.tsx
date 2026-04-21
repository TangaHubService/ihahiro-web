"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import type { Listing } from "@/lib/types/listing";
import { Heart, MapPin, MessageCircle } from "lucide-react";
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
    <Card className="group overflow-hidden rounded-xl border-[#e3e8e2] shadow-[0_10px_30px_rgba(21,45,25,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(21,45,25,0.1)]">
      <Link
        href={`/listings/${listing.id}`}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="relative aspect-[2.05/1] w-full overflow-hidden bg-surface">
          <Image
            src={listing.imageUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {listing.isNew ? (
            <span className="absolute left-3 top-3">
              <Badge className="rounded-md bg-primary px-2.5 py-1 font-bold text-white shadow-sm">
                {tCommon("new")}
              </Badge>
            </span>
          ) : null}
          <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-black/10 text-white backdrop-blur-sm ring-1 ring-white/40">
            <Heart className="size-5" strokeWidth={2.2} aria-hidden />
          </span>
        </div>
        <div className="space-y-3 p-4">
          <div>
            <h3 className="text-[1.05rem] font-bold leading-tight text-[#18251a]">
              {title}
            </h3>
            <p className="mt-1 flex items-center gap-1 text-[0.82rem] text-[#6d756e]">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              {listing.locationLabel}
            </p>
          </div>

          <div className="flex items-end justify-between gap-2">
            <p className="text-[1.05rem] font-black text-primary">
              {listing.pricePerKg} {listing.currency} {tCommon("perKg")}
            </p>
            <p className="text-sm font-medium text-[#4d554f]">
              {listing.quantityKg} {tCommon("kg")}
            </p>
          </div>

          <div className="flex items-center gap-2 border-t border-[#edf0ed] pt-3">
            <Image
              src={listing.seller.avatarUrl}
              alt=""
              width={30}
              height={30}
              className="size-8 rounded-full object-cover ring-1 ring-primary/10"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#2f3b31]">
                {listing.seller.displayName}
              </p>
              <p className="text-[0.72rem] font-semibold text-primary/80">
                {tCommon("farmer")}
              </p>
            </div>
            <span className="flex size-9 items-center justify-center rounded-md border border-primary/25 text-primary">
              <MessageCircle className="size-4" aria-hidden />
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
