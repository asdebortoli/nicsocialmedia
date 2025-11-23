import { ContactDrawer } from "@/app/(public)/components/contact-drawer";

export function Hero() {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Social Media Manager
        </p>
        <h1 className="text-4xl font-semibold text-text md:text-6xl lg:text-7xl">
          Nicoli da Costa
        </h1>
        <p className="text-lg text-text md:text-xl lg:text-2xl">
          Dê uma cara nova para o seu negócio
        </p>
      </div>
      <ContactDrawer />
    </section>
  );
}
