"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { maskCnpj, maskCpf } from "@/lib/documento";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function DocumentoField<T extends FieldValues>({
  control,
  name,
  pessoaFisica,
  className,
}: {
  control: Control<T>;
  name: FieldPath<T>;
  pessoaFisica: boolean;
  className?: string;
}) {
  const label = pessoaFisica ? "CPF" : "CNPJ";
  const placeholder = pessoaFisica ? "000.000.000-00" : "00.000.000/0000-00";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              inputMode={pessoaFisica ? "numeric" : "text"}
              placeholder={placeholder}
              {...field}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  pessoaFisica
                    ? maskCpf(e.target.value)
                    : maskCnpj(e.target.value),
                )
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
