"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Building2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

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

const CRITERIOS_SENHA = [
  {
    label: "Pelo menos 8 caracteres",
    testar: (senha: string) => senha.length >= 8,
  },
  {
    label: "Uma letra maiúscula",
    testar: (senha: string) => /[A-Z]/.test(senha),
  },
  {
    label: "Uma letra minúscula",
    testar: (senha: string) => /[a-z]/.test(senha),
  },
  {
    label: "Um número",
    testar: (senha: string) => /[0-9]/.test(senha),
  },
  {
    label: "Um caractere especial",
    testar: (senha: string) => /[^A-Za-z0-9]/.test(senha),
  },
];

const schema = z
  .object({
    nome: z.string().trim().min(1, "Informe o nome"),
    email: z.string().trim().email("E-mail inválido"),
    telefone: z.string().trim().min(1, "Informe o telefone"),
    senha: z
      .string()
      .refine((senha) => CRITERIOS_SENHA.every((c) => c.testar(senha)), {
        message: "A senha não atende aos critérios exigidos",
      }),
    confirmarSenha: z.string().min(1, "Confirme a senha"),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não conferem",
    path: ["confirmarSenha"],
  });

type FormValues = z.infer<typeof schema>;

function avaliarCriterios(senha: string, confirmarSenha: string) {
  return [
    ...CRITERIOS_SENHA.map((c) => ({
      label: c.label,
      atendido: c.testar(senha),
    })),
    {
      label: "As senhas coincidem",
      atendido: senha.length > 0 && senha === confirmarSenha,
    },
  ];
}

function PasswordChecklist({
  senha,
  confirmarSenha,
}: {
  senha: string;
  confirmarSenha: string;
}) {
  const criterios = avaliarCriterios(senha, confirmarSenha);
  return (
    <ul className="space-y-1 text-sm">
      {criterios.map((criterio) => (
        <li
          key={criterio.label}
          className={cn(
            "flex items-center gap-1.5",
            criterio.atendido ? "text-emerald-600" : "text-destructive",
          )}
        >
          {criterio.atendido ? (
            <Check className="size-3.5 shrink-0" />
          ) : (
            <X className="size-3.5 shrink-0" />
          )}
          {criterio.label}
        </li>
      ))}
    </ul>
  );
}

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

  const senha = useWatch({ control: form.control, name: "senha" }) ?? "";
  const confirmarSenha =
    useWatch({ control: form.control, name: "confirmarSenha" }) ?? "";
  const criteriosAtendidos = avaliarCriterios(senha, confirmarSenha).every(
    (c) => c.atendido,
  );

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
            <PasswordChecklist senha={senha} confirmarSenha={confirmarSenha} />
            <Button
              type="submit"
              className="w-full"
              disabled={registrar.isPending || !criteriosAtendidos}
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
