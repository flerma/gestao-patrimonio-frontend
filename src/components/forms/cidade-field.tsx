"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { useMunicipios } from "@/hooks/use-municipios";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CidadeField<T extends FieldValues>({
  control,
  name,
  uf,
  className,
}: {
  control: Control<T>;
  name: FieldPath<T>;
  /** Sigla do estado selecionado — a lista de municípios depende dela. */
  uf: string | undefined;
  className?: string;
}) {
  const municipiosQuery = useMunicipios(uf);
  const municipios = municipiosQuery.data ?? [];

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Garante que o valor atual sempre tenha um item correspondente,
        // mesmo antes da lista terminar de carregar (ex.: logo após o
        // preenchimento automático pelo CEP).
        const opcoes =
          field.value && !municipios.includes(field.value)
            ? [field.value, ...municipios]
            : municipios;
        const placeholder = !uf
          ? "Selecione o estado primeiro"
          : municipiosQuery.isLoading
            ? "Carregando…"
            : "Selecione";

        return (
          <FormItem className={className}>
            <FormLabel>Cidade</FormLabel>
            <Select
              value={field.value ?? ""}
              onValueChange={field.onChange}
              disabled={!uf || municipiosQuery.isLoading}
            >
              <FormControl>
                <SelectTrigger>
                  {/* Children explícitos: o Radix só mostra o texto do item
                      selecionado automaticamente se o <SelectItem> já foi
                      renderizado alguma vez (dropdown aberto) — como aqui o
                      valor pode ser setado programaticamente (preenchimento
                      pelo CEP) antes de qualquer abertura, isso garante que
                      o texto apareça de imediato. */}
                  <SelectValue placeholder={placeholder}>
                    {field.value || undefined}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {opcoes.map((cidade) => (
                  <SelectItem key={cidade} value={cidade}>
                    {cidade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {municipiosQuery.isError && (
              <p className="text-xs text-destructive">
                Não foi possível carregar os municípios agora.
              </p>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
