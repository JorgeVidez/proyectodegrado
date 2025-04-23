"use client";

import { useInventarioAnimal } from "@/hooks/useInventarioAnimal";
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
import {
  MotivoIngreso,
  MotivoEgreso,
  InventarioAnimalCreate,
  InventarioAnimalUpdate,
  InventarioAnimalOut,
} from "@/types/inventarioAnimal";
import { Pencil, Trash2 } from "lucide-react";

export default function ListaInventarioAnimales() {
  const {
    inventarios,
    isLoading,
    error,
    createInventario,
    updateInventario,
    deleteInventario,
  } = useInventarioAnimal();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedInventario, setSelectedInventario] =
    useState<InventarioAnimalOut | null>(null);

  const [newAnimalId, setNewAnimalId] = useState<number>(0);
  const [newFechaIngreso, setNewFechaIngreso] = useState("");
  const [newMotivoIngreso, setNewMotivoIngreso] = useState<MotivoIngreso>(
    MotivoIngreso.Nacimiento
  );
  const [newProveedorCompraId, setNewProveedorCompraId] = useState<
    number | null
  >(null);
  const [newPrecioCompra, setNewPrecioCompra] = useState<number | null>(null);
  const [newUbicacionActualId, setNewUbicacionActualId] = useState<
    number | null
  >(null);
  const [newLoteActualId, setNewLoteActualId] = useState<number | null>(null);
  const [newFechaEgreso, setNewFechaEgreso] = useState<string | null>(null);
  const [newMotivoEgreso, setNewMotivoEgreso] = useState<MotivoEgreso | null>(
    null
  );

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  const handleCreateInventario = async () => {
    const newInventario: InventarioAnimalCreate = {
      animal_id: newAnimalId,
      fecha_ingreso: newFechaIngreso,
      motivo_ingreso: newMotivoIngreso,
      proveedor_compra_id: newProveedorCompraId,
      precio_compra: newPrecioCompra,
      ubicacion_actual_id: newUbicacionActualId,
      lote_actual_id: newLoteActualId,
      fecha_egreso: newFechaEgreso,
      motivo_egreso: newMotivoEgreso,
    };
    const success = await createInventario(newInventario);
    if (success !== undefined) {
      setAlertMessage("Inventario creado con éxito.");
      setAlertType("success");
      setIsCreateDialogOpen(false);
      setNewAnimalId(0);
      setNewFechaIngreso("");
      setNewMotivoIngreso(MotivoIngreso.Nacimiento);
    } else {
      setAlertMessage("Error al crear el inventario.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const handleEditInventario = (inventario: InventarioAnimalOut) => {
    setSelectedInventario(inventario);
    setNewAnimalId(inventario.animal_id);
    setNewFechaIngreso(inventario.fecha_ingreso);
    setNewMotivoIngreso(inventario.motivo_ingreso);
    setNewProveedorCompraId(inventario.proveedor_compra_id ?? null);
    setNewPrecioCompra(inventario.precio_compra ?? null);
    setNewUbicacionActualId(inventario.ubicacion_actual_id ?? null);
    setNewLoteActualId(inventario.lote_actual_id ?? null);
    setNewFechaEgreso(inventario.fecha_egreso ?? null);
    setNewMotivoEgreso(inventario.motivo_egreso ?? null);
    setIsEditDialogOpen(true);
  };

  const handleUpdateInventario = async () => {
    if (selectedInventario) {
      const updatedInventario: InventarioAnimalUpdate = {
        animal_id: newAnimalId,
        fecha_ingreso: newFechaIngreso,
        motivo_ingreso: newMotivoIngreso,
        proveedor_compra_id: newProveedorCompraId,
        precio_compra: newPrecioCompra,
        ubicacion_actual_id: newUbicacionActualId,
        lote_actual_id: newLoteActualId,
        fecha_egreso: newFechaEgreso,
        motivo_egreso: newMotivoEgreso,
      };
      const success = await updateInventario(
        selectedInventario.inventario_id,
        updatedInventario
      );
      if (success !== undefined) {
        setAlertMessage("Inventario actualizado con éxito.");
        setAlertType("success");
        setIsEditDialogOpen(false);
        setSelectedInventario(null);
      } else {
        setAlertMessage("Error al actualizar el inventario.");
        setAlertType("error");
      }
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
    }
  };

  const handleDeleteInventario = async (inventarioId: number) => {
    const success = await deleteInventario(inventarioId);
    if (success !== undefined) {
      setAlertMessage("Inventario eliminado con éxito.");
      setAlertType("success");
    } else {
      setAlertMessage("Error al eliminar el inventario.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar inventarios</div>;

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Animales </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Inventario</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
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
            <h1 className="text-2xl font-bold">Lista de Inventario</h1>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Crear Nuevo Inventario
            </Button>
          </header>
          <Separator className="my-4" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Animal ID</TableHead>
                <TableHead>Fecha Ingreso</TableHead>
                <TableHead>Motivo Ingreso</TableHead>
                <TableHead>Proveedor Compra ID</TableHead>
                <TableHead>Precio Compra</TableHead>
                <TableHead>Ubicación Actual ID</TableHead>
                <TableHead>Lote Actual ID</TableHead>
                <TableHead>Fecha Egreso</TableHead>
                <TableHead>Motivo Egreso</TableHead>
                <TableHead>Activo en Finca</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventarios?.map((i) => (
                <TableRow key={i.inventario_id}>
                  <TableCell className="font-medium">{i.animal_id}</TableCell>
                  <TableCell className="">{i.fecha_ingreso}</TableCell>
                  <TableCell className="">{i.motivo_ingreso}</TableCell>
                  <TableCell className="">{i.proveedor_compra_id}</TableCell>
                  <TableCell className="">{i.precio_compra}</TableCell>
                  <TableCell className="">{i.ubicacion_actual_id}</TableCell>
                  <TableCell className="">{i.lote_actual_id}</TableCell>
                  <TableCell className="">{i.fecha_egreso}</TableCell>
                  <TableCell className="">{i.motivo_egreso}</TableCell>
                  <TableCell className="">
                    {i.activo_en_finca ? "Sí" : "No"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditInventario(i)}
                    >
                      <Pencil></Pencil>
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteInventario(i.inventario_id)}
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
              <DialogTitle>Crear Nuevo Inventario</DialogTitle>
              <DialogDescription>
                Ingresa los detalles del nuevo inventario.
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
                <Label htmlFor="fechaIngreso" className="text-right">
                  Fecha Ingreso
                </Label>
                <Input
                  id="fechaIngreso"
                  value={newFechaIngreso}
                  onChange={(e) => setNewFechaIngreso(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="motivoIngreso" className="text-right">
                  Motivo Ingreso
                </Label>
                <select
                  id="motivoIngreso"
                  value={newMotivoIngreso}
                  onChange={(e) =>
                    setNewMotivoIngreso(e.target.value as MotivoIngreso)
                  }
                  className="col-span-3"
                >
                  {Object.values(MotivoIngreso).map((motivo) => (
                    <option key={motivo} value={motivo}>
                      {motivo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="proveedorCompraId" className="text-right">
                  Proveedor Compra ID
                </Label>
                <Input
                  id="proveedorCompraId"
                  value={newProveedorCompraId?.toString() || ""}
                  onChange={(e) =>
                    setNewProveedorCompraId(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="precioCompra" className="text-right">
                  Precio Compra
                </Label>
                <Input
                  id="precioCompra"
                  value={newPrecioCompra?.toString() || ""}
                  onChange={(e) =>
                    setNewPrecioCompra(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ubicacionActualId" className="text-right">
                  Ubicación Actual ID
                </Label>
                <Input
                  id="ubicacionActualId"
                  value={newUbicacionActualId?.toString() || ""}
                  onChange={(e) =>
                    setNewUbicacionActualId(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="loteActualId" className="text-right">
                  Lote Actual ID
                </Label>
                <Input
                  id="loteActualId"
                  value={newLoteActualId?.toString() || ""}
                  onChange={(e) =>
                    setNewLoteActualId(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fechaEgreso" className="text-right">
                  Fecha Egreso
                </Label>
                <Input
                  id="fechaEgreso"
                  value={newFechaEgreso || ""}
                  onChange={(e) => setNewFechaEgreso(e.target.value || null)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="motivoEgreso" className="text-right">
                  Motivo Egreso
                </Label>
                <select
                  id="motivoEgreso"
                  value={newMotivoEgreso || ""}
                  onChange={(e) =>
                    setNewMotivoEgreso(e.target.value as MotivoEgreso | null)
                  }
                  className="col-span-3"
                >
                  <option value="">Seleccionar...</option>
                  {Object.values(MotivoEgreso).map((motivo) => (
                    <option key={motivo} value={motivo}>
                      {motivo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateInventario}>Crear Inventario</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Inventario</DialogTitle>
              <DialogDescription>
                Edita los detalles del inventario.
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
                <Label htmlFor="fechaIngreso" className="text-right">
                  Fecha Ingreso
                </Label>
                <Input
                  id="fechaIngreso"
                  value={newFechaIngreso}
                  onChange={(e) => setNewFechaIngreso(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="motivoIngreso" className="text-right">
                  Motivo Ingreso
                </Label>
                <select
                  id="motivoIngreso"
                  value={newMotivoIngreso}
                  onChange={(e) =>
                    setNewMotivoIngreso(e.target.value as MotivoIngreso)
                  }
                  className="col-span-3"
                >
                  {Object.values(MotivoIngreso).map((motivo) => (
                    <option key={motivo} value={motivo}>
                      {motivo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="proveedorCompraId" className="text-right">
                  Proveedor Compra ID
                </Label>
                <Input
                  id="proveedorCompraId"
                  value={newProveedorCompraId?.toString() || ""}
                  onChange={(e) =>
                    setNewProveedorCompraId(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="precioCompra" className="text-right">
                  Precio Compra
                </Label>
                <Input
                  id="precioCompra"
                  value={newPrecioCompra?.toString() || ""}
                  onChange={(e) =>
                    setNewPrecioCompra(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ubicacionActualId" className="text-right">
                  Ubicación Actual ID
                </Label>
                <Input
                  id="ubicacionActualId"
                  value={newUbicacionActualId?.toString() || ""}
                  onChange={(e) =>
                    setNewUbicacionActualId(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="loteActualId" className="text-right">
                  Lote Actual ID
                </Label>
                <Input
                  id="loteActualId"
                  value={newLoteActualId?.toString() || ""}
                  onChange={(e) =>
                    setNewLoteActualId(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fechaEgreso" className="text-right">
                  Fecha Egreso
                </Label>
                <Input
                  id="fechaEgreso"
                  value={newFechaEgreso || ""}
                  onChange={(e) => setNewFechaEgreso(e.target.value || null)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="motivoEgreso" className="text-right">
                  Motivo Egreso
                </Label>
                <select
                  id="motivoEgreso"
                  value={newMotivoEgreso || ""}
                  onChange={(e) =>
                    setNewMotivoEgreso(e.target.value as MotivoEgreso | null)
                  }
                  className="col-span-3"
                >
                  <option value="">Seleccionar...</option>
                  {Object.values(MotivoEgreso).map((motivo) => (
                    <option key={motivo} value={motivo}>
                      {motivo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateInventario}>
                Actualizar Inventario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
