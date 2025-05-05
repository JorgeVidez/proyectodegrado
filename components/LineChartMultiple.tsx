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
} satisfies ChartConfig;

// Función para convertir un número ordinal de fecha a un objeto Date de JavaScript
const ordinalToDate = (ordinal: number): Date => {
  const epoch = new Date(1900, 0, 1).getTime(); // Inicio de la época para ordinal en pandas (Python)
  const daysSinceEpoch = ordinal - 1; // Los ordinales en pandas empiezan desde 1
  const milliseconds = epoch + daysSinceEpoch * 24 * 60 * 60 * 1000;
  return new Date(milliseconds);
};

export function LinearChartMultiple() {
  const [chartData, setChartData] = useState<
    { fecha: string; datosReales: number; prediccionesSVR: number }[]
  >([]);

  useEffect(() => {
    const cargarDatos = () => {
      try {
        const datos = datosJSON;

        const fechas = datos.test_data.X_test.map((ordinal) => {
          const fechaObj = ordinalToDate(ordinal);
          return fechaObj.toLocaleDateString();
        });

        const data = fechas.map((fecha, index) => ({
          fecha: fecha,
          datosReales: datos.test_data.y_test[index],
          prediccionesSVR: datos.predictions.y_pred_svr[index],
        }));

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
              tickFormatter={(value) => value.slice(0, 5)}
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
        <div className="leading-none text-muted-foreground">2005 - 2024</div>
      </CardFooter>
    </Card>
  );
}
