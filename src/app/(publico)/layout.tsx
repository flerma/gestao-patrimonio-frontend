import Link from "next/link";
import { Building2 } from "lucide-react";

import { LinksDocumentosLegais } from "@/components/legal/links-documentos-legais";
import { NOME_SISTEMA } from "@/lib/legal";

/**
 * Layout das páginas públicas (Política de Privacidade, Termos de Uso):
 * acessíveis com ou sem sessão — ver `PUBLIC_PATHS` em `src/proxy.ts`.
 */
export default function PublicoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Building2 className="size-4" />
            </span>
            {NOME_SISTEMA}
          </Link>
          <Link href="/login" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
            Entrar
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">{children}</main>
      <footer className="border-t">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <LinksDocumentosLegais />
        </div>
      </footer>
    </div>
  );
}
