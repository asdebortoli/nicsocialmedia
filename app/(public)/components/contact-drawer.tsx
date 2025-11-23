"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MailIcon } from "lucide-react";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nome é obrigatório" })
    .max(50, { message: "Nome deve ter no máximo 50 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  message: z
    .string()
    .min(1, { message: "Mensagem é obrigatória" })
    .max(500, { message: "Mensagem deve ter no máximo 500 caracteres" }),
});

type ContactFormValues = z.infer<typeof formSchema>;

type ContactDrawerProps = {
  ctaLabel?: string;
};

export function ContactDrawer({ ctaLabel = "Entre em contato!" }: ContactDrawerProps) {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: ContactFormValues) {
    console.log(values);
  }

  return (
    <Drawer>
      <DrawerTrigger>
        <div className="flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground hover:cursor-pointer hover:bg-primary/90">
          <MailIcon className="h-4 w-4" />
          {ctaLabel}
        </div>
      </DrawerTrigger>
      <DrawerContent className="items-center justify-center">
        <DrawerHeader>
          <DrawerTitle>Entre em contato!</DrawerTitle>
          <DrawerDescription>
            Preencha o formulário abaixo para entrar em contato comigo.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mb-10 w-full max-w-2xl space-y-8 px-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome" {...field} />
                  </FormControl>
                  <FormDescription>Digite seu nome completo.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormDescription>Digite seu email para contato.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Mensagem" {...field} />
                  </FormControl>
                  <FormDescription>Digite sua mensagem para contato.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="w-full rounded-full hover:cursor-pointer">
              Enviar
            </Button>
          </form>
        </Form>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Fechar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
