"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useVentas } from "@/hooks/useVentas";
import { useInventarioAnimal } from "@/hooks/useInventarioAnimal";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  Download,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { pdf } from "@react-pdf/renderer";
import { ReporteVentasPDF } from "@/components/pdf/ReporteVentasPDF";

export default function ReportesVentasPage() {
  const { ventas, isLoading } = useVentas();
  const { inventarios } = useInventarioAnimal();

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [filteredVentas, setFilteredVentas] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!ventas) return;

    let filtradas = ventas;

    if (startDate) {
      filtradas = filtradas.filter((v) => new Date(v.fecha_venta) >= startDate);
    }

    if (endDate) {
      filtradas = filtradas.filter((v) => new Date(v.fecha_venta) <= endDate);
    }

    setFilteredVentas(filtradas);
    setCurrentPage(1);
  }, [ventas, startDate, endDate]);

  const totalPages = Math.ceil(filteredVentas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVentas = filteredVentas.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleGenerarPDF = async () => {
    if (!filteredVentas.length) return alert("No hay ventas para exportar.");

    const blob = await pdf(
      <ReporteVentasPDF
        ventas={filteredVentas ?? []}
        startDate={startDate}
        endDate={endDate}
        inventarios={inventarios}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reporte-ventas-${format(new Date(), "yyyy-MM-dd")}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className=" w-full">
        <div className="flex items-center gap-3 mb-4"> 
            <ShoppingCart className="h-6 w-6 text-muted-foreground" />

      <h1 className="text-xl font-semibold">Reporte de Ventas</h1>
      </div>

      {/* Filtros compactos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "justify-start text-xs",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-1 h-3 w-3" />
              {startDate ? format(startDate, "dd/MM/yy") : "Fecha inicio"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              selected={startDate}
              onSelect={setStartDate}
              mode="single"
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "justify-start text-xs",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-1 h-3 w-3" />
              {endDate ? format(endDate, "dd/MM/yy") : "Fecha final"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar selected={endDate} onSelect={setEndDate} mode="single" />
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => {
            setStartDate(undefined);
            setEndDate(undefined);
          }}
        >
          Limpiar
        </Button>
      </div>

      {/* Contenido principal */}
      {isLoading ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          Cargando ventas...
        </div>
      ) : filteredVentas.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No hay ventas en el período seleccionado.
        </div>
      ) : (
        <>
          {/* Tabla compacta */}
          <div className="border rounded-md mb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-2 py-2 text-left font-medium">Fecha</th>
                    <th className="px-2 py-2 text-left font-medium">Cliente</th>
                    <th className="px-2 py-2 text-left font-medium">Lote</th>
                    <th className="px-2 py-2 text-center font-medium">Cant.</th>
                    <th className="px-2 py-2 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedVentas.map((venta, index) => (
                    <tr
                      key={venta.venta_id}
                      className={
                        index % 2 === 0 ? "bg-background" : "bg-muted/20"
                      }
                    >
                      <td className="px-2 py-2">
                        {format(new Date(venta.fecha_venta), "dd/MM/yy")}
                      </td>
                      <td className="px-2 py-2 truncate max-w-24">
                        {venta.cliente?.nombre || "—"}
                      </td>
                      <td className="px-2 py-2 truncate max-w-20">
                        {venta.lote_origen?.codigo_lote || "—"}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {venta.detalles?.length || 0}
                      </td>
                      <td className="px-2 py-2 text-right font-mono">
                        $
                        {(
                          venta.precio_venta_total_general || 0
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginación y controles */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {filteredVentas.length} ventas total
            </div>

            <div className="flex items-center gap-2">
              {totalPages > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <span className="text-xs px-2">
                    {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </>
              )}

              <Button
                size="sm"
                onClick={handleGenerarPDF}
                disabled={filteredVentas.length === 0}
                className="ml-2"
              >
                <Download className="w-3 h-3 mr-1" />
                PDF
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
