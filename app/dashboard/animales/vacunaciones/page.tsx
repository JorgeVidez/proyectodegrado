"use client";

import {
  createVacunacion,
  deleteVacunacion,
  updateVacunacion,
  useVacunaciones,
  Vacunacion,
  VacunacionBase,
} from "@/hooks/useVacunaciones";
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
import { Eye, Pencil, Trash2 } from "lucide-react";
import { AnimalCombobox } from "@/components/AnimalCombobox";
import { DatePicker } from "@/components/DatePicker";
import { TipoVacunaCombobox } from "@/components/TipoVacunaCombobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { LoteCombobox } from "@/components/LoteCombobox";
import { ProveedorCombobox } from "@/components/ProveedorCombobox";
import { useAuth } from "@/context/AuthContext";

export default function ListaVacunaciones() {
  const { vacunaciones, isLoading, isError, refresh } = useVacunaciones();
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

    const [selectedVacunacion, setSelectedVacunacion] =
      useState<Vacunacion | null>(null);

    const [newAnimalId, setNewAnimalId] = useState<number>(0);
    const [newFechaAplicacion, setNewFechaAplicacion] = useState<string>("");
    const [newTipoVacunaId, setNewTipoVacunaId] = useState<number>(0);
    const [newDosisAplicada, setNewDosisAplicada] = useState<
      number | undefined
    >(undefined);
    const [newUnidadDosis, setNewUnidadDosis] = useState<string | undefined>(
      undefined
    );
    const [newLoteVacuna, setNewLoteVacuna] = useState<string | undefined>(
      undefined
    );
    const [newFechaVencimientoLote, setNewFechaVencimientoLote] = useState<
      string | undefined
    >(undefined);
    const [newProveedorVacunaId, setNewProveedorVacunaId] = useState<
      number | undefined
    >(undefined);
    const [newResponsableAplicacionId, setNewResponsableAplicacionId] =
      useState<number | undefined>(undefined);
    const [newProximaVacunacionSugerida, setNewProximaVacunacionSugerida] =
      useState<string | undefined>(undefined);
    const [newObservaciones, setNewObservaciones] = useState<
      string | undefined
    >(undefined);

    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<"success" | "error" | null>(
      null
    );

    useEffect(() => {
      if (isError) console.error(isError);
    }, [isError]);

    useEffect(() => {
      if (user) {
        setNewResponsableAplicacionId(user.usuario_id);
      }
    }, [user]);

  const handleCreateVacunacion = async () => {
    const newVacunacion: VacunacionBase = {
      animal_id: newAnimalId,
      fecha_aplicacion: newFechaAplicacion,
      tipo_vacuna_id: newTipoVacunaId,
      dosis_aplicada: newDosisAplicada,
      unidad_dosis: newUnidadDosis,
      lote_vacuna: newLoteVacuna,
      fecha_vencimiento_lote: newFechaVencimientoLote,
      proveedor_vacuna_id: newProveedorVacunaId,
      responsable_aplicacion_id: newResponsableAplicacionId,
      proxima_vacunacion_sugerida: newProximaVacunacionSugerida,
      observaciones: newObservaciones,
    };
    try {
      await createVacunacion(newVacunacion);
      setAlertMessage("Vacunación creada con éxito.");
      setAlertType("success");
      setIsCreateDialogOpen(false);
      refresh();
    } catch (err) {
      setAlertMessage("Error al crear la vacunación.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const handleEditVacunacion = (vacunacion: Vacunacion) => {
    setSelectedVacunacion(vacunacion);
    setNewAnimalId(vacunacion.animal_id);
    setNewFechaAplicacion(vacunacion.fecha_aplicacion);
    setNewTipoVacunaId(vacunacion.tipo_vacuna_id);
    setNewDosisAplicada(vacunacion.dosis_aplicada);
    setNewUnidadDosis(vacunacion.unidad_dosis);
    setNewLoteVacuna(vacunacion.lote_vacuna);
    setNewFechaVencimientoLote(vacunacion.fecha_vencimiento_lote);
    setNewProveedorVacunaId(vacunacion.proveedor_vacuna_id);
    setNewResponsableAplicacionId(vacunacion.responsable_aplicacion_id);
    setNewProximaVacunacionSugerida(vacunacion.proxima_vacunacion_sugerida);
    setNewObservaciones(vacunacion.observaciones);
    setIsEditDialogOpen(true);
  };

  const handleUpdateVacunacion = async () => {
    if (selectedVacunacion) {
      const updatedVacunacion: Partial<VacunacionBase> = {
        animal_id: newAnimalId,
        fecha_aplicacion: newFechaAplicacion,
        tipo_vacuna_id: newTipoVacunaId,
        dosis_aplicada: newDosisAplicada,
        unidad_dosis: newUnidadDosis,
        lote_vacuna: newLoteVacuna,
        fecha_vencimiento_lote: newFechaVencimientoLote,
        proveedor_vacuna_id: newProveedorVacunaId,
        responsable_aplicacion_id: newResponsableAplicacionId,
        proxima_vacunacion_sugerida: newProximaVacunacionSugerida,
        observaciones: newObservaciones,
      };
      try {
        await updateVacunacion(
          selectedVacunacion.vacunacion_id,
          updatedVacunacion
        );
        setAlertMessage("Vacunación actualizada con éxito.");
        setAlertType("success");
        setIsEditDialogOpen(false);
        refresh();
      } catch (err) {
        setAlertMessage("Error al actualizar la vacunación.");
        setAlertType("error");
      }
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
    }
  };

  const handleDeleteVacunacion = async (vacunacionId: number) => {
    try {
      await deleteVacunacion(vacunacionId);
      setAlertMessage("Vacunación eliminada con éxito.");
      setAlertType("success");
      refresh();
    } catch (err) {
      setAlertMessage("Error al eliminar la vacunación.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const handleOpenDetailsDialog = (vacunacion: Vacunacion) => {
    setSelectedVacunacion(vacunacion);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setSelectedVacunacion(null);
    setIsDetailsDialogOpen(false);
  };

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar vacunaciones</div>;

  return (
    <div className="flex h-full flex-col">
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
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {alertMessage && alertType && (
          <Alert variant={alertType === "success" ? "default" : "destructive"}>
            {alertType === "error" && <div className="h-4 w-4" />}
            <AlertTitle>
              {alertType === "success" ? "Éxito" : "Error"}
            </AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}
        <div>
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Lista de Vacunaciones</h1>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Crear Nueva Vacunación
            </Button>
          </header>
          <Separator className="my-4" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Animal ID</TableHead>
                <TableHead>Fecha Aplicación</TableHead>
                <TableHead className=" hidden lg:table-cell">
                  Tipo Vacuna ID
                </TableHead>

                <TableHead className=" hidden lg:table-cell">
                  Proveedor Vacuna ID
                </TableHead>
                <TableHead className=" hidden md:table-cell">
                  Responsable Aplicación ID
                </TableHead>
                <TableHead className=" hidden lg:table-cell">
                  Próxima Vacunación Sugerida
                </TableHead>
                <TableHead className=" hidden md:table-cell">
                  Observaciones
                </TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vacunaciones?.map((v) => (
                <TableRow key={v.vacunacion_id}>
                  <TableCell className="font-medium">{v.animal_id}</TableCell>
                  <TableCell className=" hidden lg:table-cell">
                    {v.fecha_aplicacion}
                  </TableCell>
                  <TableCell className=" hidden lg:table-cell">
                    {v.tipo_vacuna_id}
                  </TableCell>

                  <TableCell className=" hidden lg:table-cell">
                    {v.proveedor_vacuna_id}
                  </TableCell>
                  <TableCell className=" hidden md:table-cell">
                    {v.responsable_aplicacion_id}
                  </TableCell>
                  <TableCell className=" hidden lg:table-cell">
                    {v.proxima_vacunacion_sugerida}
                  </TableCell>
                  <TableCell className=" hidden md:table-cell">
                    {v.observaciones}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenDetailsDialog(v)}
                      className="mr-2"
                    >
                      <Eye />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditVacunacion(v)}
                    >
                      <Pencil></Pencil>
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteVacunacion(v.vacunacion_id)}
                    >
                      <Trash2></Trash2>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-sm  sm:max-w-[600px] md:max-w-[750px] lg:max-w-[950px]">
          <DialogHeader>
            <DialogTitle>Crear Nueva Vacunación</DialogTitle>
            <DialogDescription>
              Ingresa los detalles de la nueva vacunación.
            </DialogDescription>
          </DialogHeader>
          <div
            className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2  gap-4 py-4 max-h-96 overflow-y-auto"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#fff #09090b" }}
          >
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="animalId" className="text-right">
                Animal ID
              </Label>
              <div className="col-span-3">
                <AnimalCombobox
                  label="Animal"
                  value={newAnimalId}
                  onChange={(value) =>
                    value !== undefined && setNewAnimalId(value)
                  }
                ></AnimalCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaAplicacion" className="text-right">
                Fecha Aplicación
              </Label>
              <div className="col-span-3">
                <DatePicker
                  value={newFechaAplicacion}
                  onChange={(value) => setNewFechaAplicacion(value || "")}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipoVacunaId" className="text-right">
                Tipo Vacuna ID
              </Label>
              <div className="col-span-3">
                <TipoVacunaCombobox
                  label="Tipo Vacuna"
                  value={newTipoVacunaId}
                  onChange={(value) =>
                    value !== undefined && setNewTipoVacunaId(value)
                  }
                ></TipoVacunaCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dosisAplicada" className="text-right">
                Dosis Aplicada
              </Label>
              <Input
                id="dosisAplicada"
                type="number"
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
              <Label htmlFor="loteVacuna" className="text-right">
                Lote Vacuna
              </Label>
              <Input
                id="loteVacuna"
                value={newLoteVacuna || ""}
                onChange={(e) => setNewLoteVacuna(e.target.value)}
                placeholder="Ingresa el codigo del lote"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaVencimientoLote" className="text-right">
                Fecha Vencimiento Lote
              </Label>
              <div className="col-span-3">
                <DatePicker
                  value={newFechaVencimientoLote}
                  onChange={(value) => setNewFechaVencimientoLote(value || "")}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proveedorVacunaId" className="text-right">
                Proveedor Vacuna ID
              </Label>
              <div className="col-span-3">
                <ProveedorCombobox
                  label="Proveedor Vacuna"
                  value={newProveedorVacunaId || null}
                  onChange={(value) =>
                    value !== undefined && setNewProveedorVacunaId(value)
                  }
                ></ProveedorCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsableAplicacionId" className="text-right">
                Responsable Aplicación ID
              </Label>
              <Input
                id="responsableAplicacionId"
                value={user?.nombre || ""}
                className="col-span-3"
                disabled
              ></Input>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proximaVacunacionSugerida" className="text-right">
                Próxima Vacunación Sugerida
              </Label>
              <div className="col-span-3">
                <DatePicker
                  value={newProximaVacunacionSugerida}
                  onChange={(value) =>
                    setNewProximaVacunacionSugerida(value || "")
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="observaciones"
                className="text-right overflow-hidden"
              >
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
            <Button onClick={handleCreateVacunacion}>Crear Vacunación</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-sm  sm:max-w-[600px] md:max-w-[750px] lg:max-w-[950px]">
          <DialogHeader>
            <DialogTitle>Editar Vacunación</DialogTitle>
            <DialogDescription>
              Edita los detalles de la vacunación.
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
                  label="Animal"
                  value={newAnimalId}
                  onChange={(value) =>
                    value !== undefined && setNewAnimalId(value)
                  }
                ></AnimalCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaAplicacion" className="text-right">
                Fecha Aplicación
              </Label>
              <div className="col-span-3">
                <DatePicker
                  value={newFechaAplicacion}
                  onChange={(value) => setNewFechaAplicacion(value || "")}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipoVacunaId" className="text-right">
                Tipo Vacuna ID
              </Label>
              <div className="col-span-3">
                <TipoVacunaCombobox
                  label="Tipo Vacuna"
                  value={newTipoVacunaId}
                  onChange={(value) =>
                    value !== undefined && setNewTipoVacunaId(value)
                  }
                ></TipoVacunaCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dosisAplicada" className="text-right">
                Dosis Aplicada
              </Label>
              <Input
                id="dosisAplicada"
                type="number"
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
              <Label htmlFor="loteVacuna" className="text-right">
                Lote Vacuna
              </Label>
              <Input
                id="loteVacuna"
                value={newLoteVacuna || ""}
                onChange={(e) => setNewLoteVacuna(e.target.value)}
                placeholder="Escriba el codigo de la vacuna"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaVencimientoLote" className="text-right">
                Fecha Vencimiento Lote
              </Label>
              <div className="col-span-3">
                <DatePicker
                  value={newFechaVencimientoLote}
                  onChange={(value) => setNewFechaVencimientoLote(value || "")}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proveedorVacunaId" className="text-right">
                Proveedor Vacuna ID
              </Label>
              <div className="col-span-3">
                <ProveedorCombobox
                  label="Proveedor Vacuna"
                  value={newProveedorVacunaId || null}
                  onChange={(value) =>
                    value !== undefined && setNewProveedorVacunaId(value)
                  }
                ></ProveedorCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsableAplicacionId" className="text-right">
                Responsable Aplicación ID
              </Label>
              <Input
                id="responsableAplicacionId"
                disabled
                value={newResponsableAplicacionId?.toString() || ""}
                onChange={(e) =>
                  setNewResponsableAplicacionId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proximaVacunacionSugerida" className="text-right">
                Próxima Vacunación Sugerida
              </Label>
              <div className="col-span-3">
                <DatePicker
                  value={newProximaVacunacionSugerida}
                  onChange={(value) =>
                    setNewProximaVacunacionSugerida(value || "")
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="observaciones"
                className="text-right overflow-hidden"
              >
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
            <Button onClick={handleUpdateVacunacion}>
              Actualizar Vacunación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] md:max-w-[750px] lg:max-w-[950px]">
          <DialogHeader>
            <DialogTitle>Detalles de la Vacunación</DialogTitle>
            <DialogDescription>
              Información detallada de la vacunación seleccionada.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedVacunacion && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">ID Vacunación:</Label>
                    <p>{selectedVacunacion.vacunacion_id}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Animal ID:</Label>
                    <p>{selectedVacunacion.animal_id}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Fecha Aplicación:</Label>
                    <p>{selectedVacunacion.fecha_aplicacion}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Tipo Vacuna ID:</Label>
                    <p>{selectedVacunacion.tipo_vacuna_id}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Dosis Aplicada:</Label>
                    <p>{selectedVacunacion.dosis_aplicada ?? "N/A"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Unidad Dosis:</Label>
                    <p>{selectedVacunacion.unidad_dosis ?? "N/A"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Lote Vacuna:</Label>
                    <p>{selectedVacunacion.lote_vacuna ?? "N/A"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">
                      Fecha Vencimiento Lote:
                    </Label>
                    <p>{selectedVacunacion.fecha_vencimiento_lote ?? "N/A"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">
                      Proveedor Vacuna ID:
                    </Label>
                    <p>{selectedVacunacion.proveedor_vacuna_id ?? "N/A"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">
                      Responsable Aplicación ID:
                    </Label>
                    <p>
                      {selectedVacunacion.responsable_aplicacion_id ?? "N/A"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="font-semibold">
                      Próxima Vacunación Sugerida:
                    </Label>
                    <p>
                      {selectedVacunacion.proxima_vacunacion_sugerida ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="font-semibold">Observaciones:</Label>
                    <p>{selectedVacunacion.observaciones ?? "N/A"}</p>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleCloseDetailsDialog}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
