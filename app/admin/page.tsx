import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { CompaniesSectionAdmin } from "./components/company-showcase";
import { Hero } from "@/app/(public)/components/hero";
import { companiesWithPosts } from "@/lib/companiesWithPostsService";
import connectDB from "@/lib/db/mongodb";
import { convertPostsToCases } from "@/lib/api/public";
import { NavbarEditionMode } from "./components/edition-mode-navbar";
import { Background } from "../(public)/components/background";

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
        <Background />

        <main className="relative z-10 flex min-h-screen w-full max-w-7xl flex-col items-center gap-16 px-6 py-24 sm:items-start md:px-12 lg:px-16 lg:py-32">
          <Hero />
          <CompaniesSectionAdmin companies={convertPostsToCases(companies)} />
        </main>
      </div>
    </div>
  );
}
