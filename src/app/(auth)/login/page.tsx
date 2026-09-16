"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useLogin } from "@/hooks/use-auth";

const schema = z.object({
  usuario: z.string().trim().min(1, "Informe o usuário"),
  senha: z.string().min(1, "Informe a senha"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { usuario: "", senha: "" },
  });

  const onSubmit = (values: FormValues) => {
    login.mutate(values, { onSuccess: () => router.push("/") });
  };

  return (
    <Card>
      <CardHeader className="items-center text-center">
        <span className="mb-2 flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Building2 className="size-6" />
        </span>
        <CardTitle className="text-xl">Entrar</CardTitle>
        <CardDescription>
          Acesse o painel de gestão de patrimônio imobiliário.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TextField control={form.control} name="usuario" label="Usuário" />
            <TextField
              control={form.control}
              name="senha"
              label="Senha"
              type="password"
            />
            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? "Entrando…" : "Login"}
            </Button>
            <Button type="button" variant="outline" className="w-full" asChild>
              <Link href="/cadastro">Cadastrar</Link>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
