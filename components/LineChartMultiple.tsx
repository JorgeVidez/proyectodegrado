"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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

import datosJSON from "../public/svr_results.json"; // Importa el archivo JSON
import { Value } from "@radix-ui/react-select";

const chartConfig = {
  datosReales: {
    label: "Datos Reales",
    color: "blue",
  },
  prediccionesSVR: {
    label: "Predicciones SVR",
    color: "red",
  },
  xAxis: {
    label: "Fecha",
    color: "black",
  },
} satisfies ChartConfig;

export function LinearChartMultiple() {
  const [chartData, setChartData] = useState<
    { fecha: string; datosReales: number; prediccionesSVR: number }[]
  >([]);

  useEffect(() => {
    const cargarDatos = () => {
      try {
        const datos = datosJSON as any; // Usamos 'any' temporalmente para evitar errores de tipo con la estructura JSON

        // Ahora X_test ya contiene strings de fecha, no ordinales
        const fechas = datos.test_data.X_test as string[]; // Aseguramos que son strings

        const data = fechas.map((fecha, index) => ({
          fecha: fecha, // Usamos el string de fecha directamente
          datosReales: datos.test_data.y_test[index],
          prediccionesSVR: datos.predictions.y_pred_svr[index],
        }));

        data.sort(
          (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        );


        setChartData(data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    cargarDatos();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Predicciones vs. Datos Reales</CardTitle>
        <CardDescription>Ganado faeneado vs. Fecha</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="fecha"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) =>
                value.split("-")[0] + "/" + value.split("-")[1]
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="datosReales"
              type="natural"
              stroke="blue"
              strokeWidth={2}
              dot={{
                fill: "blue",
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="prediccionesSVR"
              type="natural"
              stroke="red"
              strokeWidth={2}
              dot={{
                fill: "red",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Predicciones de Ganado Faeneado <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">2005 - 2025</div>
      </CardFooter>
    </Card>
  );
}
