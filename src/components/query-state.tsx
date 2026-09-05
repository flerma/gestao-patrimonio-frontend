import * as React from "react";
import { AlertTriangle, Inbox, Loader2 } from "lucide-react";

import { ApiError, API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";

export function LoadingState({ label = "Carregando…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      {label}
    </div>
  );
}

export function EmptyState({
  title = "Nada por aqui",
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
      <Inbox className="size-8 text-muted-foreground" />
      <div>
        <p className="font-medium">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function ErrorState({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry?: () => void;
}) {
  const isNetwork = !(error instanceof ApiError);
  const message =
    error instanceof ApiError
      ? error.message
      : "Não foi possível conectar à API.";

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 py-16 text-center">
      <AlertTriangle className="size-8 text-destructive" />
      <div className="max-w-md">
        <p className="font-medium text-destructive">{message}</p>
        {isNetwork && (
          <p className="mt-1 text-sm text-muted-foreground">
            Verifique se a API <code>gestao-patrimonio-imobiliario</code> está
            em execução em <code>{API_BASE_URL}</code>.
          </p>
        )}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
