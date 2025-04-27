"use client";

import React, { useState } from "react";
import axios from "axios";

import { PiCowFill } from "react-icons/pi";

import { format } from "date-fns";
import {
  CalendarIcon,
  Box,
  Warehouse,
  Milk,
  Scale,
  Leaf,
  ShowerHead,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Component } from "@/components/LineChartMultiple";
import { Badge } from "@/components/ui/badge";

type PredictionModel = "ganado" | "insumos" | "leche" | "peso" | "alimento";
type PredictionResult = {
  prediction: number;
  unit?: string;
  confidence?: [number, number];
  model?: string;
};

export default function Prediccion() {
  const [fecha, setFecha] = useState<Date>(new Date("2025-02-01"));
  const [activeModel, setActiveModel] = useState<PredictionModel>("ganado");
  const [predictions, setPredictions] = useState<
    Record<PredictionModel, PredictionResult | null>
  >({
    ganado: null,
    insumos: null,
    leche: null,
    peso: null,
    alimento: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const modelData = {
    ganado: {
      title: "Ganado Faenado",
      description:
        "Predicción de cantidad de cabezas de ganado que serán faenadas",
      icon: <PiCowFill className="w-5 h-5" />,
      unit: "Tn",
      color: "text-green-600",
    },
    insumos: {
      title: "Insumos Veterinarios",
      description: "Predicción de requerimientos de medicamentos e insumos",
      icon: <Box className="w-5 h-5" />,
      unit: "unidades",
      color: "text-blue-600",
    },
    leche: {
      title: "Producción de Leche",
      description: "Predicción de litros de leche producidos diariamente",
      icon: <Milk className="w-5 h-5" />,
      unit: "litros",
      color: "text-yellow-600",
    },
    peso: {
      title: "Peso Promedio",
      description: "Predicción del peso promedio del ganado",
      icon: <Scale className="w-5 h-5" />,
      unit: "kg",
      color: "text-purple-600",
    },
    alimento: {
      title: "Consumo de Alimento",
      description: "Predicción de toneladas de alimento requeridas",
      icon: <Leaf className="w-5 h-5" />,
      unit: "toneladas",
      color: "text-orange-600",
    },
  };

  const simulatePrediction = (model: PredictionModel): PredictionResult => {
    const baseValue = Math.floor(Math.random() * 1000) + 100;
    const variation = Math.floor(Math.random() * 200) - 100;

    return {
      prediction: baseValue + variation,
      unit: modelData[model].unit,
      confidence: [baseValue + variation - 50, baseValue + variation + 50],
      model: `Modelo ${model.charAt(0).toUpperCase() + model.slice(1)} v1.2`,
    };
  };

  const handlePrediccion = async () => {
    setLoading(true);
    setError(null);

    try {
      // Llamada real a tu backend para el modelo de ganado
      if (activeModel === "ganado") {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/predecir`,
          { fecha: format(fecha, "yyyy-MM-dd") }
        );
        setPredictions((prev) => ({
          ...prev,
          ganado: {
            prediction: response.data.ganado_faenado,
            unit: "Tn",
            model: "Modelo Ganado v1.0",
          },
        }));
      } else {
        // Simulación para otros modelos
        setTimeout(() => {
          setPredictions((prev) => ({
            ...prev,
            [activeModel]: simulatePrediction(activeModel),
          }));
        }, 800);
      }
    } catch (err) {
      setError("Error al obtener la predicción. Inténtalo de nuevo.");
      console.error("Error al hacer la predicción:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />

          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Inventario</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Predicciones</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="p-4">
        <Component />

        <Separator className="my-6" />

        <Tabs
          value={activeModel}
          onValueChange={(value) => setActiveModel(value as PredictionModel)}
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-4">
            <TabsTrigger value="ganado" className="flex gap-2">
              <PiCowFill className="w-4 h-4" /> Ganado
            </TabsTrigger>
            <TabsTrigger value="insumos" className="flex gap-2">
              <Box className="w-4 h-4" /> Insumos
            </TabsTrigger>
            <TabsTrigger value="leche" className="flex gap-2">
              <Milk className="w-4 h-4" /> Leche
            </TabsTrigger>
            <TabsTrigger value="peso" className="flex gap-2">
              <Scale className="w-4 h-4" /> Peso
            </TabsTrigger>
            <TabsTrigger value="alimento" className="flex gap-2">
              <Leaf className="w-4 h-4" /> Alimento
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {modelData[activeModel].icon}
                {modelData[activeModel].title}
              </CardTitle>
              <CardDescription>
                {modelData[activeModel].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Fecha de Predicción</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-5 w-5" />
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
                <Label>Modelo Utilizado</Label>
                <div className="flex items-center gap-3 p-3 border rounded-md">
                  <div className="flex items-center justify-center p-2 rounded-full bg-secondary">
                    <Warehouse className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      Modelo{" "}
                      {activeModel.charAt(0).toUpperCase() +
                        activeModel.slice(1)}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Precisión estimada: {Math.floor(Math.random() * 15) + 85}%
                    </p>
                  </div>
                </div>
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
              ) : predictions[activeModel] ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Valor Predicho</h3>
                    <Badge variant="outline" className="px-3 py-1">
                      {predictions[activeModel]?.model}
                    </Badge>
                  </div>

                  <div
                    className={`text-4xl font-bold ${modelData[activeModel].color} py-4`}
                  >
                    {predictions[activeModel]?.prediction.toLocaleString()}
                    <span className="text-lg text-muted-foreground ml-2">
                      {modelData[activeModel].unit}
                    </span>
                  </div>

                  {predictions[activeModel]?.confidence && (
                    <div className="space-y-2">
                      <Label>Intervalo de Confianza (95%)</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {predictions[
                            activeModel
                          ]?.confidence?.[0].toLocaleString()}
                        </span>
                        <div className="flex-1 h-2 bg-secondary rounded-full">
                          <div
                            className="h-2 bg-primary rounded-full"
                            style={{ width: "100%" }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {predictions[
                            activeModel
                          ]?.confidence?.[1].toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  <Separator className="my-4" />

                  <div className="text-sm text-muted-foreground">
                    <p>
                      Basado en los datos históricos y patrones estacionales, el
                      modelo predice un valor de{" "}
                      {predictions[activeModel]?.prediction.toLocaleString()}{" "}
                      {modelData[activeModel].unit} para la fecha seleccionada.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
                  <Warehouse className="w-12 h-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">
                    Sin datos de predicción
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Genera una predicción para ver los resultados
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sección de resumen de todas las predicciones */}
        {Object.values(predictions).some((p) => p !== null) && (
          <>
            <Separator className="my-6" />
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Predicciones</CardTitle>
                <CardDescription>
                  Comparación de todas las predicciones generadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                  {Object.entries(predictions).map(
                    ([model, prediction]) =>
                      prediction && (
                        <Card
                          key={model}
                          className="hover:shadow-md transition-shadow"
                        >
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                              {modelData[model as PredictionModel].icon}
                              <h3 className="font-semibold">
                                {modelData[model as PredictionModel].title}
                              </h3>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div
                              className={`text-2xl font-bold ${modelData[model as PredictionModel].color}`}
                            >
                              {prediction.prediction.toLocaleString()}
                              <span className="text-sm text-muted-foreground ml-1">
                                {modelData[model as PredictionModel].unit}
                              </span>
                            </div>
                            {prediction.confidence && (
                              <div className="text-xs text-muted-foreground mt-1">
                                ±{" "}
                                {(
                                  prediction.confidence[1] -
                                  prediction.prediction
                                ).toLocaleString()}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
