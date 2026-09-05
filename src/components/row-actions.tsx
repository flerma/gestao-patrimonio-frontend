"use client";

import * as React from "react";
import Link from "next/link";
import { MoreHorizontal, Pencil, ShieldAlert, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function RowActions({
  editHref,
  onDelete,
  itemLabel,
  deleting = false,
  blockedReason = null,
}: {
  editHref: string;
  onDelete: () => void;
  itemLabel: string;
  deleting?: boolean;
  /** Quando informado, a exclusão é bloqueada e o texto é exibido no diálogo. */
  blockedReason?: string | null;
}) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const isBlocked = Boolean(blockedReason);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Ações">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={editHref}>
              <Pencil className="size-4" /> Editar
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={(e) => {
              e.preventDefault();
              setConfirmOpen(true);
            }}
          >
            <Trash2 className="size-4" /> Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isBlocked ? "Exclusão não permitida" : "Excluir registro"}
            </DialogTitle>
            <DialogDescription>
              {isBlocked ? (
                <span className="flex items-start gap-2 text-destructive">
                  <ShieldAlert className="mt-0.5 size-4 shrink-0" />
                  <span>{blockedReason}</span>
                </span>
              ) : (
                <>
                  Tem certeza de que deseja excluir{" "}
                  <strong>{itemLabel}</strong>? Esta ação não pode ser desfeita.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {isBlocked ? (
              <Button onClick={() => setConfirmOpen(false)}>Entendi</Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setConfirmOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  disabled={deleting}
                  onClick={() => {
                    onDelete();
                    setConfirmOpen(false);
                  }}
                >
                  {deleting ? "Excluindo…" : "Excluir"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
