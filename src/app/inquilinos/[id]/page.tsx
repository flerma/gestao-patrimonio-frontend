"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { ErrorState, LoadingState } from "@/components/query-state";
import { InquilinoForm } from "@/components/forms/inquilino-form";
import { Button } from "@/components/ui/button";
import { useInquilino } from "@/hooks/use-inquilinos";

export default function InquilinoDetalhePage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, error, refetch } = useInquilino(params.id);

  return (
    <>
      <PageHeader
        title={data?.nome ?? "Inquilino"}
        description="Detalhes e edição do inquilino"
        actions={
          <Button asChild variant="outline">
            <Link href="/inquilinos">
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
        <InquilinoForm inquilino={data} />
      )}
    </>
  );
}
