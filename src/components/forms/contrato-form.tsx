"use client";

import * as React from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  NumberSelectField,
  SelectField,
  TextAreaField,
  TextField,
  enumOptions,
} from "@/components/forms/form-fields";
import { MoneyField } from "@/components/forms/money-field";
import { DateField } from "@/components/forms/date-field";

const DIAS_VENCIMENTO = Array.from({ length: 31 }, (_, i) => ({
  value: i + 1,
  label: String(i + 1),
}));

/** yyyy-MM-dd está em um mês anterior ao mês corrente. */
function competenciaAnteriorAoMesAtual(dataInicio: string): boolean {
  const match = dataInicio.match(/^(\d{4})-(\d{2})/);
  if (!match) return false;
  const [, anoStr, mesStr] = match;
  const ano = Number(anoStr);
  const mes = Number(mesStr);
  const agora = new Date();
  const anoAtual = agora.getFullYear();
  const mesAtual = agora.getMonth() + 1;
  return ano < anoAtual || (ano === anoAtual && mes < mesAtual);
}

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

  type EtapaConfirmacao = "parcelas-anteriores" | "vencimento-futuro";
  const [confirmacao, setConfirmacao] = React.useState<{
    payload: ContratoRequest;
    etapa: EtapaConfirmacao;
    precisaVencimentoFuturo: boolean;
  } | null>(null);

  const enviar = (payload: ContratoRequest) => {
    salvar.mutate(payload, { onSuccess: () => router.push("/contratos") });
  };

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

    const precisaParcelasAnteriores = competenciaAnteriorAoMesAtual(values.dataInicio);
    const precisaVencimentoFuturo =
      contrato !== undefined && contrato.diaVencimento !== values.diaVencimento;

    if (precisaParcelasAnteriores) {
      setConfirmacao({ payload, etapa: "parcelas-anteriores", precisaVencimentoFuturo });
      return;
    }
    if (precisaVencimentoFuturo) {
      setConfirmacao({ payload, etapa: "vencimento-futuro", precisaVencimentoFuturo: false });
      return;
    }
    enviar(payload);
  };

  const confirmarParcelasAnteriores = (marcarComoPagas: boolean) => {
    if (!confirmacao) return;
    const payloadAtualizado: ContratoRequest = {
      ...confirmacao.payload,
      marcarParcelasAnterioresComoPagas: marcarComoPagas,
    };
    if (confirmacao.precisaVencimentoFuturo) {
      setConfirmacao({
        payload: payloadAtualizado,
        etapa: "vencimento-futuro",
        precisaVencimentoFuturo: false,
      });
      return;
    }
    enviar(payloadAtualizado);
    setConfirmacao(null);
  };

  const confirmarVencimentoFuturo = (atualizar: boolean) => {
    if (!confirmacao) return;
    enviar({
      ...confirmacao.payload,
      atualizarVencimentoParcelasFuturas: atualizar,
    });
    setConfirmacao(null);
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
            <DateField
              control={form.control}
              name="dataInicio"
              label="Início da vigência"
            />
            <DateField
              control={form.control}
              name="dataFim"
              label="Fim da vigência (opcional)"
            />
            <MoneyField
              control={form.control}
              name="valorAluguel"
              label="Valor do aluguel (R$)"
            />
            <NumberSelectField
              control={form.control}
              name="diaVencimento"
              label="Dia de vencimento"
              options={DIAS_VENCIMENTO}
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
            <MoneyField
              control={form.control}
              name="valorGarantia"
              label="Valor da garantia (R$)"
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

      <Dialog
        open={confirmacao?.etapa === "parcelas-anteriores"}
        onOpenChange={(open) => !open && setConfirmacao(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Parcelas anteriores ao mês atual</DialogTitle>
            <DialogDescription>
              A data de início de vigência gera aluguéis com competência
              anterior ao mês atual. Deseja que essas parcelas sejam
              criadas já como pagas (via Pix, na data de vencimento de cada
              uma) ou como pendentes e em atraso?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => confirmarParcelasAnteriores(false)}
            >
              Criar como pendentes
            </Button>
            <Button onClick={() => confirmarParcelasAnteriores(true)}>
              Criar como pagas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmacao?.etapa === "vencimento-futuro"}
        onOpenChange={(open) => !open && setConfirmacao(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar vencimento das parcelas futuras?</DialogTitle>
            <DialogDescription>
              O dia de vencimento foi alterado. As parcelas de aluguel com
              competência posterior ao mês atual terão a data de vencimento
              alterada para o novo dia selecionado. Deseja confirmar essa
              alteração?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => confirmarVencimentoFuturo(false)}
            >
              Não alterar
            </Button>
            <Button onClick={() => confirmarVencimentoFuturo(true)}>
              Confirmar alteração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
