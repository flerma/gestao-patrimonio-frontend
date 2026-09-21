"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { EmptyState, LoadingState } from "@/components/query-state";
import { PagamentoAluguelForm } from "@/components/forms/pagamento-aluguel-form";
import { useContrato } from "@/hooks/use-contratos";

function NovoPagamentoAluguelContent() {
  const searchParams = useSearchParams();
  const contratoId = searchParams.get("contratoId") ?? undefined;

  const contratoQuery = useContrato(contratoId);
  const contrato = contratoQuery.data;

  if (!contratoId) {
    return (
      <>
        <PageHeader title="Incluir aluguel" />
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
        title="Incluir aluguel"
        description={
          contrato
            ? `${contrato.imovel?.nome ?? "Imóvel"} · ${contrato.inquilino?.nome ?? "Inquilino"}`
            : "Cadastre uma cobrança de aluguel para este contrato"
        }
      />

      {contratoQuery.isLoading && !contrato ? (
        <LoadingState label="Carregando contrato…" />
      ) : (
        <PagamentoAluguelForm contratoId={contratoId} />
      )}
    </>
  );
}

export default function NovoPagamentoAluguelPage() {
  return (
    <React.Suspense fallback={<LoadingState label="Carregando…" />}>
      <NovoPagamentoAluguelContent />
    </React.Suspense>
  );
}
