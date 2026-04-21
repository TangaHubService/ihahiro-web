import { ListingCard } from "@/components/features/ListingCard";
import { ListingGallery } from "@/components/listings/ListingGallery";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import type { Listing, Seller } from "@/lib/types/listing";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  ShieldCheck,
  Wheat,
} from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export type ListingDetailProps = {
  listing: Listing;
  seller: Seller;
  related: Listing[];
};

export async function ListingDetail({
  listing,
  seller,
  related,
}: ListingDetailProps) {
  const t = await getTranslations("listingDetail");
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("nav");
  const tProducts = await getTranslations("products");
  const tFooter = await getTranslations("footer");

  const title = tProducts(listing.productKey);
  const wa = `https://wa.me/${seller.whatsapp.replace(/\D/g, "")}`;

  return (
    <Container className="py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">
          {tNav("home")} / {t("breadcrumbLabel")} / {title}
        </p>
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {t("backToMarket")}
        </Link>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="relative">
          {listing.isNew ? (
            <span className="absolute left-3 top-3 z-10 lg:left-4 lg:top-4">
              <Badge>{tCommon("new")}</Badge>
            </span>
          ) : null}
          <ListingGallery listing={listing} />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="mt-2 flex items-center gap-2 text-muted">
            <MapPin className="size-4 shrink-0" aria-hidden />
            {listing.locationLabel}
          </p>
          <p className="mt-4 text-2xl font-bold text-primary">
            {listing.pricePerKg} {listing.currency} {tCommon("perKg")}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="flex gap-2 rounded-lg border border-border bg-white p-3">
              <Package className="size-5 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="text-xs text-muted">{tCommon("available")}</p>
                <p className="text-sm font-medium">
                  {listing.quantityKg} {tCommon("kg")}
                </p>
              </div>
            </div>
            <div className="flex gap-2 rounded-lg border border-border bg-white p-3">
              <CalendarDays className="size-5 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="text-xs text-muted">{tCommon("postedOn")}</p>
                <p className="text-sm font-medium">{listing.postedAt}</p>
              </div>
            </div>
            <div className="flex gap-2 rounded-lg border border-border bg-white p-3">
              <Wheat className="size-5 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="text-xs text-muted">{tCommon("variety")}</p>
                <p className="text-sm font-medium">{listing.variety}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="font-semibold text-foreground">{tCommon("description")}</h2>
            <p className="mt-2 text-sm text-muted">{listing.description}</p>
          </div>

          <ul className="mt-6 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden />
              <span>
                {t("quality")}: {listing.qualityLabel}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden />
              <span>
                {t("province")}: {listing.province}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden />
              <span>
                {t("district")}: {listing.district}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden />
              <span>
                {t("delivery")}: {listing.deliveryNote}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          <h2 className="text-xl font-bold text-primary">{t("youMayLike")}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {related.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center gap-3">
                <Image
                  src={seller.avatarUrl}
                  alt=""
                  width={56}
                  height={56}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-foreground">{seller.displayName}</p>
                  <Badge variant="muted" className="mt-1">
                    {tCommon("farmer")}
                  </Badge>
                </div>
              </div>
              <p className="flex items-center gap-2 text-sm text-muted">
                <MapPin className="size-4" aria-hidden />
                {seller.locationLabel}
              </p>
              <p className="text-sm text-muted">
                {seller.rating.toFixed(1)} ({seller.reviewCount} {tCommon("reviews")})
              </p>
              <p className="text-xs text-muted">
                {tCommon("memberSince")}: {seller.memberSinceLabel}
              </p>
              <div className="flex flex-col gap-2">
                <a href={`tel:${seller.phone.replace(/\s/g, "")}`}>
                  <Button className="w-full gap-2">
                    <Phone className="size-4" aria-hidden />
                    {tCommon("call")}
                  </Button>
                </a>
                <a href={wa} rel="noopener noreferrer" target="_blank">
                  <Button variant="outline" className="w-full">
                    {tCommon("whatsapp")}
                  </Button>
                </a>
                <a
                  href={`mailto:${tFooter("email")}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium text-primary transition-opacity hover:bg-trust"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  {tCommon("message")}
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="border-trust bg-trust/60">
            <CardContent className="flex gap-3 pt-6">
              <ShieldCheck className="size-6 shrink-0 text-primary" aria-hidden />
              <p className="text-sm font-medium text-primary">{tCommon("trustTitle")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground">{t("reportTitle")}</h3>
              <Button variant="outline" className="mt-3 w-full">
                {t("reportCta")}
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
