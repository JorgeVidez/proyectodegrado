"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer"; 
import { useAnimales } from "@/hooks/useAnimales";
import { useMovimientosAnimal } from "@/hooks/useMovimientosAnimal";
import { useControlesSanitarios } from "@/hooks/useControlesSanitarios";
import { useVacunaciones } from "@/hooks/useVacunaciones";
import { useTratamientosSanitarios } from "@/hooks/useTratamientosSanitarios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimalCombobox } from "../AnimalCombobox";
import { FileText, Download } from "lucide-react";
import { EstadoAnimal } from "@/types/animal";
import { DetalleAnimalPDF } from "../pdf/DetalleAnimalPDF";

export default function ImprimirAnimalPage() {
  const [selectedAnimalId, setSelectedAnimalId] = useState<
    number | undefined
  >();
  const [isGenerating, setIsGenerating] = useState(false);
  const { animales } = useAnimales();
  const { movimientos } = useMovimientosAnimal();
  const { controles } = useControlesSanitarios();
  const { vacunaciones } = useVacunaciones();
  const { tratamientos } = useTratamientosSanitarios();

  const selectedAnimal = animales?.find(
    (a) => a.animal_id === selectedAnimalId
  );

  const handleGenerarFicha = async () => {
    if (!selectedAnimalId) return alert("Por favor seleccione un animal");

    const animal = animales?.find((a) => a.animal_id === selectedAnimalId);
    if (!animal) return alert("Animal no encontrado");

    setIsGenerating(true);

    const movimientosFiltrados =
      movimientos?.filter((m) => m.animal_id === selectedAnimalId) || [];
    const controlesFiltrados =
      controles?.filter((c) => c.animal.animal_id === selectedAnimalId) || [];
    const vacunacionesFiltradas =
      vacunaciones?.filter((v) => v.animal_id === selectedAnimalId) || [];
    const tratamientosFiltrados =
      tratamientos?.filter((t) => t.animal.animal_id === selectedAnimalId) ||
      [];

    try {
      const blob = await pdf(
        <DetalleAnimalPDF
          animal={animal}
          movimientos={movimientosFiltrados}
          controles={controlesFiltrados}
          vacunaciones={vacunacionesFiltradas}
          tratamientos={tratamientosFiltrados}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ficha-animal-${animal.numero_trazabilidad || animal.animal_id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Ocurrió un error al generar el PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className=" w-full space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-xl font-semibold">Ficha Animal</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Generar Reporte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Seleccionar Animal</Label>
            <AnimalCombobox
              label="animal"
              value={selectedAnimalId}
              onChange={setSelectedAnimalId}
            />
          </div>

          {selectedAnimal && (
            <div className="p-3 border rounded-lg bg-muted/30">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">ID:</span>
                  <span className="ml-1 font-mono">
                    {selectedAnimal.animal_id}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Trazabilidad:</span>
                  <span className="ml-1 font-mono">
                    {selectedAnimal.numero_trazabilidad}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Especie:</span>
                  <span className="ml-1">
                    {selectedAnimal.especie.nombre_comun}
                  </span>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <span>{selectedAnimal.raza.nombre_raza}</span>
                </div>
                {selectedAnimal.nombre_identificatorio && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Nombre:</span>
                    <span className="ml-1">
                      {selectedAnimal.nombre_identificatorio}
                    </span>
                  </div>
                )}
                <div className="col-span-2 flex gap-2 mt-2">
                  <Badge
                    variant={
                      selectedAnimal.estado_actual === EstadoAnimal.Activo
                        ? "default"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {selectedAnimal.estado_actual}
                  </Badge>
                  {selectedAnimal.sexo && (
                    <Badge variant="outline" className="text-xs">
                      {selectedAnimal.sexo}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleGenerarFicha}
              disabled={!selectedAnimalId || isGenerating}
              className="w-full sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Generando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generar PDF
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
