"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { ErrorState, LoadingState } from "@/components/query-state";
import { InquilinoForm } from "@/components/forms/inquilino-form";
import { DeleteIconButton } from "@/components/delete-icon-button";
import { Button } from "@/components/ui/button";
import { useExcluirInquilino, useInquilino } from "@/hooks/use-inquilinos";
import { useContratos } from "@/hooks/use-contratos";
import {
  MSG_INQUILINO_COM_CONTRATO,
  contarContratosDoInquilino,
} from "@/lib/vinculos";

export default function InquilinoDetalhePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, error, refetch } = useInquilino(params.id);
  const { data: contratos, isLoading: contratosLoading } = useContratos();
  const excluir = useExcluirInquilino();

  return (
    <>
      <PageHeader
        title={data?.nome ?? "Inquilino"}
        description="Detalhes e edição do inquilino"
        actions={
          <>
            {data && (
              <DeleteIconButton
                itemLabel={data.nome}
                deleting={excluir.isPending}
                blockedReason={
                  contratosLoading
                    ? "Aguarde o carregamento dos contratos…"
                    : contarContratosDoInquilino(contratos, data.id) > 0
                      ? MSG_INQUILINO_COM_CONTRATO
                      : null
                }
                onDelete={() =>
                  excluir.mutate(data.id, {
                    onSuccess: () => router.push("/inquilinos"),
                  })
                }
              />
            )}
            <Button asChild variant="outline">
              <Link href="/inquilinos">
                <ArrowLeft className="size-4" /> Voltar
              </Link>
            </Button>
          </>
        }
      />
      {isLoading ? (
        <LoadingState />
      ) : error || !data ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : (
        <InquilinoForm inquilino={data} />
      )}
    </>
  );
}
