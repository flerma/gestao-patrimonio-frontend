"use client";

import * as React from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Check, Loader2, Search } from "lucide-react";

import { ApiError, enderecosApi } from "@/lib/api";
import type { Endereco } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function maskCep(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

type Status = "idle" | "loading" | "ok" | "error";

interface CepFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  /** Chamado quando o CEP é encontrado — o formulário preenche os campos. */
  onResolved: (endereco: Endereco) => void;
  className?: string;
}

export function CepField<T extends FieldValues>({
  control,
  name,
  label = "CEP",
  onResolved,
  className,
}: CepFieldProps<T>) {
  const [status, setStatus] = React.useState<Status>("idle");
  const [mensagem, setMensagem] = React.useState<string | null>(null);
  const ultimoRef = React.useRef<string>("");
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const onResolvedRef = React.useRef(onResolved);

  React.useEffect(() => {
    onResolvedRef.current = onResolved;
  }, [onResolved]);

  const consultar = React.useCallback((raw: string) => {
    const digitos = raw.replace(/\D/g, "");
    if (digitos.length !== 8 || digitos === ultimoRef.current) return;
    ultimoRef.current = digitos;
    setStatus("loading");
    setMensagem(null);
    enderecosApi
      .buscarPorCep(digitos)
      .then((endereco) => {
        setStatus("ok");
        onResolvedRef.current(endereco);
      })
      .catch((error: unknown) => {
        ultimoRef.current = ""; // permite tentar de novo o mesmo CEP
        setStatus("error");
        setMensagem(
          error instanceof ApiError && error.status === 404
            ? "CEP não encontrado. Preencha o endereço manualmente."
            : error instanceof ApiError && error.status === 400
              ? "CEP inválido."
              : "Não foi possível consultar o CEP agora.",
        );
      });
  }, []);

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="00000-000"
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  const masked = maskCep(e.target.value);
                  field.onChange(masked);
                  if (masked.replace(/\D/g, "").length < 8) {
                    ultimoRef.current = "";
                    setStatus("idle");
                    setMensagem(null);
                  }
                  if (debounceRef.current) clearTimeout(debounceRef.current);
                  debounceRef.current = setTimeout(
                    () => consultar(masked),
                    500,
                  );
                }}
                onBlur={(e) => {
                  field.onBlur();
                  if (debounceRef.current) clearTimeout(debounceRef.current);
                  consultar(e.target.value);
                }}
                className="pr-9"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {status === "loading" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : status === "ok" ? (
                  <Check className="size-4 text-success" />
                ) : (
                  <Search className="size-4" />
                )}
              </span>
            </div>
          </FormControl>
          {status === "loading" && (
            <p className="text-xs text-muted-foreground">Buscando endereço…</p>
          )}
          {mensagem && (
            <p
              className={cn(
                "text-xs",
                status === "error" ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {mensagem}
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
