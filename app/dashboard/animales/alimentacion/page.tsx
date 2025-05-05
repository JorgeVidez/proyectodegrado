"use client";

import {
  useAlimentaciones,
  Alimentacion,
  AlimentacionBase,
  updateAlimentacion,
  createAlimentacion,
  deleteAlimentacion,
} from "@/hooks/useAlimentaciones";
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
import { AnimalCombobox } from "@/components/AnimalCombobox";
import { LoteCombobox } from "@/components/LoteCombobox";
import { UbicacionCombobox } from "@/components/UbicacionCombobox";
import { DatePicker } from "@/components/DatePicker";
import { TipoAlimentoCombobox } from "@/components/TipoAlimentoCombobox";
import { ProveedorCombobox } from "@/components/ProveedorCombobox";
import { useAuth } from "@/context/AuthContext";

export default function ListaAlimentaciones() {
  const { alimentaciones, isLoading, isError, refresh } = useAlimentaciones();
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAlimentacion, setSelectedAlimentacion] =
    useState<Alimentacion | null>(null);

  const [newAnimalId, setNewAnimalId] = useState<number | undefined>(undefined);
  const [newLoteId, setNewLoteId] = useState<number | undefined>(undefined);
  const [newUbicacionId, setNewUbicacionId] = useState<number | undefined>(
    undefined
  );
  const [newFechaSuministro, setNewFechaSuministro] = useState<string>("");
  const [newTipoAlimentoId, setNewTipoAlimentoId] = useState<number>(0);
  const [newCantidadSuministrada, setNewCantidadSuministrada] =
    useState<number>(0);
  const [newProveedorAlimentoId, setNewProveedorAlimentoId] = useState<
    number | undefined
  >(undefined);
  const [newCostoTotalAlimento, setNewCostoTotalAlimento] = useState<
    number | undefined
  >(undefined);
  const [newResponsableId, setNewResponsableId] = useState<number | undefined>(
    undefined
  );
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
      setNewResponsableId(user.usuario_id);
    }
  }, [user]);

  const handleCreateAlimentacion = async () => {
    const newAlimentacion: AlimentacionBase = {
      animal_id: newAnimalId,
      lote_id: newLoteId,
      ubicacion_id: newUbicacionId,
      fecha_suministro: newFechaSuministro,
      tipo_alimento_id: newTipoAlimentoId,
      cantidad_suministrada: newCantidadSuministrada,
      proveedor_alimento_id: newProveedorAlimentoId,
      costo_total_alimento: newCostoTotalAlimento,
      responsable_id: newResponsableId,
      observaciones: newObservaciones,
    };
    try {
      await createAlimentacion(newAlimentacion);
      setAlertMessage("Alimentación creada con éxito.");
      setAlertType("success");
      setIsCreateDialogOpen(false);
      refresh();
    } catch (err) {
      setAlertMessage("Error al crear la alimentación.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const handleEditAlimentacion = (alimentacion: Alimentacion) => {
    setSelectedAlimentacion(alimentacion);
    setNewAnimalId(alimentacion.animal_id);
    setNewLoteId(alimentacion.lote_id);
    setNewUbicacionId(alimentacion.ubicacion_id);
    setNewFechaSuministro(alimentacion.fecha_suministro);
    setNewTipoAlimentoId(alimentacion.tipo_alimento_id);
    setNewCantidadSuministrada(alimentacion.cantidad_suministrada);
    setNewProveedorAlimentoId(alimentacion.proveedor_alimento_id);
    setNewCostoTotalAlimento(alimentacion.costo_total_alimento);
    setNewResponsableId(alimentacion.responsable_id);
    setNewObservaciones(alimentacion.observaciones);
    setIsEditDialogOpen(true);
  };

  const handleUpdateAlimentacion = async () => {
    if (selectedAlimentacion) {
      const updatedAlimentacion: Partial<AlimentacionBase> = {
        animal_id: newAnimalId,
        lote_id: newLoteId,
        ubicacion_id: newUbicacionId,
        fecha_suministro: newFechaSuministro,
        tipo_alimento_id: newTipoAlimentoId,
        cantidad_suministrada: newCantidadSuministrada,
        proveedor_alimento_id: newProveedorAlimentoId,
        costo_total_alimento: newCostoTotalAlimento,
        responsable_id: newResponsableId,
        observaciones: newObservaciones,
      };
      try {
        await updateAlimentacion(
          selectedAlimentacion.alimentacion_id,
          updatedAlimentacion
        );
        setAlertMessage("Alimentación actualizada con éxito.");
        setAlertType("success");
        setIsEditDialogOpen(false);
        refresh();
      } catch (err) {
        setAlertMessage("Error al actualizar la alimentación.");
        setAlertType("error");
      }
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
    }
  };

  const handleDeleteAlimentacion = async (alimentacionId: number) => {
    try {
      await deleteAlimentacion(alimentacionId);
      setAlertMessage("Alimentación eliminada con éxito.");
      setAlertType("success");
      refresh();
    } catch (err) {
      setAlertMessage("Error al eliminar la alimentación.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar alimentaciones</div>;

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
      <div className="p-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Lista de Alimentaciones</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Ingresar Alimentación
          </Button>
        </header>
        <Separator className="my-4" />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Animal ID</TableHead>
              <TableHead className="hidden md:table-cell">Lote ID</TableHead>
              <TableHead className="hidden md:table-cell">
                Ubicación ID
              </TableHead>
              <TableHead>Fecha Suministro</TableHead>
              <TableHead className="hidden md:table-cell">
                Tipo Alimento ID
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Cantidad Dada
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                Proveedor Alimento ID
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                Costo Total Alimento
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                Responsable ID
              </TableHead>
              <TableHead className="hidden lg:table-cell">Obs.</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alimentaciones?.map((a) => (
              <TableRow key={a.alimentacion_id}>
                <TableCell className="font-medium">{a.animal_id}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {a.lote_id}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {a.ubicacion_id}
                </TableCell>
                <TableCell className="">{a.fecha_suministro}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {a.tipo_alimento_id}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {a.cantidad_suministrada}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {a.proveedor_alimento_id}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {a.costo_total_alimento}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {a.responsable_id}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {a.observaciones}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditAlimentacion(a)}
                  >
                    <Pencil></Pencil>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteAlimentacion(a.alimentacion_id)}
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
        <DialogContent className="sm:max-w-[600px] md:max-w-[750px] lg:max-w-[950px]">
          <DialogHeader>
            <DialogTitle>Crear Nueva Alimentación</DialogTitle>
            <DialogDescription>
              Ingresa los detalles de la nueva alimentación.
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
                  label="Animal"
                  value={newAnimalId}
                  onChange={(value) => setNewAnimalId(value)}
                ></AnimalCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="loteId" className="text-right">
                Lote ID
              </Label>
              <div className="col-span-3">
                <LoteCombobox
                  label="Lote"
                  value={newLoteId ?? null}
                  onChange={(value) => setNewLoteId(value)}
                ></LoteCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ubicacionId" className="text-right">
                Ubicación ID
              </Label>
              <div className="col-span-3">
                <UbicacionCombobox
                  label="Ubicación"
                  value={newUbicacionId ?? null}
                  onChange={(value) => setNewUbicacionId(value)}
                ></UbicacionCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaSuministro" className="text-right">
                Fecha Suministro
              </Label>
              <div className="col-span-3">
                <DatePicker
                  value={newFechaSuministro}
                  onChange={(date) => setNewFechaSuministro(date || "")}
                ></DatePicker>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipoAlimentoId" className="text-right">
                Tipo Alimento ID
              </Label>
              <div className="col-span-3">
                <TipoAlimentoCombobox
                  label="Tipo Alimento"
                  value={newTipoAlimentoId}
                  onChange={(value) => setNewTipoAlimentoId(value ?? 0)}
                ></TipoAlimentoCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cantidadSuministrada" className="text-right">
                Cantidad Suministrada
              </Label>
              <Input
                id="cantidadSuministrada"
                type="number"
                min={0}
                value={newCantidadSuministrada.toString()}
                onChange={(e) =>
                  setNewCantidadSuministrada(Number(e.target.value))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proveedorAlimentoId" className="text-right">
                Proveedor Alimento ID
              </Label>
              <div className="col-span-3">
                <ProveedorCombobox
                  label="Proveedor Alimento"
                  value={newProveedorAlimentoId ?? null}
                  onChange={(value) => setNewProveedorAlimentoId(value)}
                ></ProveedorCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="costoTotalAlimento" className="text-right">
                Costo Total Alimento
              </Label>
              <Input
                id="costoTotalAlimento"
                type="number"
                min={0}
                value={newCostoTotalAlimento?.toString() || ""}
                onChange={(e) =>
                  setNewCostoTotalAlimento(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsableId" className="text-right">
                Responsable ID
              </Label>
              <Input
                id="responsableId"
                disabled
                value={user?.nombre?.toString() || ""}
                className="col-span-3"
              />
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
            <Button onClick={handleCreateAlimentacion}>
              Crear Alimentación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] md:max-w-[750px] lg:max-w-[950px]">
          <DialogHeader>
            <DialogTitle>Editar Alimentación</DialogTitle>
            <DialogDescription>
              Edita los detalles de la alimentación.
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
                  onChange={(value) => setNewAnimalId(value)}
                ></AnimalCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="loteId" className="text-right">
                Lote ID
              </Label>
              <div className="col-span-3">
                <LoteCombobox
                  label="Lote"
                  value={newLoteId ?? null}
                  onChange={(value) => setNewLoteId(value)}
                ></LoteCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ubicacionId" className="text-right">
                Ubicación ID
              </Label>
              <div className="col-span-3">
                <UbicacionCombobox
                  label="Ubicación"
                  value={newUbicacionId ?? null}
                  onChange={(value) => setNewUbicacionId(value)}
                ></UbicacionCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaSuministro" className="text-right">
                Fecha Suministro
              </Label>
              <div className="col-span-3">
                <DatePicker
                  value={newFechaSuministro}
                  onChange={(date) => setNewFechaSuministro(date || "")}
                ></DatePicker>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipoAlimentoId" className="text-right">
                Tipo Alimento ID
              </Label>
              <div className="col-span-3">
                <TipoAlimentoCombobox
                  label="Tipo Alimento"
                  value={newTipoAlimentoId}
                  onChange={(value) => setNewTipoAlimentoId(value ?? 0)}
                ></TipoAlimentoCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cantidadSuministrada" className="text-right">
                Cantidad Suministrada
              </Label>
              <Input
                id="cantidadSuministrada"
                type="number"
                min={0}
                value={newCantidadSuministrada.toString()}
                onChange={(e) =>
                  setNewCantidadSuministrada(Number(e.target.value))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proveedorAlimentoId" className="text-right">
                Proveedor Alimento ID
              </Label>
              <div className="col-span-3">
                <ProveedorCombobox
                  label="Proveedor Alimento"
                  value={newProveedorAlimentoId ?? null}
                  onChange={(value) => setNewProveedorAlimentoId(value)}
                ></ProveedorCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="costoTotalAlimento" className="text-right">
                Costo Total Alimento
              </Label>
              <Input
                id="costoTotalAlimento"
                type="number"
                min={0}
                value={newCostoTotalAlimento?.toString() || ""}
                onChange={(e) =>
                  setNewCostoTotalAlimento(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsableId" className="text-right">
                Responsable ID
              </Label>
              <Input
                id="responsableId"
                disabled
                value={newResponsableId?.toString() || ""}
                onChange={(e) =>
                  setNewResponsableId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
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
            <Button onClick={handleUpdateAlimentacion}>
              Actualizar Alimentación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

