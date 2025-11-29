import { CompanyWithCases } from "@/lib/types/content";
import { ExternalLink, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

type CompaniesSectionProps = {
  companies: CompanyWithCases[];
};

type CompanyCarouselProps = {
  company: CompanyWithCases;
};

export function CompaniesSectionAdmin({ companies }: CompaniesSectionProps) {
  return (
    <div className="flex w-full flex-col gap-16">
      {companies.map((company) => (
        <section
          key={company.id}
          className="flex w-full flex-col items-center justify-center gap-6"
        >
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-text md:text-4xl">
              {company.name}
            </h2>
            {company.description ? (
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                {company.description}
              </p>
            ) : null}
          </div>
          <CompanyCarouselAdmin company={company} />
        </section>
      ))}
    </div>
  );
}

function CompanyCarouselAdmin({ company }: CompanyCarouselProps) {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {company.cases.map((caseStudy) => (
          <CarouselItem
            key={caseStudy.id}
            className="md:basis-1/2 lg:basis-1/3"
          >
            <div className="p-3 py-6">
              <Card className="group relative gap-0 border bg-white px-0 pt-4 shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
                <CardContent className="relative mx-4 aspect-square overflow-hidden rounded-xl border bg-muted p-0">
                  <Image
                    src={caseStudy.thumbnailUrl}
                    alt={caseStudy.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </CardContent>
                <CardFooter className="mt-4 flex flex-col items-stretch gap-2 border-t bg-white/80 px-6 pb-6 pt-4 text-center backdrop-blur-sm">
                  <div className="flex w-full items-center justify-between">
                    <h3 className="text-lg font-semibold">{caseStudy.title}</h3>
                    {caseStudy.link ? (
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        aria-label="Abrir case"
                      >
                        <Link
                          href={caseStudy.link}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    ) : null}
                  </div>                  
                  <div className="flex w-full justify-between">
                    {caseStudy.description ? (
                      <p className="text-sm text-muted-foreground text-left">
                        {caseStudy.description}
                      </p>
                    ) : null}
                    <div className="flex gap-2">
                      <Button
                        asChild
                        size="icon"
                        aria-label="Editar case"
                      >
                        <Link
                          href={`/admin/post/${caseStudy.id}`}
                          rel="noreferrer noopener"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="icon"
                        variant="destructive"
                        aria-label="Deletar case"
                      >
                        <Link
                          href={`/admin/post/${caseStudy.id}`}
                          rel="noreferrer noopener"
                        >
                          <Trash className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}