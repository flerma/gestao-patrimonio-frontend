import Link from "next/link";

import { NOME_SISTEMA, ROTA_POLITICA_PRIVACIDADE, ROTA_TERMOS_USO } from "@/lib/legal";

/** Rodapé com os links públicos exigidos pelo Google Auth Platform. */
export function LinksDocumentosLegais() {
  const classeLink = "underline-offset-4 hover:text-foreground hover:underline";
  return (
    <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      <span>© {new Date().getFullYear()} {NOME_SISTEMA}</span>
      <Link href={ROTA_POLITICA_PRIVACIDADE} className={classeLink}>
        Política de Privacidade
      </Link>
      <Link href={ROTA_TERMOS_USO} className={classeLink}>
        Termos de Uso
      </Link>
    </nav>
  );
}
