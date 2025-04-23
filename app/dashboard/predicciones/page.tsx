"use client";

import React, { useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Component } from "@/components/LineChartMultiple";

export default function Prediccion() {
  const [fecha, setFecha] = useState<Date>(new Date("2025-02-01"));
  const [prediccion, setPrediccion] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePrediccion = async () => {
    setLoading(true);
    setError(null);
    setPrediccion(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/predict`,
        { date: format(fecha, "yyyy-MM-dd") }
      );
      console.log("Predicción:", response.data);
      setPrediccion(response.data.prediction);
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
                <BreadcrumbPage>Predicción de Ganado</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className=" p-4">
        <Component />
        <Separator className=" w-full m-4" />
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Selecciona una Fecha</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex flex-col gap-2">
              <Label>Fecha (YYYY-MM-DD)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {format(fecha, "yyyy-MM-dd")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fecha}
                    onSelect={(day) => setFecha(day ?? new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button onClick={handlePrediccion} disabled={loading}>
              {loading ? "Cargando..." : "Realizar Predicción"}
            </Button>
            {loading && (
              <Skeleton className="h-10 w-full rounded-md bg-gray-200" />
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {prediccion !== null && (
              <div className="text-center text-lg font-semibold">
                Predicción de Ganado Faenado:{" "}
                <span className="text-green-600">{prediccion}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
