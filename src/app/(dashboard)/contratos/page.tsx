"use client";

import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { RowActions } from "@/components/row-actions";
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
import {
  useContratos,
  useExcluirContrato,
} from "@/hooks/use-contratos";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  statusContratoLabels,
  statusContratoVariant,
  tipoContratoLabels,
} from "@/lib/labels";

export default function ContratosPage() {
  const { data, isLoading, error, refetch } = useContratos();
  const excluir = useExcluirContrato();
  const [busca, setBusca] = React.useState("");

  const filtrados = React.useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const lista = data ?? [];
    if (!termo) return lista;
    return lista.filter((contrato) =>
      [
        contrato.imovel?.nome,
        contrato.inquilino?.nome,
        tipoContratoLabels[contrato.tipo],
        statusContratoLabels[contrato.status],
      ]
        .filter(Boolean)
        .some((campo) => campo!.toLowerCase().includes(termo)),
    );
  }, [data, busca]);

  return (
    <>
      <PageHeader
        title="Contratos"
        description="Cadastro e busca de contratos de locação"
        actions={
          <Button asChild>
            <Link href="/contratos/novo">
              <Plus className="size-4" /> Novo contrato
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SearchInput
              value={busca}
              onChange={setBusca}
              placeholder="Buscar por imóvel, inquilino, status…"
            />
            {data && (
              <span className="text-sm text-muted-foreground">
                {filtrados.length} de {data.length} contrato(s)
              </span>
            )}
          </div>

          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} onRetry={() => refetch()} />
          ) : filtrados.length === 0 ? (
            <EmptyState
              title={
                data && data.length > 0
                  ? "Nenhum contrato encontrado"
                  : "Nenhum contrato cadastrado"
              }
              action={
                <Button asChild variant="outline">
                  <Link href="/contratos/novo">Cadastrar contrato</Link>
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imóvel</TableHead>
                  <TableHead>Inquilino</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Vigência</TableHead>
                  <TableHead className="text-right">Aluguel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrados.map((contrato) => (
                  <TableRow key={contrato.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/contratos/${contrato.id}`}
                        className="hover:underline"
                      >
                        {contrato.imovel?.nome ?? "—"}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {contrato.inquilino?.nome ?? "—"}
                    </TableCell>
                    <TableCell>{tipoContratoLabels[contrato.tipo]}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(contrato.dataInicio)} —{" "}
                      {contrato.dataFim
                        ? formatDate(contrato.dataFim)
                        : "indeterminado"}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(contrato.valorAluguel)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusContratoVariant[contrato.status]}>
                        {statusContratoLabels[contrato.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <RowActions
                        editHref={`/contratos/${contrato.id}`}
                        itemLabel={`contrato de ${contrato.imovel?.nome ?? "imóvel"}`}
                        deleting={excluir.isPending}
                        onDelete={() => excluir.mutate(contrato.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
