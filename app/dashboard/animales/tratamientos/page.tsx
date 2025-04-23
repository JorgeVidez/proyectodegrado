"use client";

import {
  useTratamientosSanitarios,
  TratamientoSanitario,
  TratamientoSanitarioBase,
  deleteTratamientoSanitario,
  updateTratamientoSanitario,
  createTratamientoSanitario,
} from "@/hooks/useTratamientosSanitarios";
import { useEffect, useState } from "react";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Pencil, Trash2 } from "lucide-react";

export default function ListaTratamientosSanitarios() {
  const { tratamientos, isLoading, isError, refresh } =
    useTratamientosSanitarios();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTratamiento, setSelectedTratamiento] =
    useState<TratamientoSanitario | null>(null);

  const [newAnimalId, setNewAnimalId] = useState<number>(0);
  const [newFechaDiagnostico, setNewFechaDiagnostico] = useState<string>("");
  const [newSintomasObservados, setNewSintomasObservados] = useState<
    string | undefined
  >(undefined);
  const [newDiagnostico, setNewDiagnostico] = useState<string | undefined>(
    undefined
  );
  const [newFechaInicioTratamiento, setNewFechaInicioTratamiento] = useState<
    string | undefined
  >(undefined);
  const [newMedicamentoId, setNewMedicamentoId] = useState<number | undefined>(
    undefined
  );
  const [newDosisAplicada, setNewDosisAplicada] = useState<number | undefined>(
    undefined
  );
  const [newUnidadDosis, setNewUnidadDosis] = useState<string | undefined>(
    undefined
  );
  const [newViaAdministracion, setNewViaAdministracion] = useState<
    string | undefined
  >(undefined);
  const [newDuracionTratamientoDias, setNewDuracionTratamientoDias] = useState<
    number | undefined
  >(undefined);
  const [newFechaFinTratamiento, setNewFechaFinTratamiento] = useState<
    string | undefined
  >(undefined);
  const [newProveedorMedicamentoId, setNewProveedorMedicamentoId] = useState<
    number | undefined
  >(undefined);
  const [newResponsableVeterinarioId, setNewResponsableVeterinarioId] =
    useState<number | undefined>(undefined);
  const [newPeriodoRetiroAplicableDias, setNewPeriodoRetiroAplicableDias] =
    useState<number | undefined>(undefined);
  const [newFechaFinRetiro, setNewFechaFinRetiro] = useState<
    string | undefined
  >(undefined);
  const [newProximaRevision, setNewProximaRevision] = useState<
    string | undefined
  >(undefined);
  const [newResultadoTratamiento, setNewResultadoTratamiento] = useState<
    string | undefined
  >(undefined);
  const [newObservaciones, setNewObservaciones] = useState<string | undefined>(
    undefined
  );

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if (isError) console.error(isError);
  }, [isError]);

  const handleCreateTratamiento = async () => {
    const newTratamiento: TratamientoSanitarioBase = {
      animal_id: newAnimalId,
      fecha_diagnostico: newFechaDiagnostico,
      sintomas_observados: newSintomasObservados,
      diagnostico: newDiagnostico,
      fecha_inicio_tratamiento: newFechaInicioTratamiento,
      medicamento_id: newMedicamentoId,
      dosis_aplicada: newDosisAplicada,
      unidad_dosis: newUnidadDosis,
      via_administracion: newViaAdministracion,
      duracion_tratamiento_dias: newDuracionTratamientoDias,
      fecha_fin_tratamiento: newFechaFinTratamiento,
      proveedor_medicamento_id: newProveedorMedicamentoId,
      responsable_veterinario_id: newResponsableVeterinarioId,
      periodo_retiro_aplicable_dias: newPeriodoRetiroAplicableDias,
      fecha_fin_retiro: newFechaFinRetiro,
      proxima_revision: newProximaRevision,
      resultado_tratamiento: newResultadoTratamiento,
      observaciones: newObservaciones,
    };
    try {
      await createTratamientoSanitario(newTratamiento);
      setAlertMessage("Tratamiento sanitario creado con éxito.");
      setAlertType("success");
      setIsCreateDialogOpen(false);
      refresh();
    } catch (err) {
      setAlertMessage("Error al crear el tratamiento sanitario.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const handleEditTratamiento = (tratamiento: TratamientoSanitario) => {
    setSelectedTratamiento(tratamiento);
    setNewAnimalId(tratamiento.animal_id);
    setNewFechaDiagnostico(tratamiento.fecha_diagnostico);
    setNewSintomasObservados(tratamiento.sintomas_observados);
    setNewDiagnostico(tratamiento.diagnostico);
    setNewFechaInicioTratamiento(tratamiento.fecha_inicio_tratamiento);
    setNewMedicamentoId(tratamiento.medicamento_id);
    setNewDosisAplicada(tratamiento.dosis_aplicada);
    setNewUnidadDosis(tratamiento.unidad_dosis);
    setNewViaAdministracion(tratamiento.via_administracion);
    setNewDuracionTratamientoDias(tratamiento.duracion_tratamiento_dias);
    setNewFechaFinTratamiento(tratamiento.fecha_fin_tratamiento);
    setNewProveedorMedicamentoId(tratamiento.proveedor_medicamento_id);
    setNewResponsableVeterinarioId(tratamiento.responsable_veterinario_id);
    setNewPeriodoRetiroAplicableDias(tratamiento.periodo_retiro_aplicable_dias);
    setNewFechaFinRetiro(tratamiento.fecha_fin_retiro);
    setNewProximaRevision(tratamiento.proxima_revision);
    setNewResultadoTratamiento(tratamiento.resultado_tratamiento);
    setNewObservaciones(tratamiento.observaciones);
    setIsEditDialogOpen(true);
  };

  const handleUpdateTratamiento = async () => {
    if (selectedTratamiento) {
      const updatedTratamiento: Partial<TratamientoSanitarioBase> = {
        animal_id: newAnimalId,
        fecha_diagnostico: newFechaDiagnostico,
        sintomas_observados: newSintomasObservados,
        diagnostico: newDiagnostico,
        fecha_inicio_tratamiento: newFechaInicioTratamiento,
        medicamento_id: newMedicamentoId,
        dosis_aplicada: newDosisAplicada,
        unidad_dosis: newUnidadDosis,
        via_administracion: newViaAdministracion,
        duracion_tratamiento_dias: newDuracionTratamientoDias,
        fecha_fin_tratamiento: newFechaFinTratamiento,
        proveedor_medicamento_id: newProveedorMedicamentoId,
        responsable_veterinario_id: newResponsableVeterinarioId,
        periodo_retiro_aplicable_dias: newPeriodoRetiroAplicableDias,
        fecha_fin_retiro: newFechaFinRetiro,
        proxima_revision: newProximaRevision,
        resultado_tratamiento: newResultadoTratamiento,
        observaciones: newObservaciones,
      };
      try {
        await updateTratamientoSanitario(
          selectedTratamiento.tratamiento_id,
          updatedTratamiento
        );
        setAlertMessage("Tratamiento sanitario actualizado con éxito.");
        setAlertType("success");
        setIsEditDialogOpen(false);
        refresh();
      } catch (err) {
        setAlertMessage("Error al actualizar el tratamiento sanitario.");
        setAlertType("error");
      }
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
    }
  };

  const handleDeleteTratamiento = async (tratamientoId: number) => {
    try {
      await deleteTratamientoSanitario(tratamientoId);
      setAlertMessage("Tratamiento sanitario eliminado con éxito.");
      setAlertType("success");
      refresh();
    } catch (err) {
      setAlertMessage("Error al eliminar el tratamiento sanitario.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar tratamientos sanitarios</div>;

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* ... (Breadcrumb, Header, Alert, etc. - similar a ListaInventarioAnimales) */}
      <div>
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Lista de Tratamientos Sanitarios
          </h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Crear Nuevo Tratamiento Sanitario
          </Button>
        </header>
        <Separator className="my-4" />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Animal ID</TableHead>
              <TableHead>Fecha Diagnóstico</TableHead>
              <TableHead>Síntomas Observados</TableHead>
              <TableHead>Diagnóstico</TableHead>
              <TableHead>Fecha Inicio Tratamiento</TableHead>
              <TableHead>Medicamento ID</TableHead>
              <TableHead>Dosis Aplicada</TableHead>
              <TableHead>Unidad Dosis</TableHead>
              <TableHead>Vía Administración</TableHead>
              <TableHead>Duración Tratamiento (días)</TableHead>
              <TableHead>Fecha Fin Tratamiento</TableHead>
              <TableHead>Proveedor Medicamento ID</TableHead>
              <TableHead>Responsable Veterinario ID</TableHead>
              <TableHead>Periodo Retiro (días)</TableHead>
              <TableHead>Fecha Fin Retiro</TableHead>
              <TableHead>Próxima Revisión</TableHead>
              <TableHead>Resultado Tratamiento</TableHead>
              <TableHead>Observaciones</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tratamientos?.map((t) => (
              <TableRow key={t.tratamiento_id}>
                <TableCell className="font-medium">{t.animal_id}</TableCell>
                <TableCell className="">{t.fecha_diagnostico}</TableCell>
                <TableCell className="">{t.sintomas_observados}</TableCell>
                <TableCell className="">{t.diagnostico}</TableCell>
                <TableCell className="">{t.fecha_inicio_tratamiento}</TableCell>
                <TableCell className="">{t.medicamento_id}</TableCell>
                <TableCell className="">{t.dosis_aplicada}</TableCell>
                <TableCell className="">{t.unidad_dosis}</TableCell>
                <TableCell className="">{t.via_administracion}</TableCell>
                <TableCell className="">
                  {t.duracion_tratamiento_dias}
                </TableCell>
                <TableCell className="">{t.fecha_fin_tratamiento}</TableCell>
                <TableCell className="">{t.proveedor_medicamento_id}</TableCell>
                <TableCell className="">
                  {t.responsable_veterinario_id}
                </TableCell>
                <TableCell className="">
                  {t.periodo_retiro_aplicable_dias}
                </TableCell>
                <TableCell className="">{t.fecha_fin_retiro}</TableCell>
                <TableCell className="">{t.proxima_revision}</TableCell>
                <TableCell className="">{t.resultado_tratamiento}</TableCell>
                <TableCell className="">{t.observaciones}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditTratamiento(t)}
                  >
                    <Pencil></Pencil>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteTratamiento(t.tratamiento_id)}
                  >
                    <Trash2></Trash2>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Tratamiento Sanitario</DialogTitle>
            <DialogDescription>
              Ingresa los detalles del nuevo tratamiento sanitario.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* ... (Inputs para todos los campos, similar a los dialogos anteriores) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="animalId" className="text-right">
                Animal ID
              </Label>
              <Input
                id="animalId"
                value={newAnimalId.toString()}
                onChange={(e) => setNewAnimalId(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaDiagnostico" className="text-right">
                Fecha Diagnóstico
              </Label>
              <Input
                id="fechaDiagnostico"
                value={newFechaDiagnostico}
                onChange={(e) => setNewFechaDiagnostico(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sintomasObservados" className="text-right">
                Síntomas Observados
              </Label>
              <Input
                id="sintomasObservados"
                value={newSintomasObservados || ""}
                onChange={(e) => setNewSintomasObservados(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="diagnostico" className="text-right">
                Diagnóstico
              </Label>
              <Input
                id="diagnostico"
                value={newDiagnostico || ""}
                onChange={(e) => setNewDiagnostico(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaInicioTratamiento" className="text-right">
                Fecha Inicio Tratamiento
              </Label>
              <Input
                id="fechaInicioTratamiento"
                value={newFechaInicioTratamiento || ""}
                onChange={(e) => setNewFechaInicioTratamiento(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="medicamentoId" className="text-right">
                Medicamento ID
              </Label>
              <Input
                id="medicamentoId"
                value={newMedicamentoId?.toString() || ""}
                onChange={(e) =>
                  setNewMedicamentoId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dosisAplicada" className="text-right">
                Dosis Aplicada
              </Label>
              <Input
                id="dosisAplicada"
                value={newDosisAplicada?.toString() || ""}
                onChange={(e) =>
                  setNewDosisAplicada(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unidadDosis" className="text-right">
                Unidad Dosis
              </Label>
              <Input
                id="unidadDosis"
                value={newUnidadDosis || ""}
                onChange={(e) => setNewUnidadDosis(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="viaAdministracion" className="text-right">
                Vía Administración
              </Label>
              <Input
                id="viaAdministracion"
                value={newViaAdministracion || ""}
                onChange={(e) => setNewViaAdministracion(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duracionTratamientoDias" className="text-right">
                Duración Tratamiento (días)
              </Label>
              <Input
                id="duracionTratamientoDias"
                value={newDuracionTratamientoDias?.toString() || ""}
                onChange={(e) =>
                  setNewDuracionTratamientoDias(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaFinTratamiento" className="text-right">
                Fecha Fin Tratamiento
              </Label>
              <Input
                id="fechaFinTratamiento"
                value={newFechaFinTratamiento || ""}
                onChange={(e) => setNewFechaFinTratamiento(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proveedorMedicamentoId" className="text-right">
                Proveedor Medicamento ID
              </Label>
              <Input
                id="proveedorMedicamentoId"
                value={newProveedorMedicamentoId?.toString() || ""}
                onChange={(e) =>
                  setNewProveedorMedicamentoId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsableVeterinarioId" className="text-right">
                Responsable Veterinario ID
              </Label>
              <Input
                id="responsableVeterinarioId"
                value={newResponsableVeterinarioId?.toString() || ""}
                onChange={(e) =>
                  setNewResponsableVeterinarioId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="periodoRetiroAplicableDias"
                className="text-right"
              >
                Periodo Retiro (días)
              </Label>
              <Input
                id="periodoRetiroAplicableDias"
                value={newPeriodoRetiroAplicableDias?.toString() || ""}
                onChange={(e) =>
                  setNewPeriodoRetiroAplicableDias(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaFinRetiro" className="text-right">
                Fecha Fin Retiro
              </Label>
              <Input
                id="fechaFinRetiro"
                value={newFechaFinRetiro || ""}
                onChange={(e) => setNewFechaFinRetiro(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proximaRevision" className="text-right">
                Próxima Revisión
              </Label>
              <Input
                id="proximaRevision"
                value={newProximaRevision || ""}
                onChange={(e) => setNewProximaRevision(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resultadoTratamiento" className="text-right">
                Resultado Tratamiento
              </Label>
              <Input
                id="resultadoTratamiento"
                value={newResultadoTratamiento || ""}
                onChange={(e) => setNewResultadoTratamiento(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="observaciones" className="text-right">
                Observaciones
              </Label>
              <Input
                id="observaciones"
                value={newObservaciones || ""}
                onChange={(e) => setNewObservaciones(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateTratamiento}>
              Crear Tratamiento Sanitario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Tratamiento Sanitario</DialogTitle>
            <DialogDescription>
              Edita los detalles del tratamiento sanitario.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* ... (Inputs para editar los campos, similar al diálogo de creación) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="animalId" className="text-right">
                Animal ID
              </Label>
              <Input
                id="animalId"
                value={newAnimalId.toString()}
                onChange={(e) => setNewAnimalId(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaDiagnostico" className="text-right">
                Fecha Diagnóstico
              </Label>
              <Input
                id="fechaDiagnostico"
                value={newFechaDiagnostico}
                onChange={(e) => setNewFechaDiagnostico(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sintomasObservados" className="text-right">
                Síntomas Observados
              </Label>
              <Input
                id="sintomasObservados"
                value={newSintomasObservados || ""}
                onChange={(e) => setNewSintomasObservados(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="diagnostico" className="text-right">
                Diagnóstico
              </Label>
              <Input
                id="diagnostico"
                value={newDiagnostico || ""}
                onChange={(e) => setNewDiagnostico(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaInicioTratamiento" className="text-right">
                Fecha Inicio Tratamiento
              </Label>
              <Input
                id="fechaInicioTratamiento"
                value={newFechaInicioTratamiento || ""}
                onChange={(e) => setNewFechaInicioTratamiento(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="medicamentoId" className="text-right">
                Medicamento ID
              </Label>
              <Input
                id="medicamentoId"
                value={newMedicamentoId?.toString() || ""}
                onChange={(e) =>
                  setNewMedicamentoId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dosisAplicada" className="text-right">
                Dosis Aplicada
              </Label>
              <Input
                id="dosisAplicada"
                value={newDosisAplicada?.toString() || ""}
                onChange={(e) =>
                  setNewDosisAplicada(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unidadDosis" className="text-right">
                Unidad Dosis
              </Label>
              <Input
                id="unidadDosis"
                value={newUnidadDosis || ""}
                onChange={(e) => setNewUnidadDosis(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="viaAdministracion" className="text-right">
                Vía Administración
              </Label>
              <Input
                id="viaAdministracion"
                value={newViaAdministracion || ""}
                onChange={(e) => setNewViaAdministracion(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duracionTratamientoDias" className="text-right">
                Duración Tratamiento (días)
              </Label>
              <Input
                id="duracionTratamientoDias"
                value={newDuracionTratamientoDias?.toString() || ""}
                onChange={(e) =>
                  setNewDuracionTratamientoDias(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaFinTratamiento" className="text-right">
                Fecha Fin Tratamiento
              </Label>
              <Input
                id="fechaFinTratamiento"
                value={newFechaFinTratamiento || ""}
                onChange={(e) => setNewFechaFinTratamiento(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proveedorMedicamentoId" className="text-right">
                Proveedor Medicamento ID
              </Label>
              <Input
                id="proveedorMedicamentoId"
                value={newProveedorMedicamentoId?.toString() || ""}
                onChange={(e) =>
                  setNewProveedorMedicamentoId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsableVeterinarioId" className="text-right">
                Responsable Veterinario ID
              </Label>
              <Input
                id="responsableVeterinarioId"
                value={newResponsableVeterinarioId?.toString() || ""}
                onChange={(e) =>
                  setNewResponsableVeterinarioId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="periodoRetiroAplicableDias"
                className="text-right"
              >
                Periodo Retiro (días)
              </Label>
              <Input
                id="periodoRetiroAplicableDias"
                value={newPeriodoRetiroAplicableDias?.toString() || ""}
                onChange={(e) =>
                  setNewPeriodoRetiroAplicableDias(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaFinRetiro" className="text-right">
                Fecha Fin Retiro
              </Label>
              <Input
                id="fechaFinRetiro"
                value={newFechaFinRetiro || ""}
                onChange={(e) => setNewFechaFinRetiro(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proximaRevision" className="text-right">
                Próxima Revisión
              </Label>
              <Input
                id="proximaRevision"
                value={newProximaRevision || ""}
                onChange={(e) => setNewProximaRevision(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resultadoTratamiento" className="text-right">
                Resultado Tratamiento
              </Label>
              <Input
                id="resultadoTratamiento"
                value={newResultadoTratamiento || ""}
                onChange={(e) => setNewResultadoTratamiento(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="observaciones" className="text-right">
                Observaciones
              </Label>
              <Input
                id="observaciones"
                value={newObservaciones || ""}
                onChange={(e) => setNewObservaciones(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateTratamiento}>
              Actualizar Tratamiento Sanitario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
