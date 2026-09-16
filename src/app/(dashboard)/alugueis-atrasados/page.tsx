"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useSelectedUser } from "@/components/providers";
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
import { useImoveis } from "@/hooks/use-imoveis";
import { useContratos } from "@/hooks/use-contratos";
import { usePagamentosAluguel } from "@/hooks/use-pagamentos-aluguel";
import { filtrarPorUsuario, listarAlugueisEmAtraso } from "@/lib/dashboard";
import { formatCurrency, formatDate, formatMonthLabel } from "@/lib/format";

export default function AlugueisAtrasadosPage() {
  const { usuarioId } = useSelectedUser();
  const imoveisQuery = useImoveis();
  const contratosQuery = useContratos();
  const pagamentosQuery = usePagamentosAluguel();

  const isLoading = contratosQuery.isLoading || pagamentosQuery.isLoading;
  const error = contratosQuery.error ?? pagamentosQuery.error;

  const linhas = React.useMemo(() => {
    const contratos = contratosQuery.data ?? [];
    const pagamentos = pagamentosQuery.data ?? [];
    const { contratosUsuario } = filtrarPorUsuario(
      imoveisQuery.data ?? [],
      contratos,
      usuarioId ?? undefined,
    );
    const contratosPermitidos = usuarioId
      ? new Set(contratosUsuario.map((c) => c.id))
      : undefined;
    return listarAlugueisEmAtraso(pagamentos, contratos, contratosPermitidos);
  }, [imoveisQuery.data, contratosQuery.data, pagamentosQuery.data, usuarioId]);

  const totalEmAberto = linhas.reduce(
    (acc, l) => acc + Math.max(Number(l.pagamento.saldo ?? 0), 0),
    0,
  );

  const retry = () => {
    contratosQuery.refetch();
    pagamentosQuery.refetch();
    imoveisQuery.refetch();
  };

  return (
    <>
      <PageHeader
        title="Aluguéis em atraso"
        description="Cobranças vencidas e ainda não quitadas, com o imóvel e os dados do aluguel."
        actions={
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="size-4" /> Voltar ao dashboard
            </Link>
          </Button>
        }
      />

      {isLoading && !contratosQuery.data ? (
        <LoadingState label="Carregando cobranças…" />
      ) : error && !contratosQuery.data ? (
        <ErrorState error={error} onRetry={retry} />
      ) : linhas.length === 0 ? (
        <EmptyState
          title="Nenhum aluguel em atraso"
          description="Todas as cobranças de aluguel estão em dia para este proprietário."
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Cobranças em atraso
                </p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">
                  {linhas.length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Total em aberto</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-destructive">
                  {formatCurrency(totalEmAberto)}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imóvel</TableHead>
                      <TableHead>Inquilino</TableHead>
                      <TableHead>Competência</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Atraso</TableHead>
                      <TableHead className="text-right">Previsto</TableHead>
                      <TableHead className="text-right">Recebido</TableHead>
                      <TableHead className="text-right">Em aberto</TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {linhas.map(({ pagamento, contrato, imovel, diasEmAtraso }) => {
                      const emAberto = Math.max(
                        Number(pagamento.saldo ?? 0),
                        0,
                      );
                      return (
                        <TableRow key={pagamento.id}>
                          <TableCell className="font-medium">
                            {imovel ? (
                              <Link
                                href={`/imoveis/${imovel.id}`}
                                className="hover:underline"
                              >
                                {imovel.nome}
                              </Link>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {contrato?.inquilino?.nome ?? "—"}
                          </TableCell>
                          <TableCell>
                            {formatMonthLabel(pagamento.competencia)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(pagamento.dataVencimento)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="danger">
                              {diasEmAtraso} dia{diasEmAtraso === 1 ? "" : "s"}
                            </Badge>
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
                          <TableCell>
                            {contrato && (
                              <Link
                                href={`/contratos/${contrato.id}`}
                                className="text-sm text-primary hover:underline"
                              >
                                Contrato
                              </Link>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
