"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/query-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useContrato } from "@/hooks/use-contratos";
import { usePagamentosAluguel } from "@/hooks/use-pagamentos-aluguel";
import { RegistrarPagamentoRow } from "@/components/dashboard/registrar-pagamento-row";
import { listarPagamentosDoContrato } from "@/lib/dashboard";
import { formatCurrency, formatDate, formatMonthLabel } from "@/lib/format";
import { formaPagamentoLabels } from "@/lib/labels";

function PagamentosContratoContent() {
  const searchParams = useSearchParams();
  const contratoId = searchParams.get("contratoId") ?? undefined;
  const somenteAtraso = searchParams.get("atraso") === "1";

  const contratoQuery = useContrato(contratoId);
  const pagamentosQuery = usePagamentosAluguel(contratoId);

  const isLoading = contratoQuery.isLoading || pagamentosQuery.isLoading;
  const error = contratoQuery.error ?? pagamentosQuery.error;

  const linhas = React.useMemo(() => {
    if (!contratoQuery.data) return [];
    const todas = listarPagamentosDoContrato(
      pagamentosQuery.data ?? [],
      contratoQuery.data,
    );
    return somenteAtraso
      ? todas.filter((l) => l.pagamento.statusEfetivo === "EM_ATRASO")
      : todas;
  }, [contratoQuery.data, pagamentosQuery.data, somenteAtraso]);

  const titulo = somenteAtraso ? "Aluguéis em atraso" : "Todos os aluguéis";
  const contrato = contratoQuery.data;

  if (!contratoId) {
    return (
      <>
        <PageHeader title="Aluguéis do contrato" />
        <EmptyState
          title="Nenhum contrato informado"
          description="Acesse esta tela a partir da página de um contrato."
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={titulo}
        description={
          contrato
            ? `${contrato.imovel?.nome ?? "Imóvel"} · ${contrato.inquilino?.nome ?? "Inquilino"}`
            : "Aluguéis do contrato"
        }
        actions={
          <Button asChild variant="outline">
            <Link href={`/contratos/${contratoId}`}>
              <ArrowLeft className="size-4" /> Voltar ao contrato
            </Link>
          </Button>
        }
      />

      {isLoading && !contratoQuery.data ? (
        <LoadingState label="Carregando aluguéis…" />
      ) : error && !contratoQuery.data ? (
        <ErrorState
          error={error}
          onRetry={() => {
            contratoQuery.refetch();
            pagamentosQuery.refetch();
          }}
        />
      ) : linhas.length === 0 ? (
        <EmptyState
          title={
            somenteAtraso
              ? "Nenhum aluguel em atraso"
              : "Nenhum aluguel encontrado"
          }
          description={
            somenteAtraso
              ? "Todas as cobranças deste contrato estão em dia."
              : "Este contrato ainda não tem cobranças geradas."
          }
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Competência</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Atraso</TableHead>
                    <TableHead className="text-right">Previsto</TableHead>
                    <TableHead className="text-right">Recebido</TableHead>
                    <TableHead className="text-right">Em aberto</TableHead>
                    <TableHead>Data pagamento</TableHead>
                    <TableHead>Forma</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {linhas.map(({ pagamento, diasEmAtraso }) => {
                    const emAberto = Math.max(Number(pagamento.saldo ?? 0), 0);
                    return (
                      <TableRow key={pagamento.id}>
                        <TableCell>
                          {formatMonthLabel(pagamento.competencia)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(pagamento.dataVencimento)}
                        </TableCell>
                        <TableCell>
                          {pagamento.statusEfetivo === "EM_ATRASO" ? (
                            <Badge variant="danger">
                              {diasEmAtraso} dia
                              {diasEmAtraso === 1 ? "" : "s"}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(pagamento.valorPrevisto)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {formatCurrency(pagamento.valorPago)}
                        </TableCell>
                        <TableCell className="text-right font-medium tabular-nums text-destructive">
                          {formatCurrency(emAberto)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {pagamento.dataPagamento
                            ? formatDate(pagamento.dataPagamento)
                            : "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {pagamento.formaPagamento
                            ? formaPagamentoLabels[pagamento.formaPagamento]
                            : "—"}
                        </TableCell>
                        {pagamento.statusEfetivo === "EM_ATRASO" ? (
                          <RegistrarPagamentoRow
                            pagamento={pagamento}
                            onRegistrado={() => {}}
                          />
                        ) : (
                          <TableCell>
                            {pagamento.status === "PAGO" ? (
                              <CheckCircle2
                                className="size-5 text-emerald-600"
                                aria-label="Pago"
                              />
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default function PagamentosContratoPage() {
  return (
    <React.Suspense fallback={<LoadingState label="Carregando aluguéis…" />}>
      <PagamentosContratoContent />
    </React.Suspense>
  );
}
