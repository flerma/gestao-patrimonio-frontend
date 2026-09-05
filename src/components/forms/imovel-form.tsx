"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  STATUS_IMOVEL,
  TIPO_IMOVEL,
  type ImovelRequest,
  type ImovelResponse,
} from "@/lib/types";
import { statusImovelLabels, tipoImovelLabels } from "@/lib/labels";
import { useSalvarImovel } from "@/hooks/use-imoveis";
import { useUsuarios } from "@/hooks/use-usuarios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  SelectField,
  TextField,
  enumOptions,
} from "@/components/forms/form-fields";

const schema = z.object({
  usuarioId: z.string().min(1, "Selecione o proprietário"),
  nome: z.string().trim().min(1, "Informe o nome do imóvel"),
  tipo: z.enum(TIPO_IMOVEL),
  status: z.enum(STATUS_IMOVEL),
  valorAquisicao: z
    .number({ invalid_type_error: "Informe o valor de aquisição" })
    .min(0, "Valor inválido"),
  valorAtual: z
    .number({ invalid_type_error: "Informe o valor atual" })
    .min(0, "Valor inválido"),
  endereco: z.object({
    cep: z.string().optional(),
    logradouro: z.string().optional(),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().max(2, "Use a sigla (ex.: SP)").optional(),
    pais: z.string().optional(),
  }),
});

type FormValues = z.infer<typeof schema>;

function toDefaults(imovel?: ImovelResponse): Partial<FormValues> {
  return {
    usuarioId: imovel?.usuario?.id ?? "",
    nome: imovel?.nome ?? "",
    tipo: imovel?.tipo,
    status: imovel?.status ?? "DISPONIVEL",
    valorAquisicao: imovel?.valorAquisicao,
    valorAtual: imovel?.valorAtual,
    endereco: {
      cep: imovel?.endereco?.cep ?? "",
      logradouro: imovel?.endereco?.logradouro ?? "",
      numero: imovel?.endereco?.numero ?? "",
      complemento: imovel?.endereco?.complemento ?? "",
      bairro: imovel?.endereco?.bairro ?? "",
      cidade: imovel?.endereco?.cidade ?? "",
      estado: imovel?.endereco?.estado ?? "",
      pais: imovel?.endereco?.pais ?? "Brasil",
    },
  };
}

export function ImovelForm({ imovel }: { imovel?: ImovelResponse }) {
  const router = useRouter();
  const { data: usuarios } = useUsuarios();
  const salvar = useSalvarImovel(imovel?.id);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: toDefaults(imovel) as FormValues,
  });

  const onSubmit = (values: FormValues) => {
    const payload: ImovelRequest = {
      ...values,
      endereco: Object.fromEntries(
        Object.entries(values.endereco).map(([k, v]) => [k, v || undefined]),
      ),
    } as ImovelRequest;

    salvar.mutate(payload, {
      onSuccess: (saved) => router.push(`/imoveis/${saved.id}`),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
            <SelectField
              control={form.control}
              name="usuarioId"
              label="Proprietário"
              placeholder="Selecione o usuário"
              options={(usuarios ?? []).map((u) => ({
                value: u.id,
                label: u.nome,
              }))}
            />
            <TextField
              control={form.control}
              name="nome"
              label="Nome do imóvel"
              placeholder="Ex.: Apto 302 - Ed. Aurora"
            />
            <SelectField
              control={form.control}
              name="tipo"
              label="Tipo"
              options={enumOptions(TIPO_IMOVEL, tipoImovelLabels)}
            />
            <SelectField
              control={form.control}
              name="status"
              label="Status"
              options={enumOptions(STATUS_IMOVEL, statusImovelLabels)}
            />
            <TextField
              control={form.control}
              name="valorAquisicao"
              label="Valor de aquisição (R$)"
              type="number"
            />
            <TextField
              control={form.control}
              name="valorAtual"
              label="Valor atual (R$)"
              type="number"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
            <TextField control={form.control} name="endereco.cep" label="CEP" />
            <TextField
              control={form.control}
              name="endereco.logradouro"
              label="Logradouro"
              className="sm:col-span-2"
            />
            <TextField
              control={form.control}
              name="endereco.numero"
              label="Número"
            />
            <TextField
              control={form.control}
              name="endereco.complemento"
              label="Complemento"
            />
            <TextField
              control={form.control}
              name="endereco.bairro"
              label="Bairro"
            />
            <TextField
              control={form.control}
              name="endereco.cidade"
              label="Cidade"
            />
            <TextField
              control={form.control}
              name="endereco.estado"
              label="Estado (UF)"
              placeholder="SP"
            />
            <TextField
              control={form.control}
              name="endereco.pais"
              label="País"
            />
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit" disabled={salvar.isPending}>
            {salvar.isPending ? "Salvando…" : "Salvar imóvel"}
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
