"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { useSolicitarCodigoSenha } from "@/hooks/use-auth";
import { guardarEmailRedefinicao } from "@/lib/auth/redefinicao-senha";
import logo from "../../icon.png";

const schema = z.object({
  email: z.string().trim().min(1, "Informe o e-mail").email("E-mail inválido"),
});

type FormValues = z.infer<typeof schema>;

export default function EsqueciSenhaPage() {
  const router = useRouter();
  const solicitar = useSolicitarCodigoSenha();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = ({ email }: FormValues) => {
    solicitar.mutate(email, {
      onSuccess: () => {
        guardarEmailRedefinicao(email);
        router.push("/redefinir-senha");
      },
    });
  };

  return (
    <Card>
      <CardHeader className="items-center text-center">
        <Image src={logo} alt="Logo Gestão Seu Patrimônio" width={64} height={64} className="mb-2 size-16" />
        <CardTitle className="text-xl">Esqueceu a sua senha?</CardTitle>
        <CardDescription>
          Confirme o seu e-mail para receber um código de verificação.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TextField control={form.control} name="email" label="E-mail" type="email" autoComplete="email" />
            <Button type="submit" className="w-full" disabled={solicitar.isPending}>
              {solicitar.isPending ? "Enviando…" : "Receber o código"}
            </Button>
            <Button type="button" variant="outline" className="w-full" asChild>
              <Link href="/login">Voltar para o login</Link>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
