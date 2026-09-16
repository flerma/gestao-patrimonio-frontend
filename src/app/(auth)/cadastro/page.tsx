"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/forms/form-fields";
import { useRegistrar } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api";

const schema = z
  .object({
    nome: z.string().trim().min(1, "Informe o nome"),
    email: z.string().trim().email("E-mail inválido"),
    telefone: z.string().trim().min(1, "Informe o telefone"),
    senha: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
    confirmarSenha: z.string().min(1, "Confirme a senha"),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não conferem",
    path: ["confirmarSenha"],
  });

type FormValues = z.infer<typeof schema>;

interface CampoErro {
  campo?: string;
  message?: string;
}

export default function CadastroPage() {
  const router = useRouter();
  const registrar = useRegistrar();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      senha: "",
      confirmarSenha: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    registrar.mutate(values, {
      onSuccess: () => {
        toast.success("Cadastro realizado. Faça login para continuar.");
        router.push("/login");
      },
      onError: (error) => {
        if (error instanceof ApiError && error.body && typeof error.body === "object") {
          const body = error.body as CampoErro;
          if (body.campo === "email" || body.campo === "telefone") {
            form.setError(body.campo, {
              message: body.message ?? "Valor já cadastrado.",
            });
          }
        }
      },
    });
  };

  return (
    <Card>
      <CardHeader className="items-center text-center">
        <span className="mb-2 flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Building2 className="size-6" />
        </span>
        <CardTitle className="text-xl">Criar conta</CardTitle>
        <CardDescription>
          Cadastre-se para acessar o painel de gestão de patrimônio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TextField control={form.control} name="nome" label="Nome" />
            <TextField
              control={form.control}
              name="email"
              label="E-mail"
              type="email"
            />
            <TextField
              control={form.control}
              name="telefone"
              label="Telefone"
            />
            <TextField
              control={form.control}
              name="senha"
              label="Senha"
              type="password"
            />
            <TextField
              control={form.control}
              name="confirmarSenha"
              label="Confirmar senha"
              type="password"
            />
            <Button
              type="submit"
              className="w-full"
              disabled={registrar.isPending}
            >
              {registrar.isPending ? "Cadastrando…" : "Cadastrar"}
            </Button>
            <Button type="button" variant="outline" className="w-full" asChild>
              <Link href="/login">Já tenho conta</Link>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
