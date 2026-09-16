"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { ErrorState, LoadingState } from "@/components/query-state";
import { UsuarioForm } from "@/components/forms/usuario-form";
import { Button } from "@/components/ui/button";
import { useUsuario } from "@/hooks/use-usuarios";

export default function UsuarioDetalhePage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, error, refetch } = useUsuario(params.id);

  return (
    <>
      <PageHeader
        title={data?.nome ?? "Usuário"}
        description="Detalhes e edição do usuário"
        actions={
          <Button asChild variant="outline">
            <Link href="/usuarios">
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
        <UsuarioForm usuario={data} />
      )}
    </>
  );
}
