"use client";

import React, { useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { PiCashRegisterBold, PiCowFill, PiMoney } from "react-icons/pi";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SeccionPrediccionPrecio() {
  const [fecha, setFecha] = useState<Date>(new Date("2025-02-01"));
  const [edad, setEdad] = useState<number>(1);
  const [tipo, setTipo] = useState<string>("Vaca");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [predictionPeso, setPredictionPeso] = useState<{
    precio_predicho: number;
    confianza: number;
    modelo: string;
    precision: number;
    variables: string[];
  } | null>(null);

  const handlePrediccionPeso = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/modelo-peso/predecir-peso`,
        {
          edad: edad,
          fecha: format(fecha, "yyyy-MM-dd"),
          tipo: tipo,
        }
      );

      setPredictionPeso({
        precio_predicho: response.data.precio_predicho,
        confianza: response.data.confianza,
        modelo: response.data.metadatos.modelo,
        precision: response.data.metadatos.precision_r2,
        variables: response.data.metadatos.variables,
      });
    } catch (err) {
      setError("Error al obtener la predicción de peso. Inténtalo de nuevo.");
      console.error("Error al hacer la predicción de peso:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiMoney className="w-5 h-5" />
            Precio por kilogramo de peso
          </CardTitle>
          <CardDescription>
            Predicción del precio de venta por kilogramo de peso
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

          <div className="space-y-2">
            <Label htmlFor="edad">Edad (años)</Label>
            <Input
              id="edad"
              type="number"
              value={edad}
              onChange={(e) => setEdad(Number(e.target.value))}
              min="0"
              step="0.5"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Animal</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Toro">Toro</SelectItem>
                <SelectItem value="Novillo">Novillo</SelectItem>
                <SelectItem value="T.Buey">T.Buey</SelectItem>
                <SelectItem value="Vaca">Vaca</SelectItem>
                <SelectItem value="Torillo">Torillo</SelectItem>
                <SelectItem value="Vaquilla">Vaquilla</SelectItem>
              </SelectContent>
            </Select>
          </div>

           

          <Button
            onClick={handlePrediccionPeso}
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
          ) : predictionPeso ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Precio Predicho</h3>
                <Badge variant="outline" className="px-3 py-1">
                  {predictionPeso.modelo}
                </Badge>
              </div>

              <div className="text-4xl font-bold text-green-600 py-4">
                {predictionPeso.precio_predicho.toLocaleString(undefined, {
                  maximumFractionDigits: 1,
                })}
                <span className="text-lg text-muted-foreground ml-2">
                  Bs x Kilogramo de Peso
                </span>
              </div>

              <Separator className="my-4" />

              <div className="text-sm text-muted-foreground">
                <p>
                  Basado en los datos históricos para un animal de tipo{" "}
                  <strong>{tipo}</strong> con edad de{" "}
                  <strong>{edad} años</strong>, el modelo predice un precio de{" "}
                  {predictionPeso.precio_predicho.toLocaleString(undefined, {
                    maximumFractionDigits: 1,
                  })}{" "}
                  Bs x Kg para la fecha seleccionada.
                </p>
                {predictionPeso.precision !== null && (
                  <p className="mt-2">
                    Precisión del modelo (R²):{" "}
                    {(predictionPeso.precision * 100).toFixed(2)}%
                  </p>
                )}
                {predictionPeso.variables && (
                  <p className="mt-2">
                    Variables utilizadas: {predictionPeso.variables.join(", ")}
                  </p>
                )}
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
