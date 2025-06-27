"use client";

import { useVacunaciones } from "@/hooks/useVacunaciones";
import { useTratamientosSanitarios } from "@/hooks/useTratamientosSanitarios";
import { useInventarioAnimal } from "@/hooks/useInventarioAnimal";
import { format, isAfter } from "date-fns";
import { Button } from "@/components/ui/button";
import { pdf } from "@react-pdf/renderer";
import { ReporteCuidadosPDF } from "@/components/pdf/ReporteCuidadosPDF"; // lo creamos abajo
import { Calendar, Download } from "lucide-react";

export default function ProximosCuidadosPage() {
  const { vacunaciones } = useVacunaciones();
  const { tratamientos } = useTratamientosSanitarios();
  const { inventarios } = useInventarioAnimal();

  const hoy = new Date();

  const vacunacionesPendientes = (vacunaciones || []).filter(
    (v) =>
      v.proxima_vacunacion_sugerida &&
      isAfter(new Date(v.proxima_vacunacion_sugerida), hoy)
  );

  const tratamientosPendientes = (tratamientos || []).filter(
    (t) => t.proxima_revision && isAfter(new Date(t.proxima_revision), hoy)
  );

  const handleGenerarPDF = async () => {
    const blob = await pdf(
      <ReporteCuidadosPDF
        vacunaciones={vacunacionesPendientes}
        tratamientos={tratamientosPendientes}
        inventarios={inventarios}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `proximos-cuidados-${format(new Date(), "yyyy-MM-dd")}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="">
        <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-muted-foreground" />
      <h1 className="text-xl font-bold">
        Próximas Vacunaciones y Tratamientos
      </h1>
      </div>

      <div className="mb-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Próximas Vacunaciones</h2>
          {vacunacionesPendientes.length === 0 ? (
            <p>No hay próximas vacunaciones programadas.</p>
          ) : (
            <ul className="list-disc pl-5 text-sm">
              {vacunacionesPendientes.map((v) => (
                <li key={v.vacunacion_id}>
                  Animal ID: {v.animal_id} – Próxima vacunación:{" "}
                  {format(
                    new Date(v.proxima_vacunacion_sugerida!),
                    "dd/MM/yyyy"
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">
            Próximas Revisiones de Tratamientos
          </h2>
          {tratamientosPendientes.length === 0 ? (
            <p>No hay próximas revisiones programadas.</p>
          ) : (
            <ul className="list-disc pl-5 text-sm">
              {tratamientosPendientes.map((t) => (
                <li key={t.tratamiento_id}>
                  Animal ID: {t.animal.animal_id} – Próxima revisión:{" "}
                  {format(new Date(t.proxima_revision!), "dd/MM/yyyy")}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleGenerarPDF}>
          <Download className="w-4 h-4 mr-2" />
          Exportar PDF
        </Button>
      </div>
    </div>
  );
}
