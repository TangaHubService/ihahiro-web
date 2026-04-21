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
    <section className="relative overflow-hidden border-b border-border bg-[#f7fbf2] py-12 md:py-14">
      <div
        className="absolute left-1/2 top-0 h-48 w-[42rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
        aria-hidden
      />
      <Container>
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-[2.05rem] font-black leading-tight tracking-[-0.035em] text-[#153f19] sm:text-[2.7rem]">
            {t("howTitle")}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-[0.98rem] leading-relaxed text-[#647365]">
            {t("howSubtitle")}
          </p>
          <div className="mx-auto mt-3 h-[3px] w-20 rounded-full bg-primary/30" />
        </div>

        <div className="relative mx-auto mt-9 grid max-w-6xl grid-cols-1 items-stretch gap-4 md:mt-11 md:grid-cols-[1fr_4rem_1fr_4rem_1fr] md:gap-0">
          {steps.map(({ image, title, body }, index) => (
            <Fragment key={title}>
              <article className="group relative flex min-h-full flex-col items-center rounded-[2rem] border border-[#dfeadc] bg-white/95 px-5 pb-7 pt-6 text-center shadow-[0_24px_70px_rgba(26,65,31,0.08)] transition-transform duration-300 hover:-translate-y-1">
                <div
                  className="absolute inset-x-8 top-0 h-1 rounded-b-full bg-gradient-to-r from-primary/20 via-primary to-accent/80"
                  aria-hidden
                />
                <div className="relative">
                  <div className="relative size-32 overflow-hidden rounded-[1.75rem] bg-[#edf5ea] p-1.5 shadow-inner ring-1 ring-primary/10 sm:size-36">
                    <div className="relative h-full w-full overflow-hidden rounded-[1.35rem]">
                      <Image
                        src={image}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 128px, 144px"
                      />
                    </div>
                  </div>
                </div>
                <h3 className="mt-5 text-[1.15rem] font-black leading-snug text-[#173b1b]">
                  {title}
                </h3>
                <p className="mt-2 max-w-[17rem] text-[0.93rem] leading-relaxed text-[#5f6c61]">
                  {body}
                </p>
              </article>
              {index < steps.length - 1 ? (
                <div
                  className="flex items-center justify-center text-primary md:px-2"
                  aria-hidden
                >
                  <div className="h-8 w-px bg-primary/20 md:hidden" />
                  <svg
                    className="hidden drop-shadow-sm md:block"
                    width="56"
                    height="32"
                    viewBox="0 0 56 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 16h39m0 0-9-9m9 9-9 9"
                      stroke="currentColor"
                      strokeWidth="2"
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
