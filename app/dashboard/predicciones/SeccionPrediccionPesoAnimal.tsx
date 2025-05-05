"use client";

import React, { useState } from "react";
import axios from "axios";
import { addMonths, format, subMonths } from "date-fns";
import { Scale, Wand2Icon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

export default function SeccionPrediccionPesoAnimal() {
  const [edadMeses, setEdadMeses] = useState<number>(12);
  const [prediction, setPrediction] = useState<{
    peso: number;
    edad: number;
    modelo: string;
    r2: number;
    mse: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fechaControl = new Date();
  const fechaNacimiento = subMonths(fechaControl, edadMeses);

  const handlePrediccion = async () => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/svr-peso-edad/predecir`,
        {
          fecha_nacimiento: format(fechaNacimiento, "yyyy-MM-dd"),
          fecha_control: format(fechaControl, "yyyy-MM-dd"),
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      setPrediction({
        peso: data.peso_predicho,
        edad: data.edad_meses,
        modelo: data.metadatos.modelo,
        r2: data.metadatos.precision_r2,
        mse: data.metadatos.error_mse,
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ??
        "Error al obtener la predicción. Inténtalo de nuevo.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Formulario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5" />
            Predicción de Peso Animal
          </CardTitle>
          <CardDescription>
            Estima el peso de un animal según su edad (0 a 36 meses)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Edad del Animal (meses): {edadMeses} meses</Label>
            <Slider
              defaultValue={[edadMeses]}
              max={36}
              min={0}
              step={1}
              onValueChange={(value) => setEdadMeses(value[0])}
            />
          </div>

          <Button
            onClick={handlePrediccion}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Calculando..." : "Predecir Peso"}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Resultados */}
      <Card>
        <CardHeader>
          <CardTitle>Resultado de la Predicción</CardTitle>
          <CardDescription>
            Para {edadMeses} meses ({format(fechaNacimiento, "PPP")} a hoy)
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
                <h3 className="text-lg font-semibold">Peso Estimado</h3>
                <Badge variant="outline" className="px-3 py-1">
                  {prediction.modelo}
                </Badge>
              </div>

              <div className="text-4xl font-bold text-green-600 py-4">
                {prediction.peso.toFixed(2)}
                <span className="text-lg text-muted-foreground ml-2">kg</span>
              </div>

              <Separator className="my-4" />

              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  Edad calculada: <strong>{prediction.edad} meses</strong>
                </p>
                <p>
                  Precisión del modelo (R²):{" "}
                  <strong>{(prediction.r2 * 100).toFixed(2)}%</strong>
                </p>
                <p>
                  Error cuadrático medio (MSE):{" "}
                  <strong>{prediction.mse.toFixed(2)}</strong>
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
              <Wand2Icon className="w-12 h-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">Sin predicción aún</h3>
              <p className="text-sm text-muted-foreground">
                Selecciona una edad y genera la predicción
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
