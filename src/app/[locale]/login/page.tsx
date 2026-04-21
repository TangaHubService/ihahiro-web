import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { getTranslations } from "next-intl/server";

export default async function LoginPage() {
  const tNav = await getTranslations("nav");
  const tStub = await getTranslations("stub");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-surface py-12">
        <Container>
          <h1 className="text-2xl font-bold text-primary">{tNav("login")}</h1>
          <p className="mt-2 max-w-xl text-muted">{tStub("body")}</p>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
