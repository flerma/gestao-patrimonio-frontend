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
import { useExcluirImovel, useImoveis } from "@/hooks/use-imoveis";
import { useContratos } from "@/hooks/use-contratos";
import { formatCurrency } from "@/lib/format";
import {
  statusImovelLabels,
  statusImovelVariant,
  tipoImovelLabels,
} from "@/lib/labels";
import {
  MSG_IMOVEL_COM_CONTRATO,
  contarContratosDoImovel,
} from "@/lib/vinculos";

export default function ImoveisPage() {
  const { data, isLoading, error, refetch } = useImoveis();
  const { data: contratos, isLoading: contratosLoading } = useContratos();
  const excluir = useExcluirImovel();
  const [busca, setBusca] = React.useState("");

  const filtrados = React.useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const lista = data ?? [];
    if (!termo) return lista;
    return lista.filter((imovel) =>
      [
        imovel.nome,
        tipoImovelLabels[imovel.tipo],
        imovel.endereco?.cidade,
        imovel.endereco?.estado,
        imovel.endereco?.bairro,
        imovel.usuario?.nome,
      ]
        .filter(Boolean)
        .some((campo) => campo!.toLowerCase().includes(termo)),
    );
  }, [data, busca]);

  return (
    <>
      <PageHeader
        title="Imóveis"
        description="Cadastro e busca de imóveis do patrimônio"
        actions={
          <Button asChild>
            <Link href="/imoveis/novo">
              <Plus className="size-4" /> Novo imóvel
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
              placeholder="Buscar por nome, cidade, tipo…"
            />
            {data && (
              <span className="text-sm text-muted-foreground">
                {filtrados.length} de {data.length} imóvel(is)
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
                  ? "Nenhum imóvel encontrado"
                  : "Nenhum imóvel cadastrado"
              }
              description={
                data && data.length > 0
                  ? "Ajuste os termos da busca."
                  : "Cadastre o primeiro imóvel do patrimônio."
              }
              action={
                <Button asChild variant="outline">
                  <Link href="/imoveis/novo">Cadastrar imóvel</Link>
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Proprietário</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor atual</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrados.map((imovel) => (
                  <TableRow key={imovel.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/imoveis/${imovel.id}`}
                        className="hover:underline"
                      >
                        {imovel.nome}
                      </Link>
                    </TableCell>
                    <TableCell>{tipoImovelLabels[imovel.tipo]}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {[imovel.endereco?.cidade, imovel.endereco?.estado]
                        .filter(Boolean)
                        .join(" / ") || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {imovel.usuario?.nome ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusImovelVariant[imovel.status]}>
                        {statusImovelLabels[imovel.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(imovel.valorAtual)}
                    </TableCell>
                    <TableCell>
                      <RowActions
                        editHref={`/imoveis/${imovel.id}`}
                        itemLabel={imovel.nome}
                        deleting={excluir.isPending}
                        blockedReason={
                          contratosLoading
                            ? "Aguarde o carregamento dos contratos…"
                            : contarContratosDoImovel(contratos, imovel.id) > 0
                              ? MSG_IMOVEL_COM_CONTRATO
                              : null
                        }
                        onDelete={() => excluir.mutate(imovel.id)}
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
