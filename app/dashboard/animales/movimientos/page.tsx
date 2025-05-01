"use client";

import {
  useMovimientosAnimal,
  TipoMovimiento,
  MovimientoAnimal,
  MovimientoAnimalBase,
  createMovimientoAnimal,
  updateMovimientoAnimal,
  deleteMovimientoAnimal,
} from "@/hooks/useMovimientosAnimal";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UbicacionCombobox } from "@/components/UbicacionCombobox";
import { LoteCombobox } from "@/components/LoteCombobox";
import { ProveedorCombobox } from "@/components/ProveedorCombobox";
import { ClienteCombobox } from "@/components/ClienteCombobox";
import { useAuth } from "@/context/AuthContext";

export default function ListaMovimientosAnimales() {
  const { movimientos, isLoading, isError, refresh } = useMovimientosAnimal();
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const [selectedMovimiento, setSelectedMovimiento] =
    useState<MovimientoAnimal | null>(null);

  const [newAnimalId, setNewAnimalId] = useState<number>(0);
  const [newTipoMovimiento, setNewTipoMovimiento] = useState<TipoMovimiento>(
    TipoMovimiento.IngresoCompra
  );
  const [newOrigenUbicacionId, setNewOrigenUbicacionId] = useState<
    number | undefined
  >(undefined);
  const [newDestinoUbicacionId, setNewDestinoUbicacionId] = useState<
    number | undefined
  >(undefined);
  const [newOrigenLoteId, setNewOrigenLoteId] = useState<number | undefined>(
    undefined
  );
  const [newDestinoLoteId, setNewDestinoLoteId] = useState<number | undefined>(
    undefined
  );
  const [newProveedorId, setNewProveedorId] = useState<number | undefined>(
    undefined
  );
  const [newClienteId, setNewClienteId] = useState<number | undefined>(
    undefined
  );
  const [newDocumentoReferencia, setNewDocumentoReferencia] = useState<
    string | undefined
  >(undefined);
  const [newUsuarioId, setNewUsuarioId] = useState<number | undefined>(
    undefined
  );

  // Set the user ID when the user object changes
  React.useEffect(() => {
    if (user?.usuario_id) {
      setNewUsuarioId(user.usuario_id);
    }
  }, [user]);

  const [newObservaciones, setNewObservaciones] = useState<string | undefined>(
    undefined
  );

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if (isError) console.error(isError);
  }, [isError]);

  const handleCreateMovimiento = async () => {
    const newMovimiento: MovimientoAnimalBase = {
      animal_id: newAnimalId,
      tipo_movimiento: newTipoMovimiento,
      origen_ubicacion_id: newOrigenUbicacionId,
      destino_ubicacion_id: newDestinoUbicacionId,
      origen_lote_id: newOrigenLoteId,
      destino_lote_id: newDestinoLoteId,
      proveedor_id: newProveedorId,
      cliente_id: newClienteId,
      documento_referencia: newDocumentoReferencia,
      usuario_id: newUsuarioId,
      observaciones: newObservaciones,
    };
    try {
      await createMovimientoAnimal(newMovimiento);
      setAlertMessage("Movimiento creado con éxito.");
      setAlertType("success");
      setIsCreateDialogOpen(false);
      refresh();
    } catch (err) {
      setAlertMessage("Error al crear el movimiento.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const handleEditMovimiento = (movimiento: MovimientoAnimal) => {
    setSelectedMovimiento(movimiento);
    setNewAnimalId(movimiento.animal_id);
    setNewTipoMovimiento(movimiento.tipo_movimiento);
    setNewOrigenUbicacionId(movimiento.origen_ubicacion_id);
    setNewDestinoUbicacionId(movimiento.destino_ubicacion_id);
    setNewOrigenLoteId(movimiento.origen_lote_id);
    setNewDestinoLoteId(movimiento.destino_lote_id);
    setNewProveedorId(movimiento.proveedor_id);
    setNewClienteId(movimiento.cliente_id);
    setNewDocumentoReferencia(movimiento.documento_referencia);
    setNewUsuarioId(movimiento.usuario_id);
    setNewObservaciones(movimiento.observaciones);
    setIsEditDialogOpen(true);
  };

  const handleUpdateMovimiento = async () => {
    if (selectedMovimiento) {
      const updatedMovimiento: Partial<MovimientoAnimalBase> = {
        animal_id: newAnimalId,
        tipo_movimiento: newTipoMovimiento,
        origen_ubicacion_id: newOrigenUbicacionId,
        destino_ubicacion_id: newDestinoUbicacionId,
        origen_lote_id: newOrigenLoteId,
        destino_lote_id: newDestinoLoteId,
        proveedor_id: newProveedorId,
        cliente_id: newClienteId,
        documento_referencia: newDocumentoReferencia,
        usuario_id: newUsuarioId,
        observaciones: newObservaciones,
      };
      try {
        await updateMovimientoAnimal(
          selectedMovimiento.movimiento_id,
          updatedMovimiento
        );
        setAlertMessage("Movimiento actualizado con éxito.");
        setAlertType("success");
        setIsEditDialogOpen(false);
        refresh();
      } catch (err) {
        setAlertMessage("Error al actualizar el movimiento.");
        setAlertType("error");
      }
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
    }
  };

  const handleDeleteMovimiento = async (movimientoId: number) => {
    try {
      await deleteMovimientoAnimal(movimientoId);
      setAlertMessage("Movimiento eliminado con éxito.");
      setAlertType("success");
      refresh();
    } catch (err) {
      setAlertMessage("Error al eliminar el movimiento.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const handleOpenDetailsDialog = (movimiento: MovimientoAnimal) => {
    setSelectedMovimiento(movimiento);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setSelectedMovimiento(null);
    setIsDetailsDialogOpen(false);
  };

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar movimientos</div>;

  return (
    <div className="flex h-screen flex-col">
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
            <h1 className="text-2xl font-bold">Lista de Movimientos</h1>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Crear Nuevo Movimiento
            </Button>
          </header>
          <Separator className="my-4" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Animal ID</TableHead>
                <TableHead>Tipo Movimiento</TableHead>

                <TableHead className="hidden lg:table-cell">
                  Proveedor ID
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  Cliente ID
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Documento Referencia
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Usuario ID
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Observaciones
                </TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movimientos?.map((m) => (
                <TableRow key={m.movimiento_id}>
                  <TableCell className="font-medium">{m.animal_id}</TableCell>
                  <TableCell className="">{m.tipo_movimiento}</TableCell>

                  <TableCell className="hidden lg:table-cell">
                    {m.proveedor_id}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {m.cliente_id}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {m.documento_referencia}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {m.usuario_id}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {m.observaciones}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenDetailsDialog(m)}
                      className="mr-2"
                    >
                      <Eye />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditMovimiento(m)}
                    >
                      <Pencil></Pencil>
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteMovimiento(m.movimiento_id)}
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
            <DialogTitle>Crear Nuevo Movimiento</DialogTitle>
            <DialogDescription>
              Ingresa los detalles del nuevo movimiento.
            </DialogDescription>
          </DialogHeader>
          <div
            className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2  gap-4 py-4 max-h-96 overflow-y-auto"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#fff #09090b" }}
          >
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="animalId" className="text-right ">
                Animal
              </Label>
              <div className="col-span-3">
                <AnimalCombobox
                  value={newAnimalId}
                  onChange={(value) => setNewAnimalId(Number(value))}
                  label="Animal"
                ></AnimalCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipoMovimiento" className="text-right ">
                Tipo Movimiento
              </Label>
              <div className="col-span-3">
                <Select
                  value={newTipoMovimiento}
                  onValueChange={(e) =>
                    setNewTipoMovimiento(e as TipoMovimiento)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar Sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(TipoMovimiento).map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo.replace(/([A-Z])/g, " $1").trim()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* ... (Inputs para otros campos: origen_ubicacion_id, destino_ubicacion_id, etc.) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="origenUbicacionId" className="text-right ">
                Origen Ubicación
              </Label>
              <div className="col-span-3">
                <UbicacionCombobox
                  value={newOrigenUbicacionId ?? null}
                  onChange={(value) => setNewOrigenUbicacionId(Number(value))}
                  label="Ubicación de Origen"
                ></UbicacionCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="destinoUbicacionId" className="text-right ">
                Destino Ubicación
              </Label>
              <div className="col-span-3">
                <UbicacionCombobox
                  value={newDestinoUbicacionId ?? null}
                  onChange={(value) => setNewDestinoUbicacionId(Number(value))}
                  label="Ubicación de Destino"
                ></UbicacionCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="origenLoteId" className="text-right ">
                Origen Lote
              </Label>
              <div className="col-span-3">
                <LoteCombobox
                  label="Lote de Origen"
                  value={newOrigenLoteId ?? null}
                  onChange={(value) => setNewOrigenLoteId(Number(value))}
                ></LoteCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="destinoLoteId" className="text-right ">
                Destino Lote
              </Label>
              <div className="col-span-3">
                <LoteCombobox
                  label="Lote de Destino"
                  value={newDestinoLoteId ?? null}
                  onChange={(value) => setNewDestinoLoteId(Number(value))}
                ></LoteCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proveedorId" className="text-right ">
                Proveedor
              </Label>
              <div className="col-span-3">
                <ProveedorCombobox
                  value={newProveedorId ?? null}
                  onChange={(value) => setNewProveedorId(Number(value))}
                  label="Proveedor"
                ></ProveedorCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clienteId" className="text-right">
                Cliente
              </Label>
              <div className="col-span-3">
                <ClienteCombobox
                  value={newClienteId ?? undefined}
                  onChange={(value) => setNewClienteId(Number(value))}
                  label="Cliente"
                ></ClienteCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="documentoReferencia" className="text-right ">
                Documento Referencia
              </Label>
              <div className="col-span-3">
                <Select
                  value={newDocumentoReferencia || ""}
                  onValueChange={(e) => setNewDocumentoReferencia(e)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar Documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ninguno">Ninguno</SelectItem>
                    <SelectItem value="Factura">Factura</SelectItem>
                    <SelectItem value="Recibo">Recibo</SelectItem>
                    <SelectItem value="Otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="documentoReferencia" className="text-right ">
                Usuario
              </Label>
              <div className="col-span-3">
                <Input
                  id="usuarioId"
                  value={user?.nombre || ""}
                  className="w-full"
                  disabled
                />
                {user && user.usuario_id && (
                  <input
                    type="hidden"
                    value={user.usuario_id}
                    onChange={() => {}}
                  />
                )}
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
            <Button onClick={handleCreateMovimiento}>Crear Movimiento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-sm  sm:max-w-[600px] md:max-w-[750px] lg:max-w-[950px]">
          <DialogHeader>
            <DialogTitle>Editar Movimiento</DialogTitle>
            <DialogDescription>
              Edita los detalles del movimiento.
            </DialogDescription>
          </DialogHeader>
          <div
            className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2  gap-4 py-4 max-h-96 overflow-y-auto"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#fff #09090b" }}
          >
            {/* ... (Inputs para editar los campos, similar al diálogo de creación) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="animalId" className="text-right">
                Animal
              </Label>
              <div className="col-span-3">
                <AnimalCombobox
                  value={newAnimalId}
                  onChange={(value) => setNewAnimalId(Number(value))}
                  label="Animal"
                ></AnimalCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipoMovimiento" className="text-right">
                Tipo Movimiento
              </Label>
              <div className="col-span-3">
                <Select
                  value={newTipoMovimiento}
                  onValueChange={(e) =>
                    setNewTipoMovimiento(e as TipoMovimiento)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar Sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(TipoMovimiento).map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo.replace(/([A-Z])/g, " $1").trim()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="origenUbicacionId" className="text-right">
                Origen Ubicación ID
              </Label>
              <div className="col-span-3">
                <UbicacionCombobox
                  value={newOrigenUbicacionId ?? null}
                  onChange={(value) => setNewOrigenUbicacionId(Number(value))}
                  label="Ubicación de Origen"
                ></UbicacionCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="destinoUbicacionId" className="text-right">
                Destino Ubicación ID
              </Label>
              <div className="col-span-3">
                <UbicacionCombobox
                  value={newDestinoUbicacionId ?? null}
                  onChange={(value) => setNewDestinoUbicacionId(Number(value))}
                  label="Ubicación de Destino"
                ></UbicacionCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="origenLoteId" className="text-right">
                Origen Lote ID
              </Label>
              <div className="col-span-3">
                <LoteCombobox
                  label="Lote de Origen"
                  value={newOrigenLoteId ?? null}
                  onChange={(value) => setNewOrigenLoteId(Number(value))}
                ></LoteCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="destinoLoteId" className="text-right">
                Destino Lote ID
              </Label>
              <div className="col-span-3">
                <LoteCombobox
                  label="Lote de Destino"
                  value={newDestinoLoteId ?? null}
                  onChange={(value) => setNewDestinoLoteId(Number(value))}
                ></LoteCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proveedorId" className="text-right">
                Proveedor ID
              </Label>
              <div className="col-span-3">
                <ProveedorCombobox
                  value={newProveedorId ?? null}
                  onChange={(value) => setNewProveedorId(Number(value))}
                  label="Proveedor"
                ></ProveedorCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clienteId" className="text-right">
                Cliente ID
              </Label>
              <div className="col-span-3">
                <ClienteCombobox
                  value={newClienteId ?? undefined}
                  onChange={(value) => setNewClienteId(Number(value))}
                  label="Cliente"
                ></ClienteCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="documentoReferencia" className="text-right">
                Documento Referencia
              </Label>
              <div className="col-span-3">
                <Select
                  value={newDocumentoReferencia || ""}
                  onValueChange={(e) => setNewDocumentoReferencia(e)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar Documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ninguno">Ninguno</SelectItem>
                    <SelectItem value="Factura">Factura</SelectItem>
                    <SelectItem value="Recibo">Recibo</SelectItem>
                    <SelectItem value="Otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="usuarioId" className="text-right">
                Usuario ID
              </Label>
              <div className="col-span-3">
                <Input
                  id="usuarioId"
                  value={user?.nombre || ""}
                  className="w-full"
                  disabled
                />
                {user && user.usuario_id && (
                  <input
                    type="hidden"
                    value={user.usuario_id}
                    onChange={() => {}}
                  />
                )}
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
            <Button onClick={handleUpdateMovimiento}>
              Actualizar Movimiento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detalles del Movimiento</DialogTitle>
            <DialogDescription>
              Información detallada del movimiento seleccionado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedMovimiento && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">ID Movimiento:</Label>
                    <p>{selectedMovimiento.movimiento_id}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Animal ID:</Label>
                    <p>{selectedMovimiento.animal_id}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Tipo Movimiento:</Label>
                    <p>{selectedMovimiento.tipo_movimiento}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">
                      Origen Ubicación ID:
                    </Label>
                    <p>{selectedMovimiento.origen_ubicacion_id ?? "N/A"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">
                      Destino Ubicación ID:
                    </Label>
                    <p>{selectedMovimiento.destino_ubicacion_id ?? "N/A"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Origen Lote ID:</Label>
                    <p>{selectedMovimiento.origen_lote_id ?? "N/A"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Destino Lote ID:</Label>
                    <p>{selectedMovimiento.destino_lote_id ?? "N/A"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Proveedor ID:</Label>
                    <p>{selectedMovimiento.proveedor_id ?? "N/A"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Cliente ID:</Label>
                    <p>{selectedMovimiento.cliente_id ?? "N/A"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">
                      Documento Referencia:
                    </Label>
                    <p>{selectedMovimiento.documento_referencia ?? "N/A"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Usuario ID:</Label>
                    <p>{selectedMovimiento.usuario_id ?? "N/A"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Observaciones:</Label>
                    <p>{selectedMovimiento.observaciones ?? "N/A"}</p>
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
