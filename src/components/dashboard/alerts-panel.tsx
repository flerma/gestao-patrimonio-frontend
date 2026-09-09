import Link from "next/link";
import {
  AlertTriangle,
  BellRing,
  ChevronRight,
  Info,
  OctagonAlert,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { Alerta, AlertaSeveridade } from "@/lib/dashboard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const config: Record<
  AlertaSeveridade,
  { icon: typeof Info; className: string }
> = {
  danger: {
    icon: OctagonAlert,
    className: "border-destructive/30 bg-destructive/5 text-destructive",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-warning/30 bg-warning/5 text-warning",
  },
  info: {
    icon: Info,
    className: "border-primary/30 bg-primary/5 text-primary",
  },
};

export function AlertsPanel({ alertas }: { alertas: Alerta[] }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <BellRing className="size-4" />
          Alertas
        </CardTitle>
        {alertas.length > 0 && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {alertas.length}
          </span>
        )}
      </CardHeader>
      <CardContent className="flex-1 space-y-2.5 overflow-y-auto">
        {alertas.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum alerta no momento. Está tudo em dia. 🎉
          </p>
        ) : (
          alertas.map((alerta) => {
            const { icon: Icon, className } = config[alerta.severidade];
            const body = (
              <>
                <Icon className="mt-0.5 size-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{alerta.titulo}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {alerta.descricao}
                  </p>
                </div>
                {alerta.href && (
                  <ChevronRight className="mt-0.5 size-4 shrink-0 self-center" />
                )}
              </>
            );

            if (alerta.href) {
              return (
                <Link
                  key={alerta.id}
                  href={alerta.href}
                  className={cn(
                    "flex gap-3 rounded-lg border p-3 text-sm transition-opacity hover:opacity-80",
                    className,
                  )}
                >
                  {body}
                </Link>
              );
            }

            return (
              <div
                key={alerta.id}
                className={cn(
                  "flex gap-3 rounded-lg border p-3 text-sm",
                  className,
                )}
              >
                {body}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
