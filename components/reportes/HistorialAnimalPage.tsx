// app/animales/historial/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useInventarioAnimal } from "@/hooks/useInventarioAnimal";
import { useVacunaciones } from "@/hooks/useVacunaciones";
import { useTratamientosSanitarios } from "@/hooks/useTratamientosSanitarios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  FileText,
  MapPin,
  Hash,
} from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { HistorialAnimalPDF } from "@/components/pdf/HistorialAnimalPDF";
import { InventarioAnimalOut } from "@/types/inventarioAnimal";

const ITEMS_PER_PAGE = 5;

export default function HistorialAnimalPage() {
  const { inventarios, isLoading: loadingInventarios } = useInventarioAnimal();
  const { vacunaciones, isLoading: loadingVacunaciones } = useVacunaciones();
  const { tratamientos, isLoading: loadingTratamientos } =
    useTratamientosSanitarios();

  // Estados para filtros y paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [especieFilter, setEspecieFilter] = useState<string>("all");
  const [sexoFilter, setSexoFilter] = useState<string>("all");
  const [ubicacionFilter, setUbicacionFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Obtener opciones únicas para los filtros
  const filterOptions = useMemo(() => {
    if (!inventarios) return { especies: [], sexos: [], ubicaciones: [] };

    const especies = [
      ...new Set(
        inventarios.map((animal) => animal.animal.especie.nombre_comun)
      ),
    ];
    const sexos = [...new Set(inventarios.map((animal) => animal.animal.sexo))];
    const ubicaciones = [
      ...new Set(
        inventarios
          .map((animal) => animal.ubicacion_actual?.nombre)
          .filter(Boolean)
      ),
    ];

    return { especies, sexos, ubicaciones };
  }, [inventarios]);

  // Filtrar y paginar datos
  const filteredData = useMemo(() => {
    if (!inventarios) return [];

    return inventarios.filter((animal) => {
      const matchesSearch =
        animal.animal.numero_trazabilidad
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        animal.animal.especie.nombre_comun
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        animal.animal.animal_id.toString().includes(searchTerm) ||
        (animal.ubicacion_actual?.nombre || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesEspecie =
        especieFilter === "all" ||
        animal.animal.especie.nombre_comun === especieFilter;
      const matchesSexo =
        sexoFilter === "all" || animal.animal.sexo === sexoFilter;
      const matchesUbicacion =
        ubicacionFilter === "all" ||
        animal.ubicacion_actual?.nombre === ubicacionFilter;

      return matchesSearch && matchesEspecie && matchesSexo && matchesUbicacion;
    });
  }, [inventarios, searchTerm, especieFilter, sexoFilter, ubicacionFilter]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const handleGenerarPDF = async (animal: InventarioAnimalOut) => {
    const vacunacionesAnimal =
      vacunaciones?.filter((v) => v.animal_id === animal.animal.animal_id) ||
      [];

    const tratamientosAnimal =
      tratamientos?.filter(
        (t) => t.animal.animal_id === animal.animal.animal_id
      ) || [];

    const blob = await pdf(
      <HistorialAnimalPDF
        animal={animal}
        vacunaciones={vacunacionesAnimal}
        tratamientos={tratamientosAnimal}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `historial-animal-${animal.animal.numero_trazabilidad}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setEspecieFilter("all");
    setSexoFilter("all");
    setUbicacionFilter("all");
    setCurrentPage(1);
  };

  const isLoading =
    loadingInventarios || loadingVacunaciones || loadingTratamientos;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Historial de Animales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por ID, N° Trazabilidad, Especie o Ubicación..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select
              value={especieFilter}
              onValueChange={(value) => {
                setEspecieFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Especie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {filterOptions.especies.map((especie) => (
                  <SelectItem key={especie} value={especie}>
                    {especie}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sexoFilter}
              onValueChange={(value) => {
                setSexoFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Sexo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {filterOptions.sexos.map((sexo) => (
                  <SelectItem key={sexo} value={sexo}>
                    {sexo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={ubicacionFilter}
              onValueChange={(value) => {
                setUbicacionFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Ubicación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {filterOptions.ubicaciones.map((ubicacion) => (
                  <SelectItem key={ubicacion} value={ubicacion ?? "Sin ubicación"}>
                    {ubicacion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={resetFilters}
              title="Limpiar filtros"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Información de resultados */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Mostrando {paginatedData.length} de {filteredData.length} animales
          </span>
          {filteredData.length !== inventarios?.length && (
            <Badge variant="secondary">Filtros aplicados</Badge>
          )}
        </div>

        {/* Tabla */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">
                  <Hash className="h-4 w-4" />
                </TableHead>
                <TableHead>N° Trazabilidad</TableHead>
                <TableHead>Especie</TableHead>
                <TableHead className="w-20">Sexo</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Ubicación
                  </div>
                </TableHead>
                <TableHead className="w-24">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((animal) => (
                  <TableRow key={animal.inventario_id}>
                    <TableCell className="font-mono text-xs">
                      {animal.animal.animal_id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {animal.animal.numero_trazabilidad}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {animal.animal.especie.nombre_comun}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          animal.animal.sexo === "M" ? "default" : "secondary"
                        }
                        className="w-8 justify-center"
                      >
                        {animal.animal.sexo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {animal.ubicacion_actual?.nombre || (
                        <span className="text-muted-foreground">
                          Sin ubicación
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGenerarPDF(animal)}
                        className="h-8 w-8 p-0"
                        title="Descargar PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {filteredData.length === 0 && searchTerm
                      ? "No se encontraron animales que coincidan con la búsqueda"
                      : "No hay animales registrados"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
