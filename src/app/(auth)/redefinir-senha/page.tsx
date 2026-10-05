"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";

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
import {
  PasswordChecklist,
  avaliarCriterios,
  senhaAtendeCriterios,
} from "@/components/auth/password-checklist";
import { useRedefinirSenha, useSolicitarCodigoSenha } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api";
import {
  lerEmailRedefinicao,
  limparEmailRedefinicao,
} from "@/lib/auth/redefinicao-senha";
import logo from "../../icon.png";

const schema = z
  .object({
    codigo: z.string().trim().min(1, "Informe o código recebido por e-mail"),
    novaSenha: z.string().refine(senhaAtendeCriterios, {
      message: "A senha não atende aos critérios exigidos",
    }),
    confirmarSenha: z.string().min(1, "Confirme a senha"),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: "As senhas não conferem",
    path: ["confirmarSenha"],
  });

type FormValues = z.infer<typeof schema>;

type Aviso = { tipo: "sucesso" | "erro"; texto: string } | null;

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const redefinir = useRedefinirSenha();
  const reenviar = useSolicitarCodigoSenha({ silencioso: true });
  const [email, setEmail] = React.useState<string | null>(null);
  const [aviso, setAviso] = React.useState<Aviso>(null);

  // O e-mail vem da tela anterior (sessionStorage). Sem ele, volta para lá.
  React.useEffect(() => {
    const salvo = lerEmailRedefinicao();
    if (!salvo) {
      router.replace("/esqueci-senha");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura única de armazenamento externo
    setEmail(salvo);
  }, [router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { codigo: "", novaSenha: "", confirmarSenha: "" },
  });

  const novaSenha = useWatch({ control: form.control, name: "novaSenha" }) ?? "";
  const confirmarSenha = useWatch({ control: form.control, name: "confirmarSenha" }) ?? "";
  const criteriosAtendidos = avaliarCriterios(novaSenha, confirmarSenha).every((c) => c.atendido);

  const onSubmit = (values: FormValues) => {
    if (!email) return;
    setAviso(null);
    redefinir.mutate(
      { email, ...values },
      {
        onSuccess: () => {
          limparEmailRedefinicao();
          toast.success("Senha atualizada. Faça login com a nova senha.");
          router.push("/login");
        },
        onError: (error) => {
          const body = error instanceof ApiError ? (error.body as { campo?: string; message?: string } | null) : null;
          if (body?.campo === "codigo") {
            form.setError("codigo", { message: body.message ?? "Código inválido." });
          } else {
            toast.error(error instanceof ApiError ? error.message : "Não foi possível atualizar a senha.");
          }
        },
      },
    );
  };

  const reenviarCodigo = () => {
    if (!email) return;
    setAviso(null);
    reenviar.mutate(email, {
      onSuccess: () => {
        form.clearErrors("codigo");
        form.setValue("codigo", "");
        setAviso({ tipo: "sucesso", texto: "E-mail enviado com sucesso" });
      },
      onError: (error) =>
        setAviso({
          tipo: "erro",
          texto: error instanceof ApiError ? error.message : "Não foi possível reenviar o código.",
        }),
    });
  };

  return (
    <Card>
      <CardHeader className="items-center text-center">
        <Image src={logo} alt="Logo Gestão Seu Patrimônio" width={64} height={64} className="mb-2 size-16" />
        <CardTitle className="text-xl">Redefinir senha</CardTitle>
        <CardDescription>
          Enviamos um código de verificação para{" "}
          <strong className="text-foreground">{email ?? "o seu e-mail"}</strong>. Ele vale por 30 minutos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {aviso && (
              <p
                role="status"
                className={
                  aviso.tipo === "sucesso"
                    ? "flex items-center gap-1.5 text-sm font-medium text-emerald-600"
                    : "flex items-center gap-1.5 text-sm font-medium text-destructive"
                }
              >
                {aviso.tipo === "sucesso" ? (
                  <CheckCircle2 className="size-4 shrink-0" />
                ) : (
                  <XCircle className="size-4 shrink-0" />
                )}
                {aviso.texto}
              </p>
            )}
            <TextField
              control={form.control}
              name="codigo"
              label="Seu código de verificação"
              autoComplete="one-time-code"
            />
            <TextField
              control={form.control}
              name="novaSenha"
              label="Nova senha"
              type="password"
              autoComplete="new-password"
            />
            <TextField
              control={form.control}
              name="confirmarSenha"
              label="Confirmar senha"
              type="password"
              autoComplete="new-password"
            />
            <PasswordChecklist senha={novaSenha} confirmarSenha={confirmarSenha} />
            <Button
              type="submit"
              className="w-full"
              disabled={!email || redefinir.isPending || !criteriosAtendidos}
            >
              {redefinir.isPending ? "Atualizando…" : "Atualizar senha"}
            </Button>
            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={reenviarCodigo}
                disabled={!email || reenviar.isPending}
                className="font-medium text-primary underline-offset-4 hover:underline disabled:opacity-50"
              >
                {reenviar.isPending ? "Reenviando…" : "Reenviar código"}
              </button>
              <Link href="/login" className="text-muted-foreground underline-offset-4 hover:underline">
                Voltar para o login
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
