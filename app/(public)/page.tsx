import Image from "next/image";

import { CompaniesSection } from "@/app/(public)/components/company-showcase";
import { Hero } from "@/app/(public)/components/hero";
import { fetchCompaniesWithCases } from "@/lib/api/public";

export default async function HomePage() {
  const companies = await fetchCompaniesWithCases();

  return (
    <div className="relative flex min-h-screen items-center justify-center font-sans">
      <Image
        src="/left-bg.svg"
        alt=""
        width={387}
        height={222}
        className="pointer-events-none absolute -left-50 md:left-0 top-96 z-0"
        aria-hidden="true"
      />
      <Image
        src="/right-bg.svg"
        alt=""
        width={600}
        height={234}
        className="pointer-events-none absolute -right-50 md:right-0 top-50 z-0"
        aria-hidden="true"
      />

      <main className="relative z-10 flex min-h-screen w-full max-w-7xl flex-col items-center gap-16 px-6 py-24 sm:items-start md:px-12 lg:px-16 lg:py-32">
        <Hero />
        <CompaniesSection companies={companies} />
      </main>
    </div>
  );
}
