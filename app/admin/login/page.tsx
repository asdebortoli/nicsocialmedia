"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { apiPost } from "@/lib/api/instance";
import { error } from "console";

const loginSchema = z.object({
  username: z.string().min(1, "Usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await apiPost("/login", {
        username: values.username,
        password: values.password,
      });

      if (response?.accessToken) {
        localStorage.setItem("token", response.accessToken);
        window.location.href = "/admin";
      }
    } catch (err: any) {
      alert(err.message || "Erro ao fazer login. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#f6f1e9] px-6">
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
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8">
        <h1 className="text-4xl font-semibold text-[#7a8674]">Login</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Usuário</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Admin"
                      className="h-12 rounded-xl border border-muted-foreground/20 bg-white text-base shadow-[0_6px_16px_rgba(0,0,0,0.06)]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      className="h-12 rounded-xl border border-muted-foreground/20 bg-white text-base shadow-[0_6px_16px_rgba(0,0,0,0.06)]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 h-11 rounded-full bg-[#6a52c5] px-6 text-sm font-semibold text-white hover:bg-[#5b45aa]"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
