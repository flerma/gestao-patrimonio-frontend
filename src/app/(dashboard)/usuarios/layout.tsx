"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers";
import { LoadingState } from "@/components/query-state";

/**
 * Gestão de usuários é exclusiva de ADMIN — o backend já bloqueia
 * `/api/usuarios/**` para quem não tem essa role (ver SecurityConfig), isso
 * aqui é só para não deixar a tela piscar antes do redirecionamento.
 */
export default function UsuariosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { usuario, carregando } = useAuth();
  const router = useRouter();
  const autorizado = usuario?.role === "ADMIN";

  React.useEffect(() => {
    if (!carregando && usuario && !autorizado) {
      router.replace("/");
    }
  }, [carregando, usuario, autorizado, router]);

  if (carregando || !autorizado) {
    return <LoadingState />;
  }

  return <>{children}</>;
}
