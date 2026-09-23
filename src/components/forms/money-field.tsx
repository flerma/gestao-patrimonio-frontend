"use client";

import * as React from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { formatMoneyValue, maskMoney, parseMoneyMask } from "@/lib/money";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function MoneyInput({
  value,
  onChange,
  onBlur,
}: {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  onBlur: () => void;
}) {
  const [display, setDisplay] = React.useState(() => formatMoneyValue(value));
  const [ultimoValor, setUltimoValor] = React.useState(value);

  // Ressincroniza durante a renderização (sem efeito) quando o valor muda
  // por outro motivo que não a digitação aqui — ex.: reset do formulário ao
  // carregar um registro para edição. Padrão recomendado pelo React para
  // "ajustar estado quando uma prop muda".
  if (value !== ultimoValor && parseMoneyMask(display) !== value) {
    setUltimoValor(value);
    setDisplay(formatMoneyValue(value));
  }

  return (
    <Input
      inputMode="decimal"
      placeholder="0,00"
      value={display}
      onChange={(e) => {
        const masked = maskMoney(e.target.value);
        setDisplay(masked);
        onChange(parseMoneyMask(masked));
      }}
      onBlur={onBlur}
    />
  );
}

export function MoneyField<T extends FieldValues>({
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
            <MoneyInput
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
