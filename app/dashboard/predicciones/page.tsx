"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LinearChartMultiple } from "@/components/LineChartMultiple";
import ModelVisualization3D from "@/components/ModelVisualization";
import SeccionPrediccionGanado from "./SeccionPrediccionGanado";
import SeccionPrediccionPrecio from "./SeccionPrediccionPrecio";

// Importamos los datos del modelo
import modeldata from "../../../public/model_data.json";
import { AreaChart } from "lucide-react"; 
import { AreaChartGradient } from '../../../components/AreaChartGradient';
import SeccionPrediccionPesoAnimal from "./SeccionPrediccionPesoAnimal";

export default function Prediccion() {
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
        <div className="mb-4">
          <LinearChartMultiple />
        </div>

        {/* Componente de predicción de ganado faenado */}
        <SeccionPrediccionGanado />

        <div className="my-4">
          <ModelVisualization3D modelData={modeldata} />
        </div>

        {/* Componente de predicción de precio por kilogramo */}
        <SeccionPrediccionPrecio />

        <div className="my-4">
          <AreaChartGradient></AreaChartGradient>
        </div>

        <SeccionPrediccionPesoAnimal></SeccionPrediccionPesoAnimal>
      </div>
    </div>
  );
}
//     
