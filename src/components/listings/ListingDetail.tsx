import { ListingCard } from "@/components/features/ListingCard";
import { Container } from "@/components/layout/Container";
import { ListingGallery } from "@/components/listings/ListingGallery";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import type { Listing, Seller } from "@/lib/types/listing";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Flag,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Shield,
  ShieldCheck,
  Star,
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
  const phoneHref = `tel:${seller.phone.replace(/\s/g, "")}`;

  return (
    <Container className="py-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-medium text-[#5c665f]">
          {tNav("home")}
          <span className="mx-2 text-[#a8aea9]">/</span>
          {t("breadcrumbLabel")}
          <span className="mx-2 text-[#a8aea9]">/</span>
          <span className="font-bold text-primary">{title}</span>
        </p>
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {t("backToMarket")}
        </Link>
      </div>

      <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.78fr)_26rem] xl:items-start">
        <ListingGallery listing={listing} />

        <section className="min-w-0">
          <h1 className="text-[2.35rem] font-black leading-none tracking-[-0.04em] text-[#1d251f]">
            {title}
          </h1>
          <p className="mt-4 flex items-center gap-2 text-[#475148]">
            <MapPin className="size-4 shrink-0" aria-hidden />
            {listing.locationLabel}
          </p>
          <p className="mt-5 text-[2rem] font-black text-primary">
            {listing.pricePerKg} {listing.currency} {tCommon("perKg")}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-4 border-b border-[#dfe5df] pb-6">
            <div className="flex items-start gap-3">
              <Package className="mt-1 size-5 text-primary" aria-hidden />
              <div>
                <p className="text-sm text-[#5d665f]">{tCommon("available")}</p>
                <p className="mt-1 font-bold text-[#222b24]">
                  {listing.quantityKg} {tCommon("kg")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-1 size-5 text-primary" aria-hidden />
              <div>
                <p className="text-sm text-[#5d665f]">{tCommon("postedOn")}</p>
                <p className="mt-1 font-bold text-[#222b24]">{listing.postedAt}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Wheat className="mt-1 size-5 text-primary" aria-hidden />
              <div>
                <p className="text-sm text-[#5d665f]">{tCommon("variety")}</p>
                <p className="mt-1 font-bold text-[#222b24]">{listing.variety}</p>
              </div>
            </div>
          </div>

          <section className="mt-7">
            <h2 className="text-xl font-black text-[#18251a]">
              {tCommon("description")}
            </h2>
            <p className="mt-3 leading-8 text-[#485249]">{listing.description}</p>
            <p className="mt-1 leading-8 text-[#485249]">
              {t("dailyUse")}
            </p>
          </section>

          <section className="mt-5 rounded-xl bg-[#eef4ec] p-5">
            <ul className="space-y-4 text-[#2f3b31]">
              <li className="flex items-start gap-3">
                <BadgeCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                <span>
                  <strong>{t("quality")}:</strong> {listing.qualityLabel}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                <span>
                  <strong>{t("province")}:</strong> {listing.province}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                <span>
                  <strong>{t("district")}:</strong> {listing.district}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                <span>
                  <strong>{t("delivery")}:</strong> {listing.deliveryNote}
                </span>
              </li>
            </ul>
          </section>
        </section>

        <aside className="space-y-5">
          <Card className="rounded-xl border-[#dfe5df] p-5 shadow-[0_16px_45px_rgba(21,45,25,0.05)]">
            <h2 className="text-xl font-black text-[#18251a]">
              {tCommon("seller")}
            </h2>
            <div className="mt-5 flex items-center gap-4">
              <Image
                src={seller.avatarUrl}
                alt=""
                width={88}
                height={88}
                className="size-24 rounded-full object-cover"
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xl font-black text-[#18251a]">
                    {seller.displayName}
                  </p>
                  <Badge className="bg-trust font-bold text-primary">
                    {tCommon("farmer")}
                  </Badge>
                </div>
                <p className="mt-2 flex items-center gap-2 text-[#4e594f]">
                  <MapPin className="size-4" aria-hidden />
                  {seller.locationLabel}
                </p>
                <p className="mt-3 flex items-center gap-2 text-[#4e594f]">
                  <Star className="size-4 fill-[#f4c542] text-[#f4c542]" />
                  {seller.rating.toFixed(1)} ({seller.reviewCount} {tCommon("reviews")})
                </p>
              </div>
            </div>
            <p className="mt-4 text-[#4e594f]">
              {tCommon("memberSince")}: {seller.memberSinceLabel}
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <a href={phoneHref}>
                <Button className="h-12 w-full gap-2 rounded-md text-base font-black">
                  <Phone className="size-5" aria-hidden />
                  {tCommon("call")}
                </Button>
              </a>
              <a href={wa} rel="noopener noreferrer" target="_blank">
                <Button
                  variant="outline"
                  className="h-12 w-full gap-2 rounded-md border-primary bg-white text-base font-black text-primary"
                >
                  <MessageCircle className="size-5" aria-hidden />
                  {tCommon("whatsapp")}
                </Button>
              </a>
              <a href={`mailto:${tFooter("email")}`}>
                <Button
                  variant="ghost"
                  className="h-12 w-full gap-2 rounded-md bg-[#eef4ec] text-base font-black text-primary"
                >
                  <MessageCircle className="size-5" aria-hidden />
                  {tCommon("message")}
                </Button>
              </a>
            </div>

            <div className="mt-7 rounded-xl bg-[#eef4ec] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-black text-primary">
                    {t("trustBuyerTitle")}
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm text-[#3f4b42]">
                    <li className="flex gap-2">
                      <ShieldCheck className="size-4 shrink-0 text-primary" />
                      {t("trustBuyerRealSeller")}
                    </li>
                    <li className="flex gap-2">
                      <ShieldCheck className="size-4 shrink-0 text-primary" />
                      {t("trustBuyerNoHiddenFees")}
                    </li>
                    <li className="flex gap-2">
                      <ShieldCheck className="size-4 shrink-0 text-primary" />
                      {t("trustBuyerVerified")}
                    </li>
                  </ul>
                </div>
                <Shield className="size-20 text-primary/20" strokeWidth={1.5} />
              </div>
            </div>
          </Card>
        </aside>
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_26rem]">
        <section>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black text-primary">{t("youMayLike")}</h2>
            <Link href="/listings" className="font-bold text-primary hover:underline">
              {tCommon("viewAll")} -&gt;
            </Link>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        </section>

        <Card className="h-fit rounded-xl border-[#dfe5df] p-6">
          <h3 className="text-xl font-black text-primary">{t("reportTitle")}</h3>
          <p className="mt-4 text-[#4f5a52]">
            {t("reportQuestion")}
          </p>
          <Button
            variant="outline"
            className="mt-5 h-11 gap-2 rounded-md border-[#dfe5df] bg-white px-6 font-bold text-primary"
          >
            <Flag className="size-4" aria-hidden />
            {t("reportCta")}
          </Button>
        </Card>
      </div>
    </Container>
  );
}
