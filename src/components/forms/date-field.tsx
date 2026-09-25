"use client";

import * as React from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { CalendarIcon } from "lucide-react";

import { formatIsoToDateBR, maskDateBR, parseDateBRToIso } from "@/lib/date";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function DateInput({
  value,
  onChange,
  onBlur,
}: {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  onBlur: () => void;
}) {
  const [display, setDisplay] = React.useState(() => formatIsoToDateBR(value));
  const [ultimoValor, setUltimoValor] = React.useState(value);
  const [calendarioAberto, setCalendarioAberto] = React.useState(false);

  // Ressincroniza durante a renderização (sem efeito) quando o valor muda
  // por outro motivo que não a digitação aqui — ex.: reset do formulário ao
  // carregar um registro para edição, ou preenchimento automático.
  if (value !== ultimoValor && parseDateBRToIso(display) !== value) {
    setUltimoValor(value);
    setDisplay(formatIsoToDateBR(value));
  }

  const selecionarNoCalendario = (iso: string) => {
    setUltimoValor(iso);
    setDisplay(formatIsoToDateBR(iso));
    onChange(iso);
    setCalendarioAberto(false);
  };

  return (
    <div className="flex items-center gap-1.5">
      <Input
        inputMode="numeric"
        placeholder="dd/mm/aaaa"
        value={display}
        onChange={(e) => {
          const masked = maskDateBR(e.target.value);
          setDisplay(masked);
          onChange(parseDateBRToIso(masked));
        }}
        onBlur={onBlur}
      />
      <Popover open={calendarioAberto} onOpenChange={setCalendarioAberto}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0"
            aria-label="Abrir calendário"
          >
            <CalendarIcon className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <Calendar value={value} onSelect={selecionarNoCalendario} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function DateField<T extends FieldValues>({
  control,
  name,
  label,
  className,
}: {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  className?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <DateInput
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
