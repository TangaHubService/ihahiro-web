import { Container } from "@/components/layout/Container";
import { Handshake, Leaf, MapPin, Tag } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function HomeValueProps() {
  const t = await getTranslations("home");

  const items = [
    { icon: MapPin, title: t("whyNearbyTitle"), body: t("whyNearbyBody") },
    { icon: Handshake, title: t("whyConnectTitle"), body: t("whyConnectBody") },
    { icon: Tag, title: t("whyPricesTitle"), body: t("whyPricesBody") },
    { icon: Leaf, title: t("whyFarmersTitle"), body: t("whyFarmersBody") },
  ];

  return (
    <section className="bg-white py-10 md:py-12">
      <Container>
        <h2 className="text-center text-[2rem] font-bold text-primary">
          {t("whyTitle")}
        </h2>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="flex items-start gap-3 rounded-md border border-[#dfe4e1] bg-[#fbfcfb] p-4"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-trust text-primary">
                <Icon className="size-5" strokeWidth={1.75} aria-hidden />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
