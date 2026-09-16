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
  useExcluirInquilino,
  useInquilinos,
} from "@/hooks/use-inquilinos";
import { useContratos } from "@/hooks/use-contratos";
import { formatDate } from "@/lib/format";
import {
  statusInquilinoLabels,
  statusInquilinoVariant,
  tipoPessoaLabels,
} from "@/lib/labels";
import {
  MSG_INQUILINO_COM_CONTRATO,
  contarContratosDoInquilino,
} from "@/lib/vinculos";

export default function InquilinosPage() {
  const { data, isLoading, error, refetch } = useInquilinos();
  const { data: contratos, isLoading: contratosLoading } = useContratos();
  const excluir = useExcluirInquilino();
  const [busca, setBusca] = React.useState("");

  const filtrados = React.useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const lista = data ?? [];
    if (!termo) return lista;
    return lista.filter((inq) =>
      [
        inq.nome,
        inq.documento,
        inq.email,
        inq.telefone,
        inq.endereco?.cidade,
        inq.endereco?.estado,
        inq.endereco?.bairro,
      ]
        .filter(Boolean)
        .some((campo) => campo!.toLowerCase().includes(termo)),
    );
  }, [data, busca]);

  return (
    <>
      <PageHeader
        title="Inquilinos"
        description="Cadastro e busca de inquilinos"
        actions={
          <Button asChild>
            <Link href="/inquilinos/novo">
              <Plus className="size-4" /> Novo inquilino
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
              placeholder="Buscar por nome, documento, e-mail…"
            />
            {data && (
              <span className="text-sm text-muted-foreground">
                {filtrados.length} de {data.length} inquilino(s)
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
                  ? "Nenhum inquilino encontrado"
                  : "Nenhum inquilino cadastrado"
              }
              action={
                <Button asChild variant="outline">
                  <Link href="/inquilinos/novo">Cadastrar inquilino</Link>
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrados.map((inq) => (
                  <TableRow key={inq.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/inquilinos/${inq.id}`}
                        className="hover:underline"
                      >
                        {inq.nome}
                      </Link>
                    </TableCell>
                    <TableCell>{tipoPessoaLabels[inq.tipoPessoa]}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {inq.documento}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {inq.email || inq.telefone || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {[inq.endereco?.cidade, inq.endereco?.estado]
                        .filter(Boolean)
                        .join(" / ") || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusInquilinoVariant[inq.status]}>
                        {statusInquilinoLabels[inq.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(inq.dataCriacao)}
                    </TableCell>
                    <TableCell>
                      <RowActions
                        editHref={`/inquilinos/${inq.id}`}
                        itemLabel={inq.nome}
                        deleting={excluir.isPending}
                        blockedReason={
                          contratosLoading
                            ? "Aguarde o carregamento dos contratos…"
                            : contarContratosDoInquilino(contratos, inq.id) > 0
                              ? MSG_INQUILINO_COM_CONTRATO
                              : null
                        }
                        onDelete={() => excluir.mutate(inq.id)}
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
