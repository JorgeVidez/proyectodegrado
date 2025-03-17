"use client";

import React, { useState } from "react";
import axios from "axios";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Prediccion() {
  const [precioGanadoVivo, setPrecioGanadoVivo] = useState<number>(2.5);
  const [precioCarne, setPrecioCarne] = useState<number>(4.0);
  const [datosHistoricos, setDatosHistoricos] = useState<number>(10000);
  const [precioVentaGanado, setPrecioVentaGanado] = useState<number>(3.0);
  const [publicidad, setPublicidad] = useState<number>(3000);
  const [prediccion, setPrediccion] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePrediccion = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/prediccion/ganado/",
        {
          Precio_del_Ganado_Vivo: precioGanadoVivo,
          Precio_de_la_Carne: precioCarne,
          Datos_Historicos_de_Venta: datosHistoricos,
          Precio_de_Venta_del_Ganado: precioVentaGanado,
          Publicidad: publicidad,
        }
      );
      setPrediccion(response.data.prediccion);
    } catch (error) {
      console.error("Error al hacer la predicción:", error);
      setPrediccion(null);
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
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card>
          <CardHeader>
            <CardTitle>Ingresa los Datos para la Predicción</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-2">
              <label htmlFor="precioGanadoVivo">Precio del Ganado Vivo</label>
              <Input
                type="number"
                id="precioGanadoVivo"
                value={precioGanadoVivo}
                onChange={(e) => setPrecioGanadoVivo(Number(e.target.value))}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label htmlFor="precioCarne">Precio de la Carne</label>
              <Input
                type="number"
                id="precioCarne"
                value={precioCarne}
                onChange={(e) => setPrecioCarne(Number(e.target.value))}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label htmlFor="datosHistoricos">Datos Históricos de Venta</label>
              <Input
                type="number"
                id="datosHistoricos"
                value={datosHistoricos}
                onChange={(e) => setDatosHistoricos(Number(e.target.value))}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label htmlFor="precioVentaGanado">
                Precio de Venta del Ganado
              </label>
              <Input
                type="number"
                id="precioVentaGanado"
                value={precioVentaGanado}
                onChange={(e) => setPrecioVentaGanado(Number(e.target.value))}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label htmlFor="publicidad">Publicidad</label>
              <Input
                type="number"
                id="publicidad"
                value={publicidad}
                onChange={(e) => setPublicidad(Number(e.target.value))}
              />
            </div>
            <Button onClick={handlePrediccion} disabled={loading}>
              {loading ? "Cargando..." : "Realizar Predicción"}
            </Button>
            {prediccion !== null && (
              <div className="mt-4">
                <strong>Predicción:</strong> {prediccion}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
