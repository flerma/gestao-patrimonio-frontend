import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { ImovelForm } from "@/components/forms/imovel-form";

export const metadata: Metadata = { title: "Novo imóvel" };

export default function NovoImovelPage() {
  return (
    <>
      <PageHeader
        title="Novo imóvel"
        description="Cadastre um imóvel do patrimônio"
      />
      <ImovelForm />
    </>
  );
}
