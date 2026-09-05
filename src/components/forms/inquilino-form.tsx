"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  STATUS_INQUILINO,
  TIPO_PESSOA,
  type InquilinoRequest,
  type InquilinoResponse,
} from "@/lib/types";
import { statusInquilinoLabels, tipoPessoaLabels } from "@/lib/labels";
import { useSalvarInquilino } from "@/hooks/use-inquilinos";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  SelectField,
  TextAreaField,
  TextField,
  enumOptions,
} from "@/components/forms/form-fields";

const schema = z.object({
  tipoPessoa: z.enum(TIPO_PESSOA),
  nome: z.string().trim().min(1, "Informe o nome"),
  documento: z.string().trim().min(1, "Informe o CPF/CNPJ"),
  email: z
    .string()
    .trim()
    .email("E-mail inválido")
    .optional()
    .or(z.literal("")),
  telefone: z.string().optional(),
  dataNascimento: z.string().optional(),
  status: z.enum(STATUS_INQUILINO),
  observacoes: z.string().max(1000).optional(),
});

type FormValues = z.infer<typeof schema>;

function toDefaults(inquilino?: InquilinoResponse): Partial<FormValues> {
  return {
    tipoPessoa: inquilino?.tipoPessoa ?? "FISICA",
    nome: inquilino?.nome ?? "",
    documento: inquilino?.documento ?? "",
    email: inquilino?.email ?? "",
    telefone: inquilino?.telefone ?? "",
    dataNascimento: inquilino?.dataNascimento ?? "",
    status: inquilino?.status ?? "ATIVO",
    observacoes: inquilino?.observacoes ?? "",
  };
}

export function InquilinoForm({
  inquilino,
}: {
  inquilino?: InquilinoResponse;
}) {
  const router = useRouter();
  const salvar = useSalvarInquilino(inquilino?.id);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: toDefaults(inquilino) as FormValues,
  });

  const onSubmit = (values: FormValues) => {
    const payload: InquilinoRequest = {
      tipoPessoa: values.tipoPessoa,
      nome: values.nome,
      documento: values.documento,
      email: values.email || undefined,
      telefone: values.telefone || undefined,
      dataNascimento: values.dataNascimento || undefined,
      status: values.status,
      observacoes: values.observacoes || undefined,
    };
    salvar.mutate(payload, {
      onSuccess: () => router.push("/inquilinos"),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
            <SelectField
              control={form.control}
              name="tipoPessoa"
              label="Tipo de pessoa"
              options={enumOptions(TIPO_PESSOA, tipoPessoaLabels)}
            />
            <SelectField
              control={form.control}
              name="status"
              label="Status"
              options={enumOptions(STATUS_INQUILINO, statusInquilinoLabels)}
            />
            <TextField
              control={form.control}
              name="nome"
              label="Nome / Razão social"
            />
            <TextField
              control={form.control}
              name="documento"
              label="CPF / CNPJ"
            />
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
              name="dataNascimento"
              label="Data de nascimento"
              type="date"
            />
            <TextAreaField
              control={form.control}
              name="observacoes"
              label="Observações"
              className="sm:col-span-2"
            />
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit" disabled={salvar.isPending}>
            {salvar.isPending ? "Salvando…" : "Salvar inquilino"}
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
