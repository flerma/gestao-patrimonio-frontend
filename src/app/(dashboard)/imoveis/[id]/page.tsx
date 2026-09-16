"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { ErrorState, LoadingState } from "@/components/query-state";
import { ImovelForm } from "@/components/forms/imovel-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useImovel } from "@/hooks/use-imoveis";
import { useContratos } from "@/hooks/use-contratos";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  statusContratoLabels,
  statusContratoVariant,
  statusImovelLabels,
  statusImovelVariant,
} from "@/lib/labels";

export default function ImovelDetalhePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: imovel, isLoading, error, refetch } = useImovel(id);
  const { data: contratos } = useContratos();

  const contratosDoImovel = (contratos ?? []).filter(
    (c) => c.imovel?.id === id,
  );

  return (
    <>
      <PageHeader
        title={imovel?.nome ?? "Imóvel"}
        description="Detalhes e edição do imóvel"
        actions={
          <Button asChild variant="outline">
            <Link href="/imoveis">
              <ArrowLeft className="size-4" /> Voltar
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : error || !imovel ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Valor atual</p>
                <p className="mt-1 text-xl font-semibold">
                  {formatCurrency(imovel.valorAtual)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Aquisição: {formatCurrency(imovel.valorAquisicao)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="mt-2">
                  <Badge variant={statusImovelVariant[imovel.status]}>
                    {statusImovelLabels[imovel.status]}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Proprietário</p>
                <p className="mt-1 font-medium">
                  {imovel.usuario?.nome ?? "—"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {imovel.usuario?.email}
                </p>
              </CardContent>
            </Card>
          </div>

          {contratosDoImovel.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Contratos vinculados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {contratosDoImovel.map((contrato) => (
                  <Link
                    key={contrato.id}
                    href={`/contratos/${contrato.id}`}
                    className="flex items-center justify-between rounded-lg border border-border p-3 text-sm hover:bg-muted/50"
                  >
                    <span>
                      {contrato.inquilino?.nome ?? "Inquilino"} ·{" "}
                      {formatCurrency(contrato.valorAluguel)}/mês
                    </span>
                    <span className="flex items-center gap-3 text-muted-foreground">
                      {formatDate(contrato.dataInicio)}
                      <Badge
                        variant={statusContratoVariant[contrato.status]}
                      >
                        {statusContratoLabels[contrato.status]}
                      </Badge>
                    </span>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          <div>
            <h2 className="mb-3 text-lg font-semibold">Editar imóvel</h2>
            <ImovelForm imovel={imovel} />
          </div>
        </div>
      )}
    </>
  );
}
