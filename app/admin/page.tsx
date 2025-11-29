import Image from "next/image";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { CompaniesSectionAdmin } from "./components/company-showcase";
import { Hero } from "@/app/(public)/components/hero";
import { companiesWithPosts } from "@/lib/companiesWithPostsService";
import connectDB from "@/lib/db/mongodb";
import { convertPostsToCases } from "@/lib/api/public";
import { NavbarEditionMode } from "./components/edition-mode-navbar";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  
  if (!token) {
    redirect('/admin/login');
  }

  await connectDB();
  const companies = await companiesWithPosts();

  return (
    <div>
      <NavbarEditionMode />
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
          <CompaniesSectionAdmin companies={convertPostsToCases(companies)} />
        </main>
      </div>
    </div>
  );
}
