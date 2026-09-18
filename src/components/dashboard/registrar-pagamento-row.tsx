"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegistrarPagamentoAluguel } from "@/hooks/use-pagamentos-aluguel";
import { formaPagamentoLabels } from "@/lib/labels";
import {
  FORMA_PAGAMENTO,
  type FormaPagamento,
  type PagamentoAluguelResponse,
  type UUID,
} from "@/lib/types";

function hojeIso() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Célula de ação da linha da tabela de aluguéis em atraso: abre um modal
 * para confirmar data e forma de pagamento. Ao salvar, o registro é
 * quitado (status PAGO) e sai da lista de atrasados — não fica mais
 * visível nesta tela.
 */
export function RegistrarPagamentoRow({
  pagamento,
  onRegistrado,
}: {
  pagamento: PagamentoAluguelResponse;
  onRegistrado: (id: UUID) => void;
}) {
  const registrar = useRegistrarPagamentoAluguel();
  const [open, setOpen] = React.useState(false);
  const [dataPagamento, setDataPagamento] = React.useState(hojeIso());
  const [formaPagamento, setFormaPagamento] = React.useState<
    FormaPagamento | ""
  >("");

  const salvar = () => {
    if (!dataPagamento || !formaPagamento) {
      toast.error("Preencha a data e a forma de pagamento.");
      return;
    }
    registrar.mutate(
      { id: pagamento.id, body: { dataPagamento, formaPagamento } },
      {
        onSuccess: () => {
          onRegistrado(pagamento.id);
          setOpen(false);
        },
      },
    );
  };

  return (
    <TableCell>
      <Dialog open={open} onOpenChange={setOpen}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          title="Marcar como pago"
          aria-label="Marcar como pago"
        >
          <CheckCircle2 className="size-5 text-emerald-600" />
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marcar aluguel como pago</DialogTitle>
            <DialogDescription>
              Informe a data e a forma de pagamento para quitar esta
              cobrança. O valor pago será o valor previsto integral.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor={`data-pagamento-${pagamento.id}`}>
                Data de pagamento
              </Label>
              <input
                id={`data-pagamento-${pagamento.id}`}
                type="date"
                value={dataPagamento}
                onChange={(e) => setDataPagamento(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label>Forma de pagamento</Label>
              <Select
                value={formaPagamento}
                onValueChange={(v) => setFormaPagamento(v as FormaPagamento)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {FORMA_PAGAMENTO.map((forma) => (
                    <SelectItem key={forma} value={forma}>
                      {formaPagamentoLabels[forma]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={salvar} disabled={registrar.isPending}>
              {registrar.isPending ? "Salvando…" : "Marcar como pago"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TableCell>
  );
}
