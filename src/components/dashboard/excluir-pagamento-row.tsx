"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";

import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useExcluirPagamentoAluguel } from "@/hooks/use-pagamentos-aluguel";
import type { PagamentoAluguelResponse, UUID } from "@/lib/types";

/**
 * Célula de ação da linha de aluguel: ícone de lixeira que pede confirmação
 * antes de excluir permanentemente o registro.
 */
export function ExcluirPagamentoRow({
  pagamento,
  onExcluido,
}: {
  pagamento: PagamentoAluguelResponse;
  onExcluido: (id: UUID) => void;
}) {
  const excluir = useExcluirPagamentoAluguel();
  const [open, setOpen] = React.useState(false);

  return (
    <TableCell>
      <Dialog open={open} onOpenChange={setOpen}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          title="Excluir aluguel"
          aria-label="Excluir aluguel"
        >
          <Trash2 className="size-5 text-destructive" />
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir aluguel</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja excluir permanentemente este aluguel?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={excluir.isPending}
              onClick={() =>
                excluir.mutate(pagamento.id, {
                  onSuccess: () => {
                    onExcluido(pagamento.id);
                    setOpen(false);
                  },
                })
              }
            >
              {excluir.isPending ? "Excluindo…" : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TableCell>
  );
}
