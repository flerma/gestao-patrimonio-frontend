"use client";

import * as React from "react";
import { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface NavigationProgressContextValue {
  /** Registra uma navegação em andamento; devolve função para liberar. */
  push: () => () => void;
  /** Há ao menos uma navegação em andamento. */
  active: boolean;
}

const NavigationProgressContext =
  React.createContext<NavigationProgressContextValue | null>(null);

export function useNavigationProgress() {
  return React.useContext(NavigationProgressContext);
}

export function NavigationProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [count, setCount] = React.useState(0);
  const releasesRef = React.useRef<Array<() => void>>([]);

  const push = React.useCallback(() => {
    setCount((c) => c + 1);
    let released = false;
    return () => {
      if (released) return;
      released = true;
      setCount((c) => Math.max(0, c - 1));
    };
  }, []);

  // Detecta qualquer clique em link interno (menu, "voltar", tabelas, cards…)
  // e mantém o indicador ativo até a rota mudar.
  React.useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (
        !href ||
        !href.startsWith("/") ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      const target = new URL(href, window.location.href);
      if (
        target.pathname === window.location.pathname &&
        target.search === window.location.search
      ) {
        return;
      }

      const release = push();
      releasesRef.current.push(release);
      // Rede de segurança: nunca deixa o indicador preso.
      window.setTimeout(release, 10_000);
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleClick, { capture: true });
  }, [push]);

  // Rota mudou => navegação concluída: libera tudo que estava pendente.
  React.useEffect(() => {
    releasesRef.current.forEach((release) => release());
    releasesRef.current = [];
  }, [pathname]);

  const value = React.useMemo(
    () => ({ push, active: count > 0 }),
    [push, count],
  );

  return (
    <NavigationProgressContext.Provider value={value}>
      {children}
      <TopProgressBar active={value.active} />
    </NavigationProgressContext.Provider>
  );
}

/**
 * Deve ser renderizado como descendente de um <Link>. Enquanto o link estiver
 * navegando, mantém o indicador global (barra + overlay) ativo e devolve
 * `pending` para o próprio item exibir um spinner.
 */
export function useReportLinkNavigation() {
  const { pending } = useLinkStatus();
  const progress = useNavigationProgress();

  React.useEffect(() => {
    if (!pending || !progress) return;
    return progress.push();
  }, [pending, progress]);

  return pending;
}

function TopProgressBar({ active }: { active: boolean }) {
  // Sempre montado (custo desprezível) — só alterna opacidade, evitando
  // gerenciar estado dentro de efeito.
  return (
    <div
      role="status"
      aria-label="Carregando página"
      aria-hidden={!active}
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden transition-opacity duration-300",
        active ? "bg-primary/15 opacity-100" : "opacity-0",
      )}
    >
      <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-primary animate-[nav-slide_1s_ease-in-out_infinite]" />
    </div>
  );
}

/**
 * Overlay central com spinner. Aparece só quando a troca de tela demora mais
 * que ~220ms, evitando piscar em navegações instantâneas.
 */
export function RouteLoadingOverlay() {
  const progress = useNavigationProgress();
  const active = progress?.active ?? false;
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    // setState apenas dentro de callbacks assíncronos (não no corpo do efeito).
    const timeout = setTimeout(() => setVisible(active), active ? 220 : 0);
    return () => clearTimeout(timeout);
  }, [active]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute inset-0 z-40 flex items-start justify-center bg-background/55 backdrop-blur-[1px]"
    >
      <div className="mt-24 flex flex-col items-center gap-3 rounded-xl border border-border bg-card px-7 py-6 shadow-lg">
        <Loader2 className="size-7 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Carregando…</p>
      </div>
    </div>
  );
}
