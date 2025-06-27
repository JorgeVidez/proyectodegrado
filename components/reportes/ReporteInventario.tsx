"use client";

import { useState, useEffect, useRef } from "react";
import { InventarioAnimalOut } from "@/types/inventarioAnimal";
import { useInventarioAnimal } from "@/hooks/useInventarioAnimal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ReporteInventarioPDF } from "@/components/pdf/ReporteInventarioPDF";
import { pdf } from "@react-pdf/renderer";
import { EstadoAnimal } from "@/types/animal";

export const ReporteInventario = () => {
  const { inventarios, isLoading, error } = useInventarioAnimal();
  const [filteredInventarios, setFilteredInventarios] = useState<
    InventarioAnimalOut[]
  >([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showDetails, setShowDetails] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    if (inventarios.length > 0) {
      applyDateFilters();
    }
  }, [inventarios, startDate, endDate]);

  const applyDateFilters = () => {
    let result = [...inventarios];

    if (startDate) {
      result = result.filter((item) => {
        const itemDate = new Date(item.fecha_ingreso);
        return itemDate >= startDate;
      });
    }

    if (endDate) {
      result = result.filter((item) => {
        const itemDate = new Date(item.fecha_ingreso);
        return itemDate <= endDate;
      });
    }

    setFilteredInventarios(result);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setFilteredInventarios([...inventarios]);
    setCurrentPage(1);
  };

  const toggleDetails = (index: number) => {
    setShowDetails(showDetails === index ? null : index);
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const blob = await pdf(
        <ReporteInventarioPDF
          data={filteredInventarios}
          startDate={startDate}
          endDate={endDate}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `reporte-inventario-${format(new Date(), "yyyy-MM-dd")}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error al generar PDF:", err);
      alert("Error al generar el PDF.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Paginación
  const totalPages = Math.ceil(filteredInventarios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredInventarios.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-6 w-6 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Inventario Animal</h2>
        </div>

        <Button
          onClick={generatePDF}
          disabled={
            isLoading || filteredInventarios.length === 0 || isGeneratingPDF
          }
          size="sm"
        >
          <Download className="mr-2 h-4 w-4" />
          {isGeneratingPDF ? "Generando..." : "PDF"}
        </Button>
      </div>

      {/* Filtros compactos */}
      <div className=" p-3 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "dd/MM/yy") : "Inicio"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "dd/MM/yy") : "Fin"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button onClick={applyDateFilters} size="sm">
            Filtrar
          </Button>
          <Button variant="outline" onClick={handleClearFilters} size="sm">
            Limpiar
          </Button>
        </div>
      </div>

      {/* Resumen compacto */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>{filteredInventarios.length} registros</span>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="text-xs">
              {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>

      {/* Tabla compacta */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Animal</TableHead>
              <TableHead className="hidden sm:table-cell">Ingreso</TableHead>
              <TableHead className="w-20">Estado</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  Cargando...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-red-500 py-8"
                >
                  Error: {error}
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  Sin registros
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <>
                  <TableRow key={item.inventario_id} className="text-sm">
                    <TableCell className="font-mono text-xs">
                      {item.animal_id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium truncate">
                          {item.animal.numero_trazabilidad}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {item.animal.especie.nombre_comun} •{" "}
                          {item.animal.raza.nombre_raza}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="text-xs">
                        <div>
                          {format(new Date(item.fecha_ingreso), "dd/MM/yy")}
                        </div>
                        <div className="text-gray-500 truncate">
                          {item.motivo_ingreso}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.animal.estado_actual === EstadoAnimal.Activo
                            ? "default"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {item.animal.estado_actual === EstadoAnimal.Activo
                          ? "Activo"
                          : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDetails(startIndex + index)}
                        className="h-8 w-8 p-0"
                      >
                        {showDetails === startIndex + index ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {showDetails === startIndex + index && (
                    <TableRow>
                      <TableCell colSpan={5} className=" p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div className="space-y-1">
                            <h4 className="font-medium  ">Identificación</h4>
                            <p>
                              <span>ID:</span> {item.animal_id}
                            </p>
                            <p>
                              <span>Nombre:</span>{" "}
                              {item.animal.nombre_identificatorio || "-"}
                            </p>
                            <p>
                              <span>Trazabilidad:</span>{" "}
                              {item.animal.numero_trazabilidad}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-medium  ">Ingreso/Egreso</h4>
                            <p>
                              <span className=" ">Fecha ingreso:</span>{" "}
                              {format(
                                new Date(item.fecha_ingreso),
                                "dd/MM/yyyy"
                              )}
                            </p>
                            <p>
                              <span className=" ">Motivo:</span>{" "}
                              {item.motivo_ingreso}
                            </p>
                            {item.precio_compra && (
                              <p>
                                <span className=" ">Precio:</span> $
                                {item.precio_compra}
                              </p>
                            )}
                            {item.fecha_egreso && (
                              <p>
                                <span className=" ">Egreso:</span>{" "}
                                {format(
                                  new Date(item.fecha_egreso),
                                  "dd/MM/yyyy"
                                )}
                              </p>
                            )}
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-medium  ">Ubicación</h4>
                            <p>
                              <span className=" ">Lote:</span>{" "}
                              {item.lote_actual?.codigo_lote || "-"}
                            </p>
                            <p>
                              <span className=" ">Área:</span>{" "}
                              {item.ubicacion_actual?.nombre || "-"}
                            </p>
                            <p>
                              <span>Estado:</span> {item.animal.estado_actual}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
