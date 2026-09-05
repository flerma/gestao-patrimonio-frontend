"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  STATUS_INQUILINO,
  TIPO_PESSOA,
  type Endereco,
  type InquilinoRequest,
  type InquilinoResponse,
} from "@/lib/types";
import { statusInquilinoLabels, tipoPessoaLabels } from "@/lib/labels";
import { useSalvarInquilino } from "@/hooks/use-inquilinos";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { CepField } from "@/components/forms/cep-field";
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
    endereco: {
      cep: inquilino?.endereco?.cep ?? "",
      logradouro: inquilino?.endereco?.logradouro ?? "",
      numero: inquilino?.endereco?.numero ?? "",
      complemento: inquilino?.endereco?.complemento ?? "",
      bairro: inquilino?.endereco?.bairro ?? "",
      cidade: inquilino?.endereco?.cidade ?? "",
      estado: inquilino?.endereco?.estado ?? "",
      pais: inquilino?.endereco?.pais ?? "Brasil",
    },
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

  const preencherEndereco = (endereco: Endereco) => {
    form.setValue("endereco.logradouro", endereco.logradouro ?? "", {
      shouldDirty: true,
    });
    form.setValue("endereco.bairro", endereco.bairro ?? "", {
      shouldDirty: true,
    });
    form.setValue("endereco.cidade", endereco.cidade ?? "", {
      shouldDirty: true,
    });
    form.setValue("endereco.estado", endereco.estado ?? "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    if (endereco.pais) {
      form.setValue("endereco.pais", endereco.pais, { shouldDirty: true });
    }
    form.setFocus("endereco.numero");
  };

  const onSubmit = (values: FormValues) => {
    const endereco = Object.fromEntries(
      Object.entries(values.endereco).map(([k, v]) => [k, v || undefined]),
    );
    const temEndereco = Object.values(endereco).some(Boolean);

    const payload: InquilinoRequest = {
      tipoPessoa: values.tipoPessoa,
      nome: values.nome,
      documento: values.documento,
      email: values.email || undefined,
      telefone: values.telefone || undefined,
      dataNascimento: values.dataNascimento || undefined,
      status: values.status,
      endereco: temEndereco
        ? (endereco as InquilinoRequest["endereco"])
        : undefined,
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Endereço</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 p-6 pt-0 sm:grid-cols-2 lg:grid-cols-3">
            <CepField
              control={form.control}
              name="endereco.cep"
              label="CEP"
              onResolved={preencherEndereco}
            />
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

        <Card>
          <CardContent className="p-6">
            <TextAreaField
              control={form.control}
              name="observacoes"
              label="Observações"
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
