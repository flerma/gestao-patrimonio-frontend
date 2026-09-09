import Link from "next/link";
import { ArrowUpRight, Receipt } from "lucide-react";

import type { ResumoPagamentos } from "@/lib/dashboard";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface RentPaymentsCardProps {
  resumo: ResumoPagamentos;
  loading?: boolean;
  error?: boolean;
}

const statusRows = [
  { key: "pagos", label: "Pagos", dot: "bg-success" },
  { key: "pendentes", label: "Pendentes", dot: "bg-warning" },
  { key: "emAtraso", label: "Em atraso", dot: "bg-destructive" },
] as const;

export function RentPaymentsCard({
  resumo,
  loading = false,
  error = false,
}: RentPaymentsCardProps) {
  return (
    <Card>
      <CardHeader className="space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <Receipt className="size-4" />
          Pagamentos de aluguel
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Não foi possível carregar os pagamentos de aluguel.
          </p>
        ) : loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <ul className="space-y-2.5">
              {statusRows.map((row) => {
                const value = resumo[row.key];
                const linkToAtraso = row.key === "emAtraso" && value > 0;
                const label = (
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span
                      className={cn("size-2.5 rounded-full", row.dot)}
                      aria-hidden
                    />
                    {row.label}
                  </span>
                );

                if (linkToAtraso) {
                  return (
                    <li key={row.key}>
                      <Link
                        href="/alugueis-atrasados"
                        className="flex items-center justify-between text-sm transition-opacity hover:opacity-80"
                      >
                        {label}
                        <span className="flex items-center gap-1 font-semibold tabular-nums text-destructive underline underline-offset-2">
                          {value}
                          <ArrowUpRight className="size-3.5" aria-hidden />
                        </span>
                      </Link>
                    </li>
                  );
                }

                return (
                  <li
                    key={row.key}
                    className="flex items-center justify-between text-sm"
                  >
                    {label}
                    <span className="font-semibold tabular-nums">{value}</span>
                  </li>
                );
              })}
            </ul>

            <Separator />

            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Total previsto</dt>
                <dd className="font-medium tabular-nums">
                  {formatCurrency(resumo.totalPrevisto)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Total recebido</dt>
                <dd className="font-medium tabular-nums text-success">
                  {formatCurrency(resumo.totalRecebido)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Total em atraso</dt>
                <dd className="font-medium tabular-nums text-destructive">
                  {formatCurrency(resumo.totalEmAtraso)}
                </dd>
              </div>
            </dl>

            {resumo.quantidade === 0 && (
              <p className="text-xs text-muted-foreground">
                Nenhuma cobrança de aluguel gerada ainda.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
