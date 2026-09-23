"use client";

import * as React from "react";
import { ShieldAlert, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Botão de exclusão autônomo (ícone de lixeira vermelho) para telas de
 * cadastro/edição — sem o menu de ações (dropdown) do RowActions, já que
 * "editar" não faz sentido numa tela onde o usuário já está editando.
 */
export function DeleteIconButton({
  itemLabel,
  onDelete,
  deleting = false,
  blockedReason = null,
}: {
  itemLabel: string;
  onDelete: () => void;
  deleting?: boolean;
  /** Quando informado, a exclusão é bloqueada e o texto é exibido no diálogo. */
  blockedReason?: string | null;
}) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const isBlocked = Boolean(blockedReason);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
        aria-label="Excluir"
        title="Excluir"
        onClick={() => setConfirmOpen(true)}
      >
        <Trash2 className="size-4" />
      </Button>

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
