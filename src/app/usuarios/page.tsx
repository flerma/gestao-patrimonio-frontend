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
import { useExcluirUsuario, useUsuarios } from "@/hooks/use-usuarios";
import { formatDate } from "@/lib/format";
import {
  provedorAutenticacaoLabels,
  statusUsuarioLabels,
  statusUsuarioVariant,
} from "@/lib/labels";

export default function UsuariosPage() {
  const { data, isLoading, error, refetch } = useUsuarios();
  const excluir = useExcluirUsuario();
  const [busca, setBusca] = React.useState("");

  const filtrados = React.useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const lista = data ?? [];
    if (!termo) return lista;
    return lista.filter((usuario) =>
      [usuario.nome, usuario.email]
        .filter(Boolean)
        .some((campo) => campo!.toLowerCase().includes(termo)),
    );
  }, [data, busca]);

  return (
    <>
      <PageHeader
        title="Usuários"
        description="Proprietários do patrimônio"
        actions={
          <Button asChild>
            <Link href="/usuarios/novo">
              <Plus className="size-4" /> Novo usuário
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
              placeholder="Buscar por nome ou e-mail…"
            />
            {data && (
              <span className="text-sm text-muted-foreground">
                {filtrados.length} de {data.length} usuário(s)
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
                  ? "Nenhum usuário encontrado"
                  : "Nenhum usuário cadastrado"
              }
              action={
                <Button asChild variant="outline">
                  <Link href="/usuarios/novo">Cadastrar usuário</Link>
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Provedor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrados.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/usuarios/${usuario.id}`}
                        className="hover:underline"
                      >
                        {usuario.nome}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {usuario.email}
                    </TableCell>
                    <TableCell>
                      {provedorAutenticacaoLabels[usuario.provedorAutenticacao]}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusUsuarioVariant[usuario.status]}>
                        {statusUsuarioLabels[usuario.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(usuario.dataCriacao)}
                    </TableCell>
                    <TableCell>
                      <RowActions
                        editHref={`/usuarios/${usuario.id}`}
                        itemLabel={usuario.nome}
                        deleting={excluir.isPending}
                        onDelete={() => excluir.mutate(usuario.id)}
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
