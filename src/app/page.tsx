"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  CircleDollarSign,
  Percent,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { useSelectedUser } from "@/components/providers";
import { PageHeader } from "@/components/page-header";
import { ErrorState, LoadingState } from "@/components/query-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { RentEvolutionChart } from "@/components/dashboard/rent-evolution-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useImoveis } from "@/hooks/use-imoveis";
import { useContratos } from "@/hooks/use-contratos";
import { useUsuarios } from "@/hooks/use-usuarios";
import {
  calcularEvolucao,
  calcularResumo,
  filtrarPorUsuario,
  gerarAlertas,
} from "@/lib/dashboard";
import { formatCurrency, formatDate, formatPercent } from "@/lib/format";
import { statusImovelLabels, statusImovelVariant, tipoImovelLabels } from "@/lib/labels";

export default function DashboardPage() {
  const { usuarioId } = useSelectedUser();
  const imoveisQuery = useImoveis();
  const contratosQuery = useContratos();
  const usuariosQuery = useUsuarios();

  const isLoading = imoveisQuery.isLoading || contratosQuery.isLoading;
  const error = imoveisQuery.error ?? contratosQuery.error;

  const dados = React.useMemo(() => {
    const imoveis = imoveisQuery.data ?? [];
    const contratos = contratosQuery.data ?? [];
    const { imoveisUsuario, contratosUsuario } = filtrarPorUsuario(
      imoveis,
      contratos,
      usuarioId ?? undefined,
    );
    return {
      imoveisUsuario,
      contratosUsuario,
      resumo: calcularResumo(imoveisUsuario, contratosUsuario),
      evolucao: calcularEvolucao(contratosUsuario, 12),
      alertas: gerarAlertas(imoveisUsuario, contratosUsuario),
    };
  }, [imoveisQuery.data, contratosQuery.data, usuarioId]);

  const nomeUsuario = usuarioId
    ? usuariosQuery.data?.find((u) => u.id === usuarioId)?.nome
    : null;

  const aluguelPorImovel = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const contrato of dados.contratosUsuario) {
      if (contrato.status === "ATIVO" && contrato.imovel) {
        map.set(
          contrato.imovel.id,
          (map.get(contrato.imovel.id) ?? 0) + Number(contrato.valorAluguel ?? 0),
        );
      }
    }
    return map;
  }, [dados.contratosUsuario]);

  if (error && !imoveisQuery.data && !contratosQuery.data) {
    return (
      <>
        <PageHeader title="Dashboard" description="Resumo do patrimônio" />
        <ErrorState
          error={error}
          onRetry={() => {
            imoveisQuery.refetch();
            contratosQuery.refetch();
          }}
        />
      </>
    );
  }

  const { resumo } = dados;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={
          nomeUsuario
            ? `Resumo do patrimônio de ${nomeUsuario}`
            : "Resumo consolidado do patrimônio"
        }
        actions={
          <Button asChild variant="outline">
            <Link href="/imoveis/novo">Novo imóvel</Link>
          </Button>
        }
      />

      {isLoading && !imoveisQuery.data ? (
        <LoadingState label="Carregando patrimônio…" />
      ) : (
        <div className="space-y-6">
          {/* Totais */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Patrimônio total"
              value={formatCurrency(resumo.totalPatrimonio)}
              hint={`${resumo.qtdImoveis} imóvel(is) · valorização ${formatCurrency(resumo.valorizacao)}`}
              icon={<Building2 />}
              accent="primary"
            />
            <StatCard
              label="Aluguéis (mensal)"
              value={formatCurrency(resumo.aluguelMensal)}
              hint={`${formatCurrency(resumo.aluguelAnual)} por ano · ${resumo.qtdContratosAtivos} contrato(s) ativo(s)`}
              icon={<CircleDollarSign />}
              accent="success"
            />
            <StatCard
              label="Resultado (aluguel/patrimônio)"
              value={formatPercent(resumo.resultadoPercentual)}
              hint="Rendimento anual do aluguel sobre o valor do patrimônio"
              icon={<Percent />}
              accent="warning"
            />
            <StatCard
              label="Aluguéis recebidos (acum.)"
              value={formatCurrency(resumo.aluguelRecebidoAcumulado)}
              hint="Estimativa desde o início de cada contrato"
              icon={<Wallet />}
              accent="primary"
            />
          </div>

          {/* Gráfico + Alertas */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="size-4" />
                  Evolução dos recebimentos de aluguéis
                </CardTitle>
                <CardDescription>
                  Aluguel previsto por mês e total acumulado nos últimos 12 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RentEvolutionChart data={dados.evolucao} />
              </CardContent>
            </Card>

            <div className="lg:col-span-1">
              <AlertsPanel alertas={dados.alertas} />
            </div>
          </div>

          {/* Lista de imóveis */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Imóveis</CardTitle>
                <CardDescription>
                  {resumo.qtdImoveisAlugados} de {resumo.qtdImoveis} alugado(s)
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/imoveis">Ver todos</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {dados.imoveisUsuario.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Nenhum imóvel cadastrado para este proprietário.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imóvel</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Valor atual</TableHead>
                      <TableHead className="text-right">Aluguel/mês</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dados.imoveisUsuario.map((imovel) => (
                      <TableRow key={imovel.id}>
                        <TableCell className="font-medium">
                          <Link
                            href={`/imoveis/${imovel.id}`}
                            className="hover:underline"
                          >
                            {imovel.nome}
                          </Link>
                        </TableCell>
                        <TableCell>{tipoImovelLabels[imovel.tipo]}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {[imovel.endereco?.cidade, imovel.endereco?.estado]
                            .filter(Boolean)
                            .join(" / ") || "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusImovelVariant[imovel.status]}>
                            {statusImovelLabels[imovel.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(imovel.valorAtual)}
                        </TableCell>
                        <TableCell className="text-right">
                          {aluguelPorImovel.has(imovel.id)
                            ? formatCurrency(aluguelPorImovel.get(imovel.id))
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground">
            Última sincronização com a API:{" "}
            {formatDate(new Date().toISOString())} — dados de{" "}
            <code>/api/imoveis</code> e <code>/api/contratos</code>.
          </p>
        </div>
      )}
    </>
  );
}
