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
  disabled,
}: {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  onBlur: () => void;
  disabled?: boolean;
}) {
  const [display, setDisplay] = React.useState(() => formatMoneyValue(value));
  const [ultimoValor, setUltimoValor] = React.useState(value);

  // Ressincroniza durante a renderização (sem efeito) quando o valor muda
  // por outro motivo que não a digitação aqui — ex.: reset do formulário ao
  // carregar um registro para edição, ou zeramento programático (troca de
  // tipo de garantia/índice de reajuste). Padrão recomendado pelo React
  // para "ajustar estado quando uma prop muda". `ultimoValor` precisa ser
  // atualizado sempre que o valor externo mudar — mesmo quando o display
  // já reflete esse valor (ex.: logo após a própria digitação) — senão uma
  // mudança externa futura para esse mesmo valor "antigo" passa despercebida.
  if (value !== ultimoValor) {
    setUltimoValor(value);
    if (parseMoneyMask(display) !== value) {
      setDisplay(formatMoneyValue(value));
    }
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
      disabled={disabled}
    />
  );
}

export function MoneyField<T extends FieldValues>({
  control,
  name,
  label,
  className,
  disabled,
}: {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  className?: string;
  disabled?: boolean;
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
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
