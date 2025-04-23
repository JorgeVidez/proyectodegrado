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
import { Pencil, Trash2 } from "lucide-react";

export default function ListaMovimientosAnimales() {
  const { movimientos, isLoading, isError, refresh } = useMovimientosAnimal();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar movimientos</div>;

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
              <TableHead>Origen Ubicación ID</TableHead>
              <TableHead>Destino Ubicación ID</TableHead>
              <TableHead>Origen Lote ID</TableHead>
              <TableHead>Destino Lote ID</TableHead>
              <TableHead>Proveedor ID</TableHead>
              <TableHead>Cliente ID</TableHead>
              <TableHead>Documento Referencia</TableHead>
              <TableHead>Usuario ID</TableHead>
              <TableHead>Observaciones</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movimientos?.map((m) => (
              <TableRow key={m.movimiento_id}>
                <TableCell className="font-medium">{m.animal_id}</TableCell>
                <TableCell className="">{m.tipo_movimiento}</TableCell>
                <TableCell className="">{m.origen_ubicacion_id}</TableCell>
                <TableCell className="">{m.destino_ubicacion_id}</TableCell>
                <TableCell className="">{m.origen_lote_id}</TableCell>
                <TableCell className="">{m.destino_lote_id}</TableCell>
                <TableCell className="">{m.proveedor_id}</TableCell>
                <TableCell className="">{m.cliente_id}</TableCell>
                <TableCell className="">{m.documento_referencia}</TableCell>
                <TableCell className="">{m.usuario_id}</TableCell>
                <TableCell className="">{m.observaciones}</TableCell>
                <TableCell>
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

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Movimiento</DialogTitle>
            <DialogDescription>
              Ingresa los detalles del nuevo movimiento.
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
              <Label htmlFor="tipoMovimiento" className="text-right">
                Tipo Movimiento
              </Label>
              <select
                id="tipoMovimiento"
                value={newTipoMovimiento}
                onChange={(e) =>
                  setNewTipoMovimiento(e.target.value as TipoMovimiento)
                }
                className="col-span-3"
              >
                {Object.values(TipoMovimiento).map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
            {/* ... (Inputs para otros campos: origen_ubicacion_id, destino_ubicacion_id, etc.) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="origenUbicacionId" className="text-right">
                Origen Ubicación ID
              </Label>
              <Input
                id="origenUbicacionId"
                value={newOrigenUbicacionId?.toString() || ""}
                onChange={(e) =>
                  setNewOrigenUbicacionId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="destinoUbicacionId" className="text-right">
                Destino Ubicación ID
              </Label>
              <Input
                id="destinoUbicacionId"
                value={newDestinoUbicacionId?.toString() || ""}
                onChange={(e) =>
                  setNewDestinoUbicacionId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="origenLoteId" className="text-right">
                Origen Lote ID
              </Label>
              <Input
                id="origenLoteId"
                value={newOrigenLoteId?.toString() || ""}
                onChange={(e) =>
                  setNewOrigenLoteId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="destinoLoteId" className="text-right">
                Destino Lote ID
              </Label>
              <Input
                id="destinoLoteId"
                value={newDestinoLoteId?.toString() || ""}
                onChange={(e) =>
                  setNewDestinoLoteId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proveedorId" className="text-right">
                Proveedor ID
              </Label>
              <Input
                id="proveedorId"
                value={newProveedorId?.toString() || ""}
                onChange={(e) =>
                  setNewProveedorId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clienteId" className="text-right">
                Cliente ID
              </Label>
              <Input
                id="clienteId"
                value={newClienteId?.toString() || ""}
                onChange={(e) =>
                  setNewClienteId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="documentoReferencia" className="text-right">
                Documento Referencia
              </Label>
              <Input
                id="documentoReferencia"
                value={newDocumentoReferencia || ""}
                onChange={(e) => setNewDocumentoReferencia(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="usuarioId" className="text-right">
                Usuario ID
              </Label>
              <Input
                id="usuarioId"
                value={newUsuarioId?.toString() || ""}
                onChange={(e) =>
                  setNewUsuarioId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
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
            <Button onClick={handleCreateMovimiento}>Crear Movimiento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Movimiento</DialogTitle>
            <DialogDescription>
              Edita los detalles del movimiento.
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
              <Label htmlFor="tipoMovimiento" className="text-right">
                Tipo Movimiento
              </Label>
              <select
                id="tipoMovimiento"
                value={newTipoMovimiento}
                onChange={(e) =>
                  setNewTipoMovimiento(e.target.value as TipoMovimiento)
                }
                className="col-span-3"
              >
                {Object.values(TipoMovimiento).map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="origenUbicacionId" className="text-right">
                Origen Ubicación ID
              </Label>
              <Input
                id="origenUbicacionId"
                value={newOrigenUbicacionId?.toString() || ""}
                onChange={(e) =>
                  setNewOrigenUbicacionId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="destinoUbicacionId" className="text-right">
                Destino Ubicación ID
              </Label>
              <Input
                id="destinoUbicacionId"
                value={newDestinoUbicacionId?.toString() || ""}
                onChange={(e) =>
                  setNewDestinoUbicacionId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="origenLoteId" className="text-right">
                Origen Lote ID
              </Label>
              <Input
                id="origenLoteId"
                value={newOrigenLoteId?.toString() || ""}
                onChange={(e) =>
                  setNewOrigenLoteId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="destinoLoteId" className="text-right">
                Destino Lote ID
              </Label>
              <Input
                id="destinoLoteId"
                value={newDestinoLoteId?.toString() || ""}
                onChange={(e) =>
                  setNewDestinoLoteId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proveedorId" className="text-right">
                Proveedor ID
              </Label>
              <Input
                id="proveedorId"
                value={newProveedorId?.toString() || ""}
                onChange={(e) =>
                  setNewProveedorId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clienteId" className="text-right">
                Cliente ID
              </Label>
              <Input
                id="clienteId"
                value={newClienteId?.toString() || ""}
                onChange={(e) =>
                  setNewClienteId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="documentoReferencia" className="text-right">
                Documento Referencia
              </Label>
              <Input
                id="documentoReferencia"
                value={newDocumentoReferencia || ""}
                onChange={(e) => setNewDocumentoReferencia(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="usuarioId" className="text-right">
                Usuario ID
              </Label>
              <Input
                id="usuarioId"
                value={newUsuarioId?.toString() || ""}
                onChange={(e) =>
                  setNewUsuarioId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
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
            <Button onClick={handleUpdateMovimiento}>
              Actualizar Movimiento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
