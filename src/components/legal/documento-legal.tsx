import type * as React from "react";

import { DATA_ATUALIZACAO_DOCUMENTOS_LEGAIS, EMAIL_CONTATO } from "@/lib/legal";

/** Blocos de texto das páginas públicas de Política de Privacidade e Termos de Uso. */

export function DocumentoLegal({
  titulo,
  introducao,
  children,
}: {
  titulo: string;
  introducao: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <article className="space-y-8 text-[0.95rem] leading-relaxed text-foreground">
      <header className="space-y-3 border-b pb-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{titulo}</h1>
        <p className="text-sm text-muted-foreground">
          Última atualização: {DATA_ATUALIZACAO_DOCUMENTOS_LEGAIS}
        </p>
        <div className="text-muted-foreground">{introducao}</div>
      </header>
      {children}
    </article>
  );
}

export function Secao({
  numero,
  titulo,
  children,
}: {
  numero: number;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3" id={`secao-${numero}`}>
      <h2 className="text-lg font-semibold">
        {numero}. {titulo}
      </h2>
      {children}
    </section>
  );
}

export function Lista({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc space-y-1.5 pl-6 marker:text-muted-foreground">{children}</ul>;
}

export function EmailContato() {
  return (
    <a href={`mailto:${EMAIL_CONTATO}`} className="font-medium text-primary underline-offset-4 hover:underline">
      {EMAIL_CONTATO}
    </a>
  );
}
