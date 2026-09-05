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
          <Button asChild variant="outline">
            <Link href="/contratos">
              <ArrowLeft className="size-4" /> Voltar
            </Link>
          </Button>
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
