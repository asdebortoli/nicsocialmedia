import { CompaniesSection } from "@/app/(public)/components/company-showcase";
import { Hero } from "@/app/(public)/components/hero";
import { fetchCompaniesWithCases } from "@/lib/api/public";
import { Background } from "./components/background";

export default async function HomePage() {
  const companies = await fetchCompaniesWithCases();

  return (
    <div className="relative flex min-h-screen items-center justify-center font-sans">
      <Background />
      <main className="relative z-10 flex min-h-screen w-full max-w-7xl flex-col items-center gap-16 px-6 py-24 sm:items-start md:px-12 lg:px-16 lg:py-32">
        <Hero />
        <CompaniesSection companies={companies} />
      </main>
    </div>
  );
}
