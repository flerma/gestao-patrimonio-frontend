"use client";

import * as React from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { formatIsoToDateBR, maskDateBR, parseDateBRToIso } from "@/lib/date";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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

  // Ressincroniza durante a renderização (sem efeito) quando o valor muda
  // por outro motivo que não a digitação aqui — ex.: reset do formulário ao
  // carregar um registro para edição, ou preenchimento automático.
  if (value !== ultimoValor && parseDateBRToIso(display) !== value) {
    setUltimoValor(value);
    setDisplay(formatIsoToDateBR(value));
  }

  return (
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
