import { Plus, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function NavbarEditionMode() {
    return (
      <header className="flex flex-row justify-between max-w-5xl mx-auto px-4 py-3 sm:px-6">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Modo edição</p>
        <div className="flex flex-row gap-2">
        <Button
          asChild
          size="icon"
          aria-label="Adicionar case"
        >
          <Link
            href={`/admin/post/`}
            rel="noreferrer noopener"
          >
            <Plus className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          asChild
          size="icon"
          aria-label="Usuários"
        >
          <Link
            href={`/admin/post/`}
            rel="noreferrer noopener"
          >
            <User className="h-4 w-4" />
          </Link>
        </Button>
        </div>
      </header>
    );
};