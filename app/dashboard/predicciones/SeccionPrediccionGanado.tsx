"use client";

import React, { useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { PiCowFill } from "react-icons/pi";
import { Calendar1Icon, Warehouse } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export default function SeccionPrediccionGanado() {
  const [fecha, setFecha] = useState<Date>(new Date("2025-02-01"));
  const [prediction, setPrediction] = useState<{
    prediction: number;
    unit: string;
    model: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePrediccion = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/predecir`,
        { fecha: format(fecha, "yyyy-MM-dd") }
      );

      setPrediction({
        prediction: response.data.ganado_faenado,
        unit: "Tn",
        model: "Modelo Ganado v1.0",
      });
    } catch (err) {
      setError("Error al obtener la predicción. Inténtalo de nuevo.");
      console.error("Error al hacer la predicción:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiCowFill className="w-5 h-5" />
            Ganado Faenado
          </CardTitle>
          <CardDescription>
            Predicción de cantidad de cabezas de ganado que serán faenadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Fecha de Predicción</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar1Icon className="mr-2 h-5 w-5" />
                  {format(fecha, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={fecha}
                  onSelect={(day) => setFecha(day ?? new Date())}
                  disabled={(date) => date < new Date("2020-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

           

          <Button
            onClick={handlePrediccion}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Calculando..." : "Generar Predicción"}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultados</CardTitle>
          <CardDescription>
            Predicción para {format(fecha, "PPP")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : prediction ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Valor Predicho</h3>
                <Badge variant="outline" className="px-3 py-1">
                  {prediction.model}
                </Badge>
              </div>

              <div className="text-4xl font-bold text-green-600 py-4">
                {prediction.prediction.toLocaleString()}
                <span className="text-lg text-muted-foreground ml-2">
                  {prediction.unit}
                </span>
              </div>

              <Separator className="my-4" />

              <div className="text-sm text-muted-foreground">
                <p>
                  Basado en los datos históricos y patrones estacionales, el
                  modelo predice un valor de{" "}
                  {prediction.prediction.toLocaleString()} {prediction.unit}{" "}
                  para la fecha seleccionada.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
              <Warehouse className="w-12 h-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">Sin datos de predicción</h3>
              <p className="text-sm text-muted-foreground">
                Genera una predicción para ver los resultados
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
