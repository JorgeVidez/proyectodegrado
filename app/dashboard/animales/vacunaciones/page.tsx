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
import { Pencil, Trash2 } from "lucide-react";

export default function ListaVacunaciones() {
  const { vacunaciones, isLoading, isError, refresh } = useVacunaciones();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedVacunacion, setSelectedVacunacion] =
    useState<Vacunacion | null>(null);

  const [newAnimalId, setNewAnimalId] = useState<number>(0);
  const [newFechaAplicacion, setNewFechaAplicacion] = useState<string>("");
  const [newTipoVacunaId, setNewTipoVacunaId] = useState<number>(0);
  const [newDosisAplicada, setNewDosisAplicada] = useState<number | undefined>(
    undefined
  );
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
  const [newResponsableAplicacionId, setNewResponsableAplicacionId] = useState<
    number | undefined
  >(undefined);
  const [newProximaVacunacionSugerida, setNewProximaVacunacionSugerida] =
    useState<string | undefined>(undefined);
  const [newObservaciones, setNewObservaciones] = useState<string | undefined>(
    undefined
  );

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if (isError) console.error(isError);
  }, [isError]);

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

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar vacunaciones</div>;

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
              <TableHead>Tipo Vacuna ID</TableHead>
              <TableHead>Dosis Aplicada</TableHead>
              <TableHead>Unidad Dosis</TableHead>
              <TableHead>Lote Vacuna</TableHead>
              <TableHead>Fecha Vencimiento Lote</TableHead>
              <TableHead>Proveedor Vacuna ID</TableHead>
              <TableHead>Responsable Aplicación ID</TableHead>
              <TableHead>Próxima Vacunación Sugerida</TableHead>
              <TableHead>Observaciones</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vacunaciones?.map((v) => (
              <TableRow key={v.vacunacion_id}>
                <TableCell className="font-medium">{v.animal_id}</TableCell>
                <TableCell className="">{v.fecha_aplicacion}</TableCell>
                <TableCell className="">{v.tipo_vacuna_id}</TableCell>
                <TableCell className="">{v.dosis_aplicada}</TableCell>
                <TableCell className="">{v.unidad_dosis}</TableCell>
                <TableCell className="">{v.lote_vacuna}</TableCell>
                <TableCell className="">{v.fecha_vencimiento_lote}</TableCell>
                <TableCell className="">{v.proveedor_vacuna_id}</TableCell>
                <TableCell className="">
                  {v.responsable_aplicacion_id}
                </TableCell>
                <TableCell className="">
                  {v.proxima_vacunacion_sugerida}
                </TableCell>
                <TableCell className="">{v.observaciones}</TableCell>
                <TableCell>
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
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear Nueva Vacunación</DialogTitle>
            <DialogDescription>
              Ingresa los detalles de la nueva vacunación.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
              <Label htmlFor="fechaAplicacion" className="text-right">
                Fecha Aplicación
              </Label>
              <Input
                id="fechaAplicacion"
                value={newFechaAplicacion}
                onChange={(e) => setNewFechaAplicacion(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipoVacunaId" className="text-right">
                Tipo Vacuna ID
              </Label>
              <Input
                id="tipoVacunaId"
                value={newTipoVacunaId.toString()}
                onChange={(e) => setNewTipoVacunaId(Number(e.target.value))}
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
              <Label htmlFor="loteVacuna" className="text-right">
                Lote Vacuna
              </Label>
              <Input
                id="loteVacuna"
                value={newLoteVacuna || ""}
                onChange={(e) => setNewLoteVacuna(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaVencimientoLote" className="text-right">
                Fecha Vencimiento Lote
              </Label>
              <Input
                id="fechaVencimientoLote"
                value={newFechaVencimientoLote || ""}
                onChange={(e) => setNewFechaVencimientoLote(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proveedorVacunaId" className="text-right">
                Proveedor Vacuna ID
              </Label>
              <Input
                id="proveedorVacunaId"
                value={newProveedorVacunaId?.toString() || ""}
                onChange={(e) =>
                  setNewProveedorVacunaId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsableAplicacionId" className="text-right">
                Responsable Aplicación ID
              </Label>
              <Input
                id="responsableAplicacionId"
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
              <Input
                id="proximaVacunacionSugerida"
                value={newProximaVacunacionSugerida || ""}
                onChange={(e) =>
                  setNewProximaVacunacionSugerida(e.target.value)
                }
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
            <Button onClick={handleCreateVacunacion}>Crear Vacunación</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Vacunación</DialogTitle>
            <DialogDescription>
              Edita los detalles de la vacunación.
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
              <Label htmlFor="fechaAplicacion" className="text-right">
                Fecha Aplicación
              </Label>
              <Input
                id="fechaAplicacion"
                value={newFechaAplicacion}
                onChange={(e) => setNewFechaAplicacion(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipoVacunaId" className="text-right">
                Tipo Vacuna ID
              </Label>
              <Input
                id="tipoVacunaId"
                value={newTipoVacunaId.toString()}
                onChange={(e) => setNewTipoVacunaId(Number(e.target.value))}
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
              <Label htmlFor="loteVacuna" className="text-right">
                Lote Vacuna
              </Label>
              <Input
                id="loteVacuna"
                value={newLoteVacuna || ""}
                onChange={(e) => setNewLoteVacuna(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaVencimientoLote" className="text-right">
                Fecha Vencimiento Lote
              </Label>
              <Input
                id="fechaVencimientoLote"
                value={newFechaVencimientoLote || ""}
                onChange={(e) => setNewFechaVencimientoLote(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proveedorVacunaId" className="text-right">
                Proveedor Vacuna ID
              </Label>
              <Input
                id="proveedorVacunaId"
                value={newProveedorVacunaId?.toString() || ""}
                onChange={(e) =>
                  setNewProveedorVacunaId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsableAplicacionId" className="text-right">
                Responsable Aplicación ID
              </Label>
              <Input
                id="responsableAplicacionId"
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
              <Input
                id="proximaVacunacionSugerida"
                value={newProximaVacunacionSugerida || ""}
                onChange={(e) =>
                  setNewProximaVacunacionSugerida(e.target.value)
                }
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
            <Button onClick={handleUpdateVacunacion}>
              Actualizar Vacunación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
