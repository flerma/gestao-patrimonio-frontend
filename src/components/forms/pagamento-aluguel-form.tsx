"use client";

import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  FORMA_PAGAMENTO,
  type PagamentoAluguelRequest,
  type UUID,
} from "@/lib/types";
import { formaPagamentoLabels } from "@/lib/labels";
import { useSalvarPagamentoAluguel } from "@/hooks/use-pagamentos-aluguel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  SelectField,
  TextField,
  enumOptions,
} from "@/components/forms/form-fields";

const PAGO_OPCOES = [
  { value: "NAO", label: "Não" },
  { value: "SIM", label: "Sim" },
];

const schema = z
  .object({
    competencia: z.string().min(1, "Informe a competência"),
    dataVencimento: z.string().min(1, "Informe a data de vencimento"),
    valorPrevisto: z
      .number({ invalid_type_error: "Informe o valor previsto" })
      .positive("O valor deve ser maior que zero"),
    pago: z.enum(["SIM", "NAO"]),
    dataPagamento: z.string().optional(),
    formaPagamento: z.enum(FORMA_PAGAMENTO).optional(),
  })
  .refine((data) => data.pago !== "SIM" || Boolean(data.dataPagamento), {
    path: ["dataPagamento"],
    message: "Informe a data de pagamento",
  })
  .refine((data) => data.pago !== "SIM" || Boolean(data.formaPagamento), {
    path: ["formaPagamento"],
    message: "Informe a forma de pagamento",
  });

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  competencia: "",
  dataVencimento: "",
  valorPrevisto: undefined as unknown as number,
  pago: "NAO",
  dataPagamento: "",
  formaPagamento: undefined,
};

export function PagamentoAluguelForm({ contratoId }: { contratoId: UUID }) {
  const router = useRouter();
  const salvar = useSalvarPagamentoAluguel();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const pagoValue = useWatch({ control: form.control, name: "pago" });
  const pago = pagoValue === "SIM";

  const onSubmit = (values: FormValues) => {
    const payload: PagamentoAluguelRequest = {
      contratoId,
      competencia: values.competencia,
      dataVencimento: values.dataVencimento,
      valorPrevisto: values.valorPrevisto,
      valorPago: pago ? values.valorPrevisto : undefined,
      dataPagamento: pago ? values.dataPagamento : undefined,
      status: pago ? "PAGO" : "PENDENTE",
      formaPagamento: pago ? values.formaPagamento : undefined,
    };
    salvar.mutate(payload, {
      onSuccess: () =>
        router.push(`/pagamentos-contrato?contratoId=${contratoId}`),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
            <TextField
              control={form.control}
              name="competencia"
              label="Competência"
              type="month"
            />
            <TextField
              control={form.control}
              name="dataVencimento"
              label="Data de vencimento"
              type="date"
            />
            <TextField
              control={form.control}
              name="valorPrevisto"
              label="Valor previsto (R$)"
              type="number"
            />
            <SelectField
              control={form.control}
              name="pago"
              label="Aluguel já foi pago?"
              options={PAGO_OPCOES}
            />
            {pago && (
              <>
                <TextField
                  control={form.control}
                  name="dataPagamento"
                  label="Data de pagamento"
                  type="date"
                />
                <SelectField
                  control={form.control}
                  name="formaPagamento"
                  label="Forma de pagamento"
                  options={enumOptions(FORMA_PAGAMENTO, formaPagamentoLabels)}
                />
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit" disabled={salvar.isPending}>
            {salvar.isPending ? "Salvando…" : "Salvar aluguel"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
