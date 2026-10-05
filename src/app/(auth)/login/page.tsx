"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";

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
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import logo from "../../icon.png";

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
        <Image
          src={logo}
          alt="Logo Gestão Seu Patrimônio"
          width={64}
          height={64}
          priority
          className="mb-2 size-16"
        />
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
            <div className="-mt-2 flex justify-end">
              <Link
                href="/esqueci-senha"
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Esqueceu a sua senha?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? "Entrando…" : "Login"}
            </Button>
            <Button type="button" variant="outline" className="w-full" asChild>
              <Link href="/cadastro">Cadastrar</Link>
            </Button>
          </form>
        </Form>
        <GoogleLoginButton onSuccess={() => router.push("/")} />
      </CardContent>
    </Card>
  );
}
