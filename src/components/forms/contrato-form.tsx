"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  INDICE_REAJUSTE,
  STATUS_CONTRATO,
  TIPO_CONTRATO,
  TIPO_GARANTIA,
  type ContratoRequest,
  type ContratoResponse,
} from "@/lib/types";
import {
  indiceReajusteLabels,
  statusContratoLabels,
  tipoContratoLabels,
  tipoGarantiaLabels,
} from "@/lib/labels";
import { useSalvarContrato } from "@/hooks/use-contratos";
import { useImoveis } from "@/hooks/use-imoveis";
import { useInquilinos } from "@/hooks/use-inquilinos";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  SelectField,
  TextAreaField,
  TextField,
  enumOptions,
} from "@/components/forms/form-fields";

const schema = z
  .object({
    imovelId: z.string().min(1, "Selecione o imóvel"),
    inquilinoId: z.string().min(1, "Selecione o inquilino"),
    tipo: z.enum(TIPO_CONTRATO),
    status: z.enum(STATUS_CONTRATO),
    dataInicio: z.string().min(1, "Informe a data de início"),
    dataFim: z.string().optional(),
    valorAluguel: z
      .number({ invalid_type_error: "Informe o valor do aluguel" })
      .positive("O valor deve ser maior que zero"),
    diaVencimento: z
      .number({ invalid_type_error: "Informe o dia de vencimento" })
      .int()
      .min(1, "Entre 1 e 31")
      .max(31, "Entre 1 e 31"),
    indiceReajuste: z.enum(INDICE_REAJUSTE),
    percentualReajuste: z.number().min(0).optional(),
    periodoReajuste: z.number().int().positive().optional(),
    tipoGarantia: z.enum(TIPO_GARANTIA),
    valorGarantia: z.number().min(0).optional(),
    observacoes: z.string().max(1000).optional(),
  })
  .refine(
    (data) => !data.dataFim || data.dataFim >= data.dataInicio,
    { path: ["dataFim"], message: "A data fim deve ser posterior ao início" },
  );

type FormValues = z.infer<typeof schema>;

function toDefaults(contrato?: ContratoResponse): Partial<FormValues> {
  return {
    imovelId: contrato?.imovel?.id ?? "",
    inquilinoId: contrato?.inquilino?.id ?? "",
    tipo: contrato?.tipo ?? "RESIDENCIAL",
    status: contrato?.status ?? "RASCUNHO",
    dataInicio: contrato?.dataInicio ?? "",
    dataFim: contrato?.dataFim ?? "",
    valorAluguel: contrato?.valorAluguel,
    diaVencimento: contrato?.diaVencimento ?? 5,
    indiceReajuste: contrato?.indiceReajuste ?? "IPCA",
    percentualReajuste: contrato?.percentualReajuste ?? undefined,
    periodoReajuste: contrato?.periodoReajuste ?? 12,
    tipoGarantia: contrato?.tipoGarantia ?? "SEM_GARANTIA",
    valorGarantia: contrato?.valorGarantia ?? undefined,
    observacoes: contrato?.observacoes ?? "",
  };
}

export function ContratoForm({
  contrato,
}: {
  contrato?: ContratoResponse;
}) {
  const router = useRouter();
  const salvar = useSalvarContrato(contrato?.id);
  const { data: imoveis } = useImoveis();
  const { data: inquilinos } = useInquilinos();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: toDefaults(contrato) as FormValues,
  });

  const onSubmit = (values: FormValues) => {
    const payload: ContratoRequest = {
      imovelId: values.imovelId,
      inquilinoId: values.inquilinoId,
      tipo: values.tipo,
      status: values.status,
      dataInicio: values.dataInicio,
      dataFim: values.dataFim || undefined,
      valorAluguel: values.valorAluguel,
      diaVencimento: values.diaVencimento,
      indiceReajuste: values.indiceReajuste,
      percentualReajuste: values.percentualReajuste,
      periodoReajuste: values.periodoReajuste,
      tipoGarantia: values.tipoGarantia,
      valorGarantia: values.valorGarantia,
      observacoes: values.observacoes || undefined,
    };
    salvar.mutate(payload, { onSuccess: () => router.push("/contratos") });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
            <SelectField
              control={form.control}
              name="imovelId"
              label="Imóvel"
              placeholder="Selecione o imóvel"
              options={(imoveis ?? []).map((i) => ({
                value: i.id,
                label: i.nome,
              }))}
            />
            <SelectField
              control={form.control}
              name="inquilinoId"
              label="Inquilino"
              placeholder="Selecione o inquilino"
              options={(inquilinos ?? []).map((i) => ({
                value: i.id,
                label: i.nome,
              }))}
            />
            <SelectField
              control={form.control}
              name="tipo"
              label="Tipo de contrato"
              options={enumOptions(TIPO_CONTRATO, tipoContratoLabels)}
            />
            <SelectField
              control={form.control}
              name="status"
              label="Status"
              options={enumOptions(STATUS_CONTRATO, statusContratoLabels)}
            />
            <TextField
              control={form.control}
              name="dataInicio"
              label="Início da vigência"
              type="date"
            />
            <TextField
              control={form.control}
              name="dataFim"
              label="Fim da vigência (opcional)"
              type="date"
            />
            <TextField
              control={form.control}
              name="valorAluguel"
              label="Valor do aluguel (R$)"
              type="number"
            />
            <TextField
              control={form.control}
              name="diaVencimento"
              label="Dia de vencimento"
              type="number"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
            <SelectField
              control={form.control}
              name="indiceReajuste"
              label="Índice de reajuste"
              options={enumOptions(INDICE_REAJUSTE, indiceReajusteLabels)}
            />
            <TextField
              control={form.control}
              name="percentualReajuste"
              label="Percentual de reajuste (%)"
              type="number"
            />
            <TextField
              control={form.control}
              name="periodoReajuste"
              label="Período de reajuste (meses)"
              type="number"
            />
            <SelectField
              control={form.control}
              name="tipoGarantia"
              label="Tipo de garantia"
              options={enumOptions(TIPO_GARANTIA, tipoGarantiaLabels)}
            />
            <TextField
              control={form.control}
              name="valorGarantia"
              label="Valor da garantia (R$)"
              type="number"
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
            {salvar.isPending ? "Salvando…" : "Salvar contrato"}
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
