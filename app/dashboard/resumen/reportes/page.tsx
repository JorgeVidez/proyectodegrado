"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ReporteInventario } from "@/components/reportes/ReporteInventario";
import ImprimirAnimalPage from "@/components/reportes/ImprimirAnimalPage";
import { Grid } from "lucide-react";
import ReportesVentasPage from "@/components/reportes/ReportesVentasPage";
import ProximosCuidadosPage from "@/components/reportes/ProximosCuidadosPage";
import HistorialAnimalPage from "@/components/reportes/HistorialAnimalPage";

export default function ReportesImpresosPage() {
  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Reportes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="p-6">
        <div className=" grid lg:grid-cols-2 sm:grid-cols-1 gap-6 mb-6 ">
          <div className="col-span-1 mb-6">
            <ReporteInventario />
          </div>
          <div className="col-span-1 mb-6">
            <ImprimirAnimalPage></ImprimirAnimalPage>
          </div>
        </div>
        <div className=" grid lg:grid-cols-2 sm:grid-cols-1 gap-6 mb-6 ">
          <div className="col-span-1 mb-6">
            <ReportesVentasPage />
          </div>
          <div className="col-span-1 mb-6"> 
            <ProximosCuidadosPage />
          </div>
        </div>
        <div className=" grid lg:grid-cols-2 sm:grid-cols-1 gap-6 mb-6 ">
          <div className="col-span-2 mb-6">
            <HistorialAnimalPage />
          </div>
          </div>

        {/* Futuros reportes se agregarán aquí */}
        {/* <ReporteProduccion /> */}
        {/* <ReporteSanidad /> */}
      </div>
    </div>
  );
}
