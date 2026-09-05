"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { PontoEvolucao } from "@/lib/dashboard";
import {
  formatCompactCurrency,
  formatCurrency,
  formatMonthLabel,
} from "@/lib/format";

interface RentEvolutionChartProps {
  data: PontoEvolucao[];
}

export function RentEvolutionChart({ data }: RentEvolutionChartProps) {
  const chartData = data.map((ponto) => ({
    ...ponto,
    label: formatMonthLabel(ponto.mes),
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 8, right: 8, left: 4, bottom: 0 }}
        >
          <defs>
            <linearGradient id="fillAluguel" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-chart-1)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="var(--color-chart-1)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--color-border)"
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={72}
            tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
            tickFormatter={(value: number) => formatCompactCurrency(value)}
          />
          <Tooltip
            formatter={(value, name) => [
              formatCurrency(Number(value)),
              name === "previsto" ? "Aluguel no mês" : "Acumulado",
            ]}
            labelFormatter={(label) => `Mês: ${label}`}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid var(--color-border)",
              background: "var(--color-popover)",
              color: "var(--color-popover-foreground)",
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="previsto"
            stroke="var(--color-chart-1)"
            strokeWidth={2}
            fill="url(#fillAluguel)"
          />
          <Line
            type="monotone"
            dataKey="acumulado"
            stroke="var(--color-chart-2)"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
