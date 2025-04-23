"use client";

import {
  createVentaDetalle,
  deleteVentaDetalle,
  updateVentaDetalle,
  useVentasDetalle,
  VentaDetalle,
  VentaDetalleBase,
} from "@/hooks/useVentasDetalle";
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

export default function ListaVentasDetalle() {
  const { ventasDetalle, isLoading, isError, refresh } = useVentasDetalle();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedVentaDetalle, setSelectedVentaDetalle] =
    useState<VentaDetalle | null>(null);

  const [newVentaId, setNewVentaId] = useState<number>(0);
  const [newAnimalId, setNewAnimalId] = useState<number>(0);
  const [newPesoVentaKg, setNewPesoVentaKg] = useState<number | undefined>(
    undefined
  );
  const [newPrecioIndividual, setNewPrecioIndividual] = useState<
    number | undefined
  >(undefined);
  const [newPrecioPorKg, setNewPrecioPorKg] = useState<number | undefined>(
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

  const handleCreateVentaDetalle = async () => {
    const newVentaDetalle: VentaDetalleBase = {
      venta_id: newVentaId,
      animal_id: newAnimalId,
      peso_venta_kg: newPesoVentaKg,
      precio_individual: newPrecioIndividual,
      precio_por_kg: newPrecioPorKg,
      observaciones: newObservaciones,
    };
    try {
      await createVentaDetalle(newVentaDetalle);
      setAlertMessage("Detalle de venta creado con éxito.");
      setAlertType("success");
      setIsCreateDialogOpen(false);
      refresh();
    } catch (err) {
      setAlertMessage("Error al crear el detalle de venta.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const handleEditVentaDetalle = (ventaDetalle: VentaDetalle) => {
    setSelectedVentaDetalle(ventaDetalle);
    setNewVentaId(ventaDetalle.venta_id);
    setNewAnimalId(ventaDetalle.animal_id);
    setNewPesoVentaKg(ventaDetalle.peso_venta_kg);
    setNewPrecioIndividual(ventaDetalle.precio_individual);
    setNewPrecioPorKg(ventaDetalle.precio_por_kg);
    setNewObservaciones(ventaDetalle.observaciones);
    setIsEditDialogOpen(true);
  };

  const handleUpdateVentaDetalle = async () => {
    if (selectedVentaDetalle) {
      const updatedVentaDetalle: Partial<VentaDetalleBase> = {
        venta_id: newVentaId,
        animal_id: newAnimalId,
        peso_venta_kg: newPesoVentaKg,
        precio_individual: newPrecioIndividual,
        precio_por_kg: newPrecioPorKg,
        observaciones: newObservaciones,
      };
      try {
        await updateVentaDetalle(
          selectedVentaDetalle.venta_detalle_id,
          updatedVentaDetalle
        );
        setAlertMessage("Detalle de venta actualizado con éxito.");
        setAlertType("success");
        setIsEditDialogOpen(false);
        refresh();
      } catch (err) {
        setAlertMessage("Error al actualizar el detalle de venta.");
        setAlertType("error");
      }
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
    }
  };

  const handleDeleteVentaDetalle = async (ventaDetalleId: number) => {
    try {
      await deleteVentaDetalle(ventaDetalleId);
      setAlertMessage("Detalle de venta eliminado con éxito.");
      setAlertType("success");
      refresh();
    } catch (err) {
      setAlertMessage("Error al eliminar el detalle de venta.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar detalles de venta</div>;

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
          <h1 className="text-2xl font-bold">Lista de Detalles de Venta</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Crear Nuevo Detalle de Venta
          </Button>
        </header>
        <Separator className="my-4" />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Venta ID</TableHead>
              <TableHead>Animal ID</TableHead>
              <TableHead>Peso Venta (kg)</TableHead>
              <TableHead>Precio Individual</TableHead>
              <TableHead>Precio por kg</TableHead>
              <TableHead>Observaciones</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ventasDetalle?.map((vd) => (
              <TableRow key={vd.venta_detalle_id}>
                <TableCell className="font-medium">{vd.venta_id}</TableCell>
                <TableCell className="">{vd.animal_id}</TableCell>
                <TableCell className="">{vd.peso_venta_kg}</TableCell>
                <TableCell className="">{vd.precio_individual}</TableCell>
                <TableCell className="">{vd.precio_por_kg}</TableCell>
                <TableCell className="">{vd.observaciones}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditVentaDetalle(vd)}
                  >
                    <Pencil></Pencil>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() =>
                      handleDeleteVentaDetalle(vd.venta_detalle_id)
                    }
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
            <DialogTitle>Crear Nuevo Detalle de Venta</DialogTitle>
            <DialogDescription>
              Ingresa los detalles del nuevo detalle de venta.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ventaId" className="text-right">
                Venta ID
              </Label>
              <Input
                id="ventaId"
                value={newVentaId.toString()}
                onChange={(e) => setNewVentaId(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
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
              <Label htmlFor="pesoVentaKg" className="text-right">
                Peso Venta (kg)
              </Label>
              <Input
                id="pesoVentaKg"
                value={newPesoVentaKg?.toString() || ""}
                onChange={(e) =>
                  setNewPesoVentaKg(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="precioIndividual" className="text-right">
                Precio Individual
              </Label>
              <Input
                id="precioIndividual"
                value={newPrecioIndividual?.toString() || ""}
                onChange={(e) =>
                  setNewPrecioIndividual(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="precioPorKg" className="text-right">
                Precio por kg
              </Label>
              <Input
                id="precioPorKg"
                value={newPrecioPorKg?.toString() || ""}
                onChange={(e) =>
                  setNewPrecioPorKg(
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
            <Button onClick={handleCreateVentaDetalle}>
              Crear Detalle de Venta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Detalle de Venta</DialogTitle>
            <DialogDescription>
              Edita los detalles del detalle de venta.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* ... (Inputs para editar los campos, similar al diálogo de creación) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ventaId" className="text-right">
                Venta ID
              </Label>
              <Input
                id="ventaId"
                value={newVentaId.toString()}
                onChange={(e) => setNewVentaId(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
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
              <Label htmlFor="pesoVentaKg" className="text-right">
                Peso Venta (kg)
              </Label>
              <Input
                id="pesoVentaKg"
                value={newPesoVentaKg?.toString() || ""}
                onChange={(e) =>
                  setNewPesoVentaKg(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="precioIndividual" className="text-right">
                Precio Individual
              </Label>
              <Input
                id="precioIndividual"
                value={newPrecioIndividual?.toString() || ""}
                onChange={(e) =>
                  setNewPrecioIndividual(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="precioPorKg" className="text-right">
                Precio por kg
              </Label>
              <Input
                id="precioPorKg"
                value={newPrecioPorKg?.toString() || ""}
                onChange={(e) =>
                  setNewPrecioPorKg(
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
            <Button onClick={handleUpdateVentaDetalle}>
              Actualizar Detalle de Venta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

