import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { UsuarioForm } from "@/components/forms/usuario-form";

export const metadata: Metadata = { title: "Novo usuário" };

export default function NovoUsuarioPage() {
  return (
    <>
      <PageHeader title="Novo usuário" description="Cadastre um proprietário" />
      <UsuarioForm />
    </>
  );
}
