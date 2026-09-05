"use client";

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

const ALL_VALUE = "__all__";

export function UserSwitcher({ compact = false }: { compact?: boolean }) {
  const { usuarioId, setUsuarioId } = useSelectedUser();
  const { data: usuarios, isLoading } = useUsuarios();

  return (
    <div className={compact ? "" : "px-3 pb-3 pt-1"}>
      {!compact && (
        <p className="mb-1.5 px-1 text-xs font-medium uppercase tracking-wide text-sidebar-muted">
          Proprietário
        </p>
      )}
      <Select
        value={usuarioId ?? ALL_VALUE}
        onValueChange={(value) =>
          setUsuarioId(value === ALL_VALUE ? null : value)
        }
      >
        <SelectTrigger className="h-9 border-sidebar-border bg-sidebar-accent/60 text-sidebar-foreground [&>span]:truncate">
          <span className="flex items-center gap-2 overflow-hidden">
            <UserRound className="size-4 shrink-0" />
            <SelectValue placeholder="Selecione" />
          </span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>Todos os proprietários</SelectItem>
          {isLoading && (
            <SelectItem value="loading" disabled>
              Carregando…
            </SelectItem>
          )}
          {usuarios?.map((usuario) => (
            <SelectItem key={usuario.id} value={usuario.id}>
              {usuario.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
