"use client";

import * as React from "react";
import { UserRound } from "lucide-react";

import { useSelectedUser } from "@/components/providers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsuarios } from "@/hooks/use-usuarios";

export function UserSwitcher() {
  const { usuarioId, setUsuarioId } = useSelectedUser();
  const { data: usuarios, isLoading } = useUsuarios();

  // Mantém sempre um usuário selecionado (o primeiro, se nenhum válido).
  React.useEffect(() => {
    if (!usuarios || usuarios.length === 0) return;
    if (!usuarioId || !usuarios.some((u) => u.id === usuarioId)) {
      setUsuarioId(usuarios[0].id);
    }
  }, [usuarios, usuarioId, setUsuarioId]);

  const semUsuarios = !isLoading && (!usuarios || usuarios.length === 0);

  return (
    <div className="px-3 pb-3 pt-1">
      <Select
        value={usuarioId ?? ""}
        onValueChange={setUsuarioId}
        disabled={isLoading || semUsuarios}
      >
        <SelectTrigger className="h-9 border-sidebar-border bg-sidebar-accent/60 text-sidebar-foreground [&>span]:truncate">
          <span className="flex items-center gap-2 overflow-hidden">
            <UserRound className="size-4 shrink-0" />
            <SelectValue
              placeholder={isLoading ? "Carregando…" : "Selecione o usuário"}
            />
          </span>
        </SelectTrigger>
        <SelectContent>
          {semUsuarios ? (
            <SelectItem value="__none__" disabled>
              Nenhum usuário cadastrado
            </SelectItem>
          ) : (
            usuarios?.map((usuario) => (
              <SelectItem key={usuario.id} value={usuario.id}>
                {usuario.nome}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
