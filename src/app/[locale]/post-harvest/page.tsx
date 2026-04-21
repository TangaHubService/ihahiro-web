import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  CheckCircle2,
  ImageIcon,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { ProductNameKey } from "@/lib/types/listing";

const productOptions: ProductNameKey[] = [
  "potatoes",
  "beans",
  "maize",
  "bananas",
  "tomatoes",
  "cabbage",
];

export default async function PostHarvestPage() {
  const tNav = await getTranslations("nav");
  const t = await getTranslations("postHarvest");
  const tCommon = await getTranslations("common");
  const tProducts = await getTranslations("products");
  const tips = ["tipPhoto", "tipQuality", "tipPrice", "tipBuyer"] as const;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-[#f7f8f5] py-7">
        <Container>
          <p className="text-sm font-medium text-[#566157]">
            {tNav("home")}
            <span className="mx-2 text-[#a8aea9]">/</span>
            <span className="font-bold text-primary">{tNav("postHarvest")}</span>
          </p>

          <div className="mt-5">
            <h1 className="text-[2.45rem] font-black leading-none tracking-[-0.04em] text-primary sm:text-[3rem]">
              {tNav("postHarvest")}
            </h1>
            <p className="mt-3 max-w-2xl text-[1.03rem] leading-relaxed text-[#505b52]">
              {t("subtitle")}
            </p>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(22rem,1fr)] lg:items-start">
            <form className="rounded-2xl border border-[#dfe5df] bg-white p-5 shadow-[0_18px_55px_rgba(21,45,25,0.05)] sm:p-7">
              <section>
                <h2 className="text-xl font-black text-[#18251a]">
                  {t("sectionProduct")}
                </h2>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <label className="block">
                    <span className="text-sm font-bold text-[#1f2c21]">
                      {t("productLabel")} <span className="text-accent">*</span>
                    </span>
                    <select className="mt-2 h-12 w-full rounded-md border border-[#d8ded8] bg-white px-4 text-sm text-[#6f7771] outline-none focus:border-primary focus:ring-4 focus:ring-primary/10">
                      <option>{t("productPlaceholder")}</option>
                      {productOptions.map((option) => (
                        <option key={option}>{tProducts(option)}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-bold text-[#1f2c21]">
                      {t("quantityLabel")} <span className="text-accent">*</span>
                    </span>
                    <input
                      className="mt-2 h-12 w-full rounded-md border border-[#d8ded8] bg-white px-4 text-sm outline-none placeholder:text-[#939a95] focus:border-primary focus:ring-4 focus:ring-primary/10"
                      placeholder={t("quantityPlaceholder")}
                      type="number"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-bold text-[#1f2c21]">
                      {t("priceLabel")} <span className="text-accent">*</span>
                    </span>
                    <input
                      className="mt-2 h-12 w-full rounded-md border border-[#d8ded8] bg-white px-4 text-sm outline-none placeholder:text-[#939a95] focus:border-primary focus:ring-4 focus:ring-primary/10"
                      placeholder={t("pricePlaceholder")}
                      type="number"
                    />
                  </label>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1.05fr]">
                  <label className="block">
                    <span className="text-sm font-bold text-[#1f2c21]">
                      {t("locationLabel")} <span className="text-accent">*</span>
                    </span>
                    <span className="relative mt-2 block">
                      <MapPin
                        className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#6c756e]"
                        aria-hidden
                      />
                      <input
                        className="h-12 w-full rounded-md border border-[#d8ded8] bg-white pl-11 pr-4 text-sm outline-none placeholder:text-[#939a95] focus:border-primary focus:ring-4 focus:ring-primary/10"
                        placeholder={t("locationPlaceholder")}
                      />
                    </span>
                  </label>

                  <label className="block">
                    <span className="text-sm font-bold text-[#1f2c21]">
                      {t("cellLabel")}
                    </span>
                    <input
                      className="mt-2 h-12 w-full rounded-md border border-[#d8ded8] bg-white px-4 text-sm outline-none placeholder:text-[#939a95] focus:border-primary focus:ring-4 focus:ring-primary/10"
                      placeholder={t("cellPlaceholder")}
                    />
                  </label>
                </div>

                <label className="mt-5 block">
                  <span className="text-sm font-bold text-[#1f2c21]">
                    {t("descriptionLabel")}
                  </span>
                  <span className="relative mt-2 block">
                    <textarea
                      className="min-h-24 w-full resize-none rounded-md border border-[#d8ded8] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#939a95] focus:border-primary focus:ring-4 focus:ring-primary/10"
                      maxLength={200}
                      placeholder={t("descriptionPlaceholder")}
                    />
                    <span className="absolute bottom-3 right-4 text-sm text-[#7a837c]">
                      0/200
                    </span>
                  </span>
                </label>
              </section>

              <section className="mt-7">
                <h2 className="text-xl font-black text-[#18251a]">
                  {t("sectionPhotos")}
                </h2>
                <p className="mt-2 text-sm text-[#657067]">
                  {t("photosHelp")}
                </p>

                <div className="mt-4 flex min-h-20 items-center justify-center rounded-lg border border-dashed border-[#bcc6bf] bg-[#fbfcfb] px-4 py-5 text-center">
                  <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-4">
                    <Upload className="size-9 text-primary" aria-hidden />
                    <div className="text-left">
                      <p className="font-bold text-[#18251a]">
                        {t("uploadTitle")}
                      </p>
                      <p className="mt-1 text-sm text-[#777f79]">
                        {t("uploadBody")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className="flex h-16 items-center justify-center rounded-md border border-[#e0e5e1] bg-white text-2xl text-[#6c746e] hover:border-primary hover:text-primary"
                      aria-label={t("addPhotoAria")}
                    >
                      +
                    </button>
                  ))}
                </div>
              </section>

              <section className="mt-7">
                <h2 className="text-xl font-black text-[#18251a]">
                  {t("sectionContact")}
                </h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-bold text-[#1f2c21]">
                      {t("phoneLabel")} <span className="text-accent">*</span>
                    </span>
                    <span className="relative mt-2 block">
                      <Phone
                        className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#6c756e]"
                        aria-hidden
                      />
                      <input
                        className="h-12 w-full rounded-md border border-[#d8ded8] bg-white pl-11 pr-4 text-sm outline-none placeholder:text-[#939a95] focus:border-primary focus:ring-4 focus:ring-primary/10"
                        placeholder={t("phonePlaceholder")}
                      />
                    </span>
                  </label>

                  <label className="block">
                    <span className="text-sm font-bold text-[#1f2c21]">
                      {t("whatsappLabel")}
                    </span>
                    <span className="relative mt-2 block">
                      <MessageCircle
                        className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary"
                        aria-hidden
                      />
                      <input
                        className="h-12 w-full rounded-md border border-[#d8ded8] bg-white pl-11 pr-4 text-sm outline-none placeholder:text-[#939a95] focus:border-primary focus:ring-4 focus:ring-primary/10"
                        placeholder={t("phonePlaceholder")}
                      />
                    </span>
                  </label>
                </div>
              </section>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 min-w-44 rounded-md border-[#8a958d] bg-white font-bold text-[#263228]"
                >
                  {t("cancel")}
                </Button>
                <Button className="h-12 min-w-56 gap-3 rounded-md font-black">
                  {t("previewButton")}
                  <ArrowRight className="size-5" aria-hidden />
                </Button>
              </div>
            </form>

            <aside className="space-y-5">
              <section className="rounded-2xl bg-[#eef4ec] p-5">
                <h2 className="text-xl font-black text-primary">
                  {t("previewTitle")}
                </h2>
                <div className="mt-6 rounded-xl bg-white p-4 shadow-[0_16px_40px_rgba(21,45,25,0.07)]">
                  <div className="flex gap-4">
                    <div className="flex size-36 shrink-0 items-center justify-center rounded-lg bg-[#ededed] text-[#6b716d]">
                      <ImageIcon className="size-10" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1 py-2">
                      <h3 className="text-lg font-black text-[#1d281f]">
                        {t("previewProductName")}
                      </h3>
                      <p className="mt-3 flex items-center gap-2 text-sm text-[#5f6962]">
                        <MapPin className="size-4" aria-hidden />
                        {t("previewLocation")}
                      </p>
                      <div className="mt-5 flex items-end justify-between gap-3">
                        <p className="text-xl font-black text-primary">
                          000 {tCommon("currency")} {tCommon("perKg")}
                        </p>
                        <p className="text-sm text-[#4f5a52]">{t("previewQuantity")}</p>
                      </div>
                      <p className="mt-4 flex items-center gap-2 text-sm text-[#3e493f]">
                        <Image
                          src="/logo.png"
                          alt=""
                          width={26}
                          height={26}
                          className="size-6 rounded-full object-cover"
                        />
                        {t("previewSeller")}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl bg-[#eef4ec] p-5">
                <h2 className="text-xl font-black text-primary">{t("tipsTitle")}</h2>
                <ul className="mt-5 space-y-4 text-sm text-[#4f5a52]">
                  {tips.map((key) => (
                    <li key={key} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{t(key)}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl bg-[#eef4ec] p-5">
                <h2 className="text-xl font-black text-primary">{t("helpTitle")}</h2>
                <p className="mt-4 text-sm leading-relaxed text-[#4f5a52]">
                  {t("helpBody")}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    className="h-11 gap-2 rounded-md border-primary bg-transparent px-5 font-bold text-primary"
                  >
                    <MessageCircle className="size-4" aria-hidden />
                    {t("contactButton")}
                  </Button>
                  <Button
                    variant="outline"
                    className="h-11 gap-2 rounded-md border-primary bg-transparent px-5 font-bold text-primary"
                  >
                    <Phone className="size-4" aria-hidden />
                    {t("callButton")}
                  </Button>
                </div>
              </section>
            </aside>
          </div>

          <div className="mt-3 flex items-center gap-4 rounded-xl bg-[#eef4ec] p-4">
            <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-white">
              <ShieldCheck className="size-7" aria-hidden />
            </span>
            <div>
              <p className="font-black text-primary">{t("securityTitle")}</p>
              <p className="text-sm text-[#4f5a52]">
                {t("securityBody")}
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
