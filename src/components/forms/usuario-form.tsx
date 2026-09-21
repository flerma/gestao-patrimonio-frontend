"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  PROVEDOR_AUTENTICACAO,
  ROLE_USUARIO,
  STATUS_USUARIO,
  type UsuarioRequest,
  type UsuarioResponse,
} from "@/lib/types";
import {
  provedorAutenticacaoLabels,
  roleUsuarioLabels,
  statusUsuarioLabels,
} from "@/lib/labels";
import { useSalvarUsuario } from "@/hooks/use-usuarios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  SelectField,
  TextField,
  enumOptions,
} from "@/components/forms/form-fields";

const schema = z.object({
  nome: z.string().trim().min(1, "Informe o nome"),
  email: z.string().trim().email("E-mail inválido"),
  telefone: z.string().optional(),
  provedorAutenticacao: z.enum(PROVEDOR_AUTENTICACAO),
  idUsuarioProvedor: z.string().optional(),
  status: z.enum(STATUS_USUARIO),
  role: z.enum(ROLE_USUARIO, { required_error: "Selecione o perfil" }),
});

type FormValues = z.infer<typeof schema>;

function toDefaults(usuario?: UsuarioResponse): Partial<FormValues> {
  return {
    nome: usuario?.nome ?? "",
    email: usuario?.email ?? "",
    telefone: usuario?.telefone ?? "",
    provedorAutenticacao: usuario?.provedorAutenticacao ?? "LOCAL",
    idUsuarioProvedor: usuario?.idUsuarioProvedor ?? "",
    status: usuario?.status ?? "ATIVO",
    role: usuario?.role ?? "USUARIO",
  };
}

export function UsuarioForm({ usuario }: { usuario?: UsuarioResponse }) {
  const router = useRouter();
  const salvar = useSalvarUsuario(usuario?.id);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: toDefaults(usuario) as FormValues,
  });

  const onSubmit = (values: FormValues) => {
    const payload: UsuarioRequest = {
      nome: values.nome,
      email: values.email,
      telefone: values.telefone || undefined,
      provedorAutenticacao: values.provedorAutenticacao,
      idUsuarioProvedor: values.idUsuarioProvedor || undefined,
      status: values.status,
      role: values.role,
    };
    salvar.mutate(payload, { onSuccess: () => router.push("/usuarios") });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
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
              label="Telefone (opcional)"
            />
            <SelectField
              control={form.control}
              name="provedorAutenticacao"
              label="Provedor de autenticação"
              options={enumOptions(
                PROVEDOR_AUTENTICACAO,
                provedorAutenticacaoLabels,
              )}
            />
            <SelectField
              control={form.control}
              name="status"
              label="Status"
              options={enumOptions(STATUS_USUARIO, statusUsuarioLabels)}
            />
            <SelectField
              control={form.control}
              name="role"
              label="Perfil"
              placeholder="Selecione o perfil"
              options={enumOptions(ROLE_USUARIO, roleUsuarioLabels)}
            />
            <TextField
              control={form.control}
              name="idUsuarioProvedor"
              label="ID no provedor (opcional)"
              className="sm:col-span-2"
            />
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit" disabled={salvar.isPending}>
            {salvar.isPending ? "Salvando…" : "Salvar usuário"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
