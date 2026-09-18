"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { ErrorState, LoadingState } from "@/components/query-state";
import { ContratoForm } from "@/components/forms/contrato-form";
import { Button } from "@/components/ui/button";
import { useContrato } from "@/hooks/use-contratos";

export default function ContratoDetalhePage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, error, refetch } = useContrato(params.id);

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
