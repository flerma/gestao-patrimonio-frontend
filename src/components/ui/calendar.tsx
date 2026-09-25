"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];
const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function toIso(ano: number, mesZero: number, dia: number): string {
  return `${ano}-${String(mesZero + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

/** Grade de calendário mensal (yyyy-MM-dd), com digitação continuando disponível fora deste componente. */
export function Calendar({
  value,
  onSelect,
  className,
}: {
  value?: string;
  onSelect: (iso: string) => void;
  className?: string;
}) {
  const valorParseado = React.useMemo(() => {
    const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return undefined;
    return { ano: Number(match[1]), mes: Number(match[2]) - 1 };
  }, [value]);

  const hoje = new Date();
  const [mesVisivel, setMesVisivel] = React.useState(
    () => valorParseado ?? { ano: hoje.getFullYear(), mes: hoje.getMonth() },
  );
  const [ultimoValor, setUltimoValor] = React.useState(value);

  // Segue a data selecionada quando ela muda por fora (digitação ou
  // sugestão automática), sem interferir na navegação manual entre meses.
  if (value !== ultimoValor) {
    setUltimoValor(value);
    if (valorParseado) {
      setMesVisivel(valorParseado);
    }
  }

  const primeiroDiaSemana = new Date(mesVisivel.ano, mesVisivel.mes, 1).getDay();
  const totalDias = new Date(mesVisivel.ano, mesVisivel.mes + 1, 0).getDate();
  const isoHoje = toIso(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

  const celulas: Array<{ dia: number; iso: string } | null> = [
    ...Array.from({ length: primeiroDiaSemana }, () => null),
    ...Array.from({ length: totalDias }, (_, i) => ({
      dia: i + 1,
      iso: toIso(mesVisivel.ano, mesVisivel.mes, i + 1),
    })),
  ];

  const irParaMesAnterior = () =>
    setMesVisivel(({ ano, mes }) => (mes === 0 ? { ano: ano - 1, mes: 11 } : { ano, mes: mes - 1 }));
  const irParaMesSeguinte = () =>
    setMesVisivel(({ ano, mes }) => (mes === 11 ? { ano: ano + 1, mes: 0 } : { ano, mes: mes + 1 }));

  return (
    <div className={cn("w-64 select-none", className)}>
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={irParaMesAnterior}
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-sm font-medium">
          {MESES[mesVisivel.mes]} {mesVisivel.ano}
        </span>
        <button
          type="button"
          onClick={irParaMesSeguinte}
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label="Próximo mês"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {DIAS_SEMANA.map((dia, i) => (
          <span key={i} className="flex h-7 items-center justify-center">
            {dia}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {celulas.map((celula, i) =>
          celula === null ? (
            <span key={`vazio-${i}`} />
          ) : (
            <button
              key={celula.iso}
              type="button"
              onClick={() => onSelect(celula.iso)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md text-sm hover:bg-accent hover:text-accent-foreground",
                celula.iso === value &&
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                celula.iso === isoHoje && celula.iso !== value && "border border-primary/50",
              )}
            >
              {celula.dia}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
