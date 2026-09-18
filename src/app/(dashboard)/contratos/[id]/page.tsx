"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { ErrorState, LoadingState } from "@/components/query-state";
import { ContratoForm } from "@/components/forms/contrato-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useContrato } from "@/hooks/use-contratos";
import { usePagamentosAluguel } from "@/hooks/use-pagamentos-aluguel";
import { calcularResumoPagamentos } from "@/lib/dashboard";
import { formatCurrency } from "@/lib/format";

export default function ContratoDetalhePage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, error, refetch } = useContrato(params.id);
  const pagamentosQuery = usePagamentosAluguel(params.id);

  const resumo = React.useMemo(
    () => calcularResumoPagamentos(pagamentosQuery.data ?? []),
    [pagamentosQuery.data],
  );

  return (
    <>
      <PageHeader
        title={
          data
            ? `Contrato · ${data.imovel?.nome ?? "Imóvel"}`
            : "Contrato"
        }
        description="Detalhes e edição do contrato de locação"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href={`/pagamentos-contrato?contratoId=${params.id}&atraso=1`}>
                Aluguéis em atraso
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/pagamentos-contrato?contratoId=${params.id}`}>
                Todos aluguéis
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contratos">
                <ArrowLeft className="size-4" /> Voltar
              </Link>
            </Button>
          </div>
        }
      />

      {data && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">
                Aluguéis atrasados
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">
                {resumo.emAtraso}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Total em aberto</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-destructive">
                {formatCurrency(resumo.totalEmAtraso)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">
                Aluguéis recebidos
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-success">
                {formatCurrency(resumo.totalRecebido)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {isLoading ? (
        <LoadingState />
      ) : error || !data ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : (
        <ContratoForm contrato={data} />
      )}
    </>
  );
}
