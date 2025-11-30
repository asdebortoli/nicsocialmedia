import { Button } from "@/components/ui/button";

import { ArrowBigLeft } from "lucide-react";

export function GoBack() {
    return (
        <div>
            <header className="flex items-center p-4 max-w-5xl mx-auto">
                <Button
                asChild
                size="icon"
                onClick={() => {
                    if (typeof window !== "undefined") {
                        window.history.back();
                    }
                }}
                aria-label="Voltar"
                >
                    <ArrowBigLeft className="h-6 w-6" />
                </Button>
            </header>
        </div>
    );
}