import { Container } from "@/components/layout/Container";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Fragment } from "react";

export async function HomeHowItWorks() {
  const t = await getTranslations("home");

  const steps = [
    {
      image: "/how-it-work1.jpg",
      title: t("step1Title"),
      body: t("step1Body"),
    },
    {
      image: "/how-it-work2.jpg",
      title: t("step2Title"),
      body: t("step2Body"),
    },
    {
      image: "/how-it-work3.jpg",
      title: t("step3Title"),
      body: t("step3Body"),
    },
  ];

  return (
    <section className="border-b border-border bg-white py-10 md:py-12">
      <Container>
        <h2 className="text-center text-[2.05rem] font-bold text-primary">{t("howTitle")}</h2>
        <div className="mx-auto mt-1 h-[2px] w-16 rounded-full bg-primary/25" />

        <div className="mx-auto mt-7 flex max-w-5xl flex-col items-stretch gap-8 md:flex-row md:items-start md:justify-center md:gap-2 lg:gap-5">
          {steps.map(({ image, title, body }, index) => (
            <Fragment key={title}>
              <div className="flex flex-1 flex-col items-center text-center md:max-w-[270px]">
                <div className="relative">
                  <span className="absolute -left-4 -top-2 flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-sm">
                    {index + 1}
                  </span>
                  <div className="relative size-[90px] overflow-hidden rounded-full bg-[#f0f4f0]">
                    <Image
                      src={image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="92px"
                    />
                  </div>
                </div>
                <h3 className="mt-4 text-[1.2rem] font-semibold leading-snug text-foreground">
                  {title}
                </h3>
                <p className="mt-2 max-w-[250px] text-[0.95rem] leading-relaxed text-muted">
                  {body}
                </p>
              </div>
              {index < steps.length - 1 ? (
                <div
                  className="hidden shrink-0 text-secondary md:flex md:items-center md:pt-7"
                  aria-hidden
                >
                  <svg
                    width="40"
                    height="24"
                    viewBox="0 0 40 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 12h28m0 0l-7-7m7 7l-7 7"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              ) : null}
            </Fragment>
          ))}
        </div>
      </Container>
    </section>
  );
}
