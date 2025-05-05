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
import { Pencil, Trash2, Eye } from "lucide-react";
import { AnimalCombobox } from "@/components/AnimalCombobox";
import { DatePicker } from "@/components/DatePicker";
import { MedicamentoCombobox } from "@/components/MedicamentoCombobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProveedorCombobox } from "@/components/ProveedorCombobox";
import { useAuth } from "@/context/AuthContext";

export default function ListaTratamientosSanitarios() {
  const { tratamientos, isLoading, isError, refresh } =
    useTratamientosSanitarios();
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

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

  useEffect(() => {
    if (user?.usuario_id) {
      setNewResponsableVeterinarioId(user.usuario_id);
    }
  }, [user]);

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

  const handleVerDetalles = (tratamiento: TratamientoSanitario) => {
    setSelectedTratamiento(tratamiento);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDetallesDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedTratamiento(null);
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
      <div className="p-4 flex flex-col">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Lista de Tratamientos Sanitarios
          </h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Crear Nuevo Tratamiento
          </Button>
        </header>
        <Separator className="my-4" />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Animal ID</TableHead>
              <TableHead className="hidden md:table-cell">
                Síntomas Observados
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Diagnóstico
              </TableHead>

              <TableHead className="hidden lg:table-cell">
                Fecha Fin Tratamiento
              </TableHead>

              <TableHead className="hidden lg:table-cell">
                Próxima Revisión
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Resultado Tratamiento
              </TableHead>
              <TableHead>Observaciones</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tratamientos?.map((t) => (
              <TableRow key={t.tratamiento_id}>
                <TableCell className="font-medium">{t.animal_id}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {t.sintomas_observados}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {t.diagnostico}
                </TableCell>

                <TableCell className="hidden lg:table-cell">
                  {t.fecha_fin_tratamiento}
                </TableCell>

                <TableCell className="hidden lg:table-cell">
                  {t.proxima_revision}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {t.resultado_tratamiento}
                </TableCell>
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
                  <Button
                    variant="ghost" // Puedes usar otro variant si lo prefieres
                    size="icon"
                    onClick={() => handleVerDetalles(t)}
                  >
                    <Eye></Eye>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px] md:max-w-[750px] lg:max-w-[950px]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Tratamiento Sanitario</DialogTitle>
            <DialogDescription>
              Ingresa los detalles del nuevo tratamiento sanitario.
            </DialogDescription>
          </DialogHeader>
          <div
            className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2  gap-4 py-4 max-h-96 overflow-y-auto"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#fff #09090b" }}
          >
            {/* ... (Inputs para todos los campos, similar a los dialogos anteriores) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="animalId" className="text-right">
                Animal ID
              </Label>
              <div className="col-span-3">
                <AnimalCombobox
                  value={newAnimalId}
                  onChange={(animalId) => setNewAnimalId(animalId ?? 0)}
                  label={"Animal"}
                ></AnimalCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaDiagnostico" className="text-right">
                Fecha Diagnóstico
              </Label>
              <div className="col-span-3">
                <DatePicker
                  value={newFechaDiagnostico}
                  onChange={(date) => setNewFechaDiagnostico(date || "")}
                ></DatePicker>
              </div>
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

              <div className="col-span-3">
                <DatePicker
                  value={newFechaInicioTratamiento}
                  onChange={(date) => setNewFechaInicioTratamiento(date || "")}
                ></DatePicker>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="medicamentoId" className="text-right">
                Medicamento ID
              </Label>
              <div className="col-span-3">
                <MedicamentoCombobox
                  value={newMedicamentoId}
                  onChange={(medicamentoId) =>
                    setNewMedicamentoId(medicamentoId ?? undefined)
                  }
                  label={"Medicamento"}
                ></MedicamentoCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dosisAplicada" className="text-right">
                Dosis Aplicada
              </Label>
              <Input
                id="dosisAplicada"
                type="number"
                min={0}
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
              <div className="col-span-3">
                <Select
                  value={newUnidadDosis || ""}
                  onValueChange={(value) => setNewUnidadDosis(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar unidad de dosis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="mg">mg</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="UI">UI</SelectItem>
                    <SelectItem value="dosis">dosis</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="viaAdministracion" className="text-right">
                Vía Administración
              </Label>
              <div className="col-span-3">
                <Select
                  value={newViaAdministracion || ""}
                  onValueChange={(value) => setNewViaAdministracion(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar vía de administración" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oral">Oral</SelectItem>
                    <SelectItem value="intravenosa">Intravenosa</SelectItem>
                    <SelectItem value="intramuscular">Intramuscular</SelectItem>
                    <SelectItem value="subcutanea">Subcutánea</SelectItem>
                    <SelectItem value="topica">Tópica</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duracionTratamientoDias" className="text-right">
                Duración Tratamiento (días)
              </Label>
              <Input
                id="duracionTratamientoDias"
                type="number"
                min={0}
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
              <div className="col-span-3">
                <DatePicker
                  value={newFechaFinTratamiento}
                  onChange={(date) => setNewFechaFinTratamiento(date || "")}
                ></DatePicker>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proveedorMedicamentoId" className="text-right">
                Proveedor Medicamento ID
              </Label>
              <div className="col-span-3">
                <ProveedorCombobox
                  value={newProveedorMedicamentoId || null}
                  onChange={(proveedorId) =>
                    setNewProveedorMedicamentoId(proveedorId ?? undefined)
                  }
                  label={"Proveedor Medicamento"}
                ></ProveedorCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsableVeterinarioId" className="text-right">
                Responsable Veterinario ID
              </Label>
              <Input
                id="responsableVeterinarioId"
                disabled
                value={user?.nombre?.toString() || ""}
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
                type="number"
                min={0}
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
              <div className="col-span-3">
                <DatePicker
                  value={newFechaFinRetiro}
                  onChange={(date) => setNewFechaFinRetiro(date || "")}
                ></DatePicker>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proximaRevision" className="text-right">
                Próxima Revisión
              </Label>
              <div className="col-span-3">
                <DatePicker
                  value={newProximaRevision}
                  onChange={(date) => setNewProximaRevision(date || "")}
                ></DatePicker>
              </div>
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
        <DialogContent className="sm:max-w-[600px] md:max-w-[750px] lg:max-w-[950px]">
          <DialogHeader>
            <DialogTitle>Editar Tratamiento Sanitario</DialogTitle>
            <DialogDescription>
              Edita los detalles del tratamiento sanitario.
            </DialogDescription>
          </DialogHeader>
          <div
            className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2  gap-4 py-4 max-h-96 overflow-y-auto"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#fff #09090b" }}
          >
            {/* ... (Inputs para editar los campos, similar al diálogo de creación) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="animalId" className="text-right">
                Animal ID
              </Label>
              <div className="col-span-3">
                <AnimalCombobox
                  value={newAnimalId}
                  onChange={(animalId) => setNewAnimalId(animalId ?? 0)}
                  label={"Animal"}
                ></AnimalCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaDiagnostico" className="text-right">
                Fecha Diagnóstico
              </Label>
              <div className="col-span-3">
                <DatePicker
                  value={newFechaDiagnostico}
                  onChange={(date) => setNewFechaDiagnostico(date || "")}
                ></DatePicker>
              </div>
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
              <div className="col-span-3">
                <DatePicker
                  value={newFechaInicioTratamiento}
                  onChange={(date) => setNewFechaInicioTratamiento(date || "")}
                ></DatePicker>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="medicamentoId" className="text-right">
                Medicamento ID
              </Label>
              <div className="col-span-3">
                <MedicamentoCombobox
                  value={newMedicamentoId}
                  onChange={(medicamentoId) =>
                    setNewMedicamentoId(medicamentoId ?? undefined)
                  }
                  label={"Medicamento"}
                ></MedicamentoCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dosisAplicada" className="text-right">
                Dosis Aplicada
              </Label>
              <Input
                id="dosisAplicada"
                type="number"
                min={0}
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
              <div className="col-span-3">
                <Select
                  value={newUnidadDosis || ""}
                  onValueChange={(value) => setNewUnidadDosis(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar unidad de dosis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="mg">mg</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="UI">UI</SelectItem>
                    <SelectItem value="dosis">dosis</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="viaAdministracion" className="text-right">
                Vía Administración
              </Label>
              <div className="col-span-3">
                <Select
                  value={newViaAdministracion || ""}
                  onValueChange={(value) => setNewViaAdministracion(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar vía de administración" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oral">Oral</SelectItem>
                    <SelectItem value="intravenosa">Intravenosa</SelectItem>
                    <SelectItem value="intramuscular">Intramuscular</SelectItem>
                    <SelectItem value="subcutanea">Subcutánea</SelectItem>
                    <SelectItem value="topica">Tópica</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duracionTratamientoDias" className="text-right">
                Duración Tratamiento (días)
              </Label>
              <Input
                id="duracionTratamientoDias"
                type="number"
                min={0}
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
              <div className="col-span-3">
                <DatePicker
                  value={newFechaFinTratamiento}
                  onChange={(date) => setNewFechaFinTratamiento(date || "")}
                ></DatePicker>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proveedorMedicamentoId" className="text-right">
                Proveedor Medicamento ID
              </Label>
              <div className="col-span-3">
                <ProveedorCombobox
                  value={newProveedorMedicamentoId || null}
                  onChange={(proveedorId) =>
                    setNewProveedorMedicamentoId(proveedorId ?? undefined)
                  }
                  label={"Proveedor Medicamento"}
                ></ProveedorCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsableVeterinarioId" className="text-right">
                Responsable Veterinario ID
              </Label>
              <Input
                id="responsableVeterinarioId"
                disabled
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
                type="number"
                min={0}
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
              <div className="col-span-3">
                <DatePicker
                  value={newFechaFinRetiro}
                  onChange={(date) => setNewFechaFinRetiro(date || "")}
                ></DatePicker>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proximaRevision" className="text-right">
                Próxima Revisión
              </Label>
              <div className="col-span-3">
                <DatePicker
                  value={newProximaRevision}
                  onChange={(date) => setNewProximaRevision(date || "")}
                ></DatePicker>
              </div>
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

      {selectedTratamiento && (
        <Dialog
          open={isDetailsDialogOpen}
          onOpenChange={handleCloseDetallesDialog}
        >
          <DialogContent className="sm:max-w-[600px] md:max-w-[750px] lg:max-w-[950px]">
            <DialogHeader>
              <DialogTitle>Detalles del Tratamiento Sanitario</DialogTitle>
              <DialogDescription>
                Información detallada del tratamiento con ID:{" "}
                {selectedTratamiento.tratamiento_id}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
              <div>
                <Label className="text-sm text-gray-600">Animal ID</Label>
                <p className="font-semibold">{selectedTratamiento.animal_id}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">
                  Fecha Diagnóstico
                </Label>
                <p>{selectedTratamiento.fecha_diagnostico}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">
                  Síntomas Observados
                </Label>
                <p>{selectedTratamiento.sintomas_observados || "N/A"}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Diagnóstico</Label>
                <p>{selectedTratamiento.diagnostico || "N/A"}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">
                  Fecha Inicio Tratamiento
                </Label>
                <p>{selectedTratamiento.fecha_inicio_tratamiento || "N/A"}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Medicamento ID</Label>
                <p>{selectedTratamiento.medicamento_id || "N/A"}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Dosis Aplicada</Label>
                <p>{selectedTratamiento.dosis_aplicada || "N/A"}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Unidad Dosis</Label>
                <p>{selectedTratamiento.unidad_dosis || "N/A"}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">
                  Vía Administración
                </Label>
                <p>{selectedTratamiento.via_administracion || "N/A"}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">
                  Duración Tratamiento (días)
                </Label>
                <p>{selectedTratamiento.duracion_tratamiento_dias || "N/A"}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">
                  Fecha Fin Tratamiento
                </Label>
                <p>{selectedTratamiento.fecha_fin_tratamiento || "N/A"}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">
                  Proveedor Medicamento ID
                </Label>
                <p>{selectedTratamiento.proveedor_medicamento_id || "N/A"}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">
                  Responsable Veterinario ID
                </Label>
                <p>{selectedTratamiento.responsable_veterinario_id || "N/A"}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">
                  Periodo Retiro (días)
                </Label>
                <p>
                  {selectedTratamiento.periodo_retiro_aplicable_dias || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">
                  Fecha Fin Retiro
                </Label>
                <p>{selectedTratamiento.fecha_fin_retiro || "N/A"}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">
                  Próxima Revisión
                </Label>
                <p>{selectedTratamiento.proxima_revision || "N/A"}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">
                  Resultado Tratamiento
                </Label>
                <p>{selectedTratamiento.resultado_tratamiento || "N/A"}</p>
              </div>
              <div className="col-span-full">
                <Label className="text-sm text-gray-600">Observaciones</Label>
                <p>{selectedTratamiento.observaciones || "N/A"}</p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCloseDetallesDialog}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
