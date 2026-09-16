import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { ContratoForm } from "@/components/forms/contrato-form";

export const metadata: Metadata = { title: "Novo contrato" };

export default function NovoContratoPage() {
  return (
    <>
      <PageHeader
        title="Novo contrato"
        description="Cadastre um contrato de locação"
      />
      <ContratoForm />
    </>
  );
}
