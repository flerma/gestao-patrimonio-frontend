import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { InquilinoForm } from "@/components/forms/inquilino-form";

export const metadata: Metadata = { title: "Novo inquilino" };

export default function NovoInquilinoPage() {
  return (
    <>
      <PageHeader
        title="Novo inquilino"
        description="Cadastre um inquilino"
      />
      <InquilinoForm />
    </>
  );
}
