"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Cookie from "js-cookie";
import * as z from "zod";
import { redirect, useParams } from "next/navigation";

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
import { Textarea } from "@/components/ui/textarea";

import { apiPostForm, apiGet, apiPutForm } from "@/lib/api/instance";
import { Background } from "@/app/(public)/components/background";

import {FILE_CONFIG} from "@/lib/utils";
import { GoBack } from "../../components/go-back";


const checkFileType = (file: File) => {
  return FILE_CONFIG.ALLOWED_TYPES.includes(file.type);
}

const fileSchema = z.object({
  file: z
    .any()
    .refine((file) => file instanceof File && file.size > 0, {
      message: 'Arquivo deve ser anexado',
    })
    .refine(checkFileType, {
      message: `Tipo de arquivo não suportado. Tipos disponíveis: ${FILE_CONFIG.ALLOWED_TYPES.join(', ')}`,
    }),
});
  
const postSchema = z.object({
    title: z.string().min(1, "Título é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    company: z.string().min(1, "Empresa é obrigatória"),
    link: z.url("Link deve ser uma URL válida"),
    image: fileSchema.optional()
});

type PostFormValues = z.infer<typeof postSchema>;

export default function AdminPostPage() {
  const params = useParams();
  const postId = params?.id?.[0];
  const isEditMode = postId !== undefined;

  const token = Cookie.get("token");
  if (!token) {
    redirect('/admin/login');
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
        title: "",
        description: "",
        company: "",
        link: "",
        image: undefined
    },
  });

  useEffect(() => {
    if (isEditMode) {
      loadPost();
    }
  }, [postId]);

  const loadPost = async () => {
    setIsLoading(true);
    try {
      const response = await apiGet(`/posts/${postId}`);
      form.reset({
        title: response.title,
        description: response.description,
        company: response.company,
        link: response.link,
        image: undefined
      });
    } catch (err: any) {
      alert(err.message || "Erro ao carregar post.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: PostFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('company', values.company);
      formData.append('link', values.link);
      
      if (values.image?.file) {
        formData.append('image', values.image.file);
      }

      if (isEditMode) {
        await apiPutForm(`/posts/${postId}`, formData, token);
        alert('Post atualizado');
      } else {
        await apiPostForm("/posts", formData, token);
        form.reset();
      }
    } catch (err: any) {
      alert(err.message || `Erro ao ${isEditMode ? 'atualizar' : 'criar'} post. Tente novamente.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-[#f6f1e9] px-6">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#f6f1e9] px-6">
      <GoBack/>
        <Background />
        <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8">
          <h1 className="text-4xl font-semibold text-[#7a8674]">
            {isEditMode ? 'Editar postagem' : 'Adicionar postagem'}
          </h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Título</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Título"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descrição rápida sobre a postagem"
                        className="w-full h-24 rounded-xl border border-muted-foreground/20 p-3 bg-white text-base shadow-[0_6px_16px_rgba(0,0,0,0.06)] resize-vertical focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Empresa</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Empresa/Organização/Projeto"
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
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://exemplo-post-instagram.com"
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
                  name="image"
                  render={({ field }) => (
                      <FormItem>
                          <FormLabel className="sr-only">
                            Imagem {isEditMode && '(opcional - deixe vazio para manter atual)'}
                          </FormLabel>
                          <FormControl>
                              <Input
                                  type="file"
                                  accept={FILE_CONFIG.ALLOWED_TYPES.join(",")}
                                  className="h-12 rounded-xl border border-muted-foreground/20 bg-white text-base shadow-[0_6px_16px_rgba(0,0,0,0.06)]"
                                  onChange={(e) => {
                                      const file = e.target.files && e.target.files[0];
                                      field.onChange(file ? { file } : undefined);
                                  }}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
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
                {isSubmitting ? (isEditMode ? "Atualizando..." : "Criando...") : (isEditMode ? "Atualizar" : "Criar")}
              </Button>
            </form>
          </Form>
        </div>
      </div>
  );
}