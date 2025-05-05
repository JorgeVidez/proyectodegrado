"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const edades = [
  0.656, 0.838, 2.563, 2.684, 8.206, 8.714, 11.195, 12.205, 12.269, 12.721,
  14.011, 14.722, 21.872, 23.158, 25.491, 27.022, 27.977, 29.357, 32.594,
  32.672,
];

const pesos = [
  45.632, 46.491, 73.229, 75.674, 146.645, 136.203, 159.181, 170.37, 169.075,
  164.188, 178.456, 172.169, 227.292, 207.664, 213.679, 224.834, 233.81,
  205.637, 206.55, 217.325,
];

const predichos = [
  54.819, 56.489, 75.073, 76.523, 141.978, 146.597, 163.947, 168.819, 169.093,
  170.931, 175.414, 177.562, 202.331, 207.849, 216.963, 221.492, 223.471,
  224.994, 222.0, 221.817,
];


// Preparar datos para el gráfico
const chartData = edades.map((edad, index) => ({
  edad,
  real: pesos[index],
  predicho: predichos[index],
}));

const chartConfig = {
  real: {
    label: "Peso real (kg)",
    color: "hsl(var(--chart-1))",
  },
  predicho: {
    label: "Peso predicho (kg)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function AreaChartGradient() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Predicción de peso - SVR</CardTitle>
        <CardDescription>Rango de edad: 0 a 36 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="edad"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value.toFixed(1)}m`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillReal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-real)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-real)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillPredicho" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-predicho)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-predicho)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="real"
              type="natural"
              fill="url(#fillReal)"
              stroke="var(--color-real)"
              stackId="a"
            />
            <Area
              dataKey="predicho"
              type="natural"
              fill="url(#fillPredicho)"
              stroke="var(--color-predicho)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full flex-col gap-1 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            R²: 0.95 | MSE: 169.07 <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Modelo: Support Vector Regression (kernel: RBF)
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
