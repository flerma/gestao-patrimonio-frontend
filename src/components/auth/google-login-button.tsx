"use client";

import * as React from "react";
import Script from "next/script";

import { useLoginGoogle } from "@/hooks/use-auth";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

/** Subconjunto da API do Google Identity Services (accounts.google.com/gsi/client) usado aqui. */
interface GoogleIdentityServices {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: { credential?: string }) => void;
        ux_mode?: "popup" | "redirect";
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: {
          type?: "standard" | "icon";
          theme?: "outline" | "filled_blue" | "filled_black";
          size?: "large" | "medium" | "small";
          text?: "signin_with" | "signup_with" | "continue_with" | "signin";
          shape?: "rectangular" | "pill" | "circle" | "square";
          logo_alignment?: "left" | "center";
          width?: number;
          locale?: string;
        },
      ) => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentityServices;
  }
}

/**
 * Botão oficial "Fazer login com o Google" (Google Identity Services). Ao
 * escolher a conta, o Google entrega um ID token, repassado ao backend via
 * `POST /api/auth/google` — que entra na conta existente ou cria uma nova no
 * primeiro acesso. Não renderiza nada se `NEXT_PUBLIC_GOOGLE_CLIENT_ID` não
 * estiver configurado.
 */
export function GoogleLoginButton({ onSuccess }: { onSuccess: () => void }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const loginGoogle = useLoginGoogle();

  // O callback do Google é registrado uma vez; a ref mantém mutate/onSuccess atuais.
  const aoReceberCredencial = React.useRef<(idToken: string) => void>(() => {});
  const { mutate } = loginGoogle;
  React.useLayoutEffect(() => {
    aoReceberCredencial.current = (idToken) => mutate(idToken, { onSuccess });
  }, [mutate, onSuccess]);

  const renderizarBotao = React.useCallback(() => {
    const google = window.google;
    const container = containerRef.current;
    if (!google || !container) return;
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: ({ credential }) => {
        if (credential) aoReceberCredencial.current(credential);
      },
      ux_mode: "popup",
    });
    google.accounts.id.renderButton(container, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      logo_alignment: "center",
      // O botão do Google aceita largura em px (máx. 400), não "100%".
      width: Math.min(400, Math.max(200, container.offsetWidth)),
      locale: "pt-BR",
    });
  }, []);

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center gap-3 text-xs uppercase text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        ou
        <span className="h-px flex-1 bg-border" />
      </div>
      <div
        ref={containerRef}
        className="flex min-h-10 w-full justify-center"
        aria-busy={loginGoogle.isPending}
      />
      {loginGoogle.isPending && (
        <p className="text-center text-sm text-muted-foreground">Entrando com o Google…</p>
      )}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={renderizarBotao}
      />
    </div>
  );
}
