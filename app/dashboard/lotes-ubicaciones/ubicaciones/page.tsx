"use client";

import { useUbicaciones } from "@/hooks/useUbicaciones";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ListaUbicaciones() {
  const { ubicaciones, isLoading, error, create, update, remove } =
    useUbicaciones();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newNombre, setNewNombre] = useState("");
  const [newTipo, setNewTipo] = useState("");
  const [newAreaHectareas, setNewAreaHectareas] = useState<number | undefined>(
    undefined
  );
  const [newCapacidadMaximaAnimales, setNewCapacidadMaximaAnimales] = useState<
    number | undefined
  >(undefined);
  const [newDescripcion, setNewDescripcion] = useState("");
  const [editUbicacionId, setEditUbicacionId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editTipo, setEditTipo] = useState("");
  const [editAreaHectareas, setEditAreaHectareas] = useState<
    number | undefined
  >(undefined);
  const [editCapacidadMaximaAnimales, setEditCapacidadMaximaAnimales] =
    useState<number | undefined>(undefined);
  const [editDescripcion, setEditDescripcion] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  const handleCreateUbicacion = async () => {
    const newUbicacion = {
      nombre: newNombre,
      tipo: newTipo,
      area_hectareas: newAreaHectareas,
      capacidad_maxima_animales: newCapacidadMaximaAnimales,
      descripcion: newDescripcion,
    };
    const createdUbicacion = await create(newUbicacion);
    if (createdUbicacion) {
      setAlertMessage("Ubicación creada con éxito.");
      setAlertType("success");
      setIsCreateDialogOpen(false);
      setNewNombre("");
      setNewTipo("");
      setNewAreaHectareas(undefined);
      setNewCapacidadMaximaAnimales(undefined);
      setNewDescripcion("");
    } else {
      setAlertMessage("Error al crear la ubicación.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const handleUpdateUbicacion = async () => {
    if (editUbicacionId) {
      const updatedUbicacion = await update(editUbicacionId, {
        nombre: editNombre,
        tipo: editTipo,
        area_hectareas: editAreaHectareas,
        capacidad_maxima_animales: editCapacidadMaximaAnimales,
        descripcion: editDescripcion,
      });
      if (updatedUbicacion) {
        setAlertMessage("Ubicación actualizada con éxito.");
        setAlertType("success");
        setIsEditDialogOpen(false);
        setEditUbicacionId(null);
        setEditNombre("");
        setEditTipo("");
        setEditAreaHectareas(undefined);
        setEditCapacidadMaximaAnimales(undefined);
        setEditDescripcion("");
      } else {
        setAlertMessage("Error al actualizar la ubicación.");
        setAlertType("error");
      }
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
    }
  };

  const handleDeleteUbicacion = async (id: number) => {
    const deleted = await remove(id);
    if (deleted) {
      setAlertMessage("Ubicación eliminada con éxito.");
      setAlertType("success");
    } else {
      setAlertMessage("Error al eliminar la ubicación.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar ubicaciones</div>;

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Administración </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Ubicaciones</BreadcrumbPage>
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
            <h1 className="text-2xl font-bold">Lista de Ubicaciones</h1>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Crear Nueva Ubicación
            </Button>
          </header>
          <Separator className="my-4" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Área (Hectáreas)</TableHead>
                <TableHead>Capacidad Máxima (Animales)</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ubicaciones?.map((u) => (
                <TableRow key={u.ubicacion_id}>
                  <TableCell className="font-medium">{u.nombre}</TableCell>
                  <TableCell className="">{u.tipo || "N/A"}</TableCell>
                  <TableCell className="">
                    {u.area_hectareas || "N/A"}
                  </TableCell>
                  <TableCell className="">
                    {u.capacidad_maxima_animales || "N/A"}
                  </TableCell>
                  <TableCell className="">{u.descripcion || "N/A"}</TableCell>
                  <TableCell className="text-right flex flex-wrap justify-end gap-2">
                    <Button
                      className=""
                      onClick={() => {
                        setEditUbicacionId(u.ubicacion_id);
                        setEditNombre(u.nombre);
                        setEditTipo(u.tipo || "");
                        setEditAreaHectareas(u.area_hectareas);
                        setEditCapacidadMaximaAnimales(
                          u.capacidad_maxima_animales
                        );
                        setEditDescripcion(u.descripcion || "");
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil></Pencil>
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
              <DialogTitle>Crear Nueva Ubicación</DialogTitle>
              <DialogDescription>
                Ingresa los detalles de la nueva ubicación.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="nombre"
                  value={newNombre}
                  onChange={(e) => setNewNombre(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tipo" className="text-right">
                  Tipo
                </Label>
                <Select value={newTipo} onValueChange={setNewTipo}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Potrero">Potrero</SelectItem>
                    <SelectItem value="Corral">Corral</SelectItem>
                    <SelectItem value="Establo">Establo</SelectItem>
                    <SelectItem value="Enfermeria">Enfermeria</SelectItem>
                    <SelectItem value="Cuarentena">Cuarentena</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="areaHectareas" className="text-right">
                  Área (Hectáreas)
                </Label>
                <Input
                  id="areaHectareas"
                  type="number"
                  value={newAreaHectareas || ""}
                  onChange={(e) =>
                    setNewAreaHectareas(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacidadMaximaAnimales" className="text-right">
                  Capacidad Máxima (Animales)
                </Label>
                <Input
                  id="capacidadMaximaAnimales"
                  type="number"
                  value={newCapacidadMaximaAnimales || ""}
                  onChange={(e) =>
                    setNewCapacidadMaximaAnimales(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="descripcion" className="text-right">
                  Descripción
                </Label>
                <Input
                  id="descripcion"
                  value={newDescripcion}
                  onChange={(e) => setNewDescripcion(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateUbicacion}>Crear Ubicación</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Ubicación</DialogTitle>
              <DialogDescription>
                Actualiza los detalles de la ubicación.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editNombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="editNombre"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editTipo" className="text-right">
                  Tipo
                </Label>
                <Select value={editTipo} onValueChange={setEditTipo}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Potrero">Potrero</SelectItem>
                    <SelectItem value="Corral">Corral</SelectItem>
                    <SelectItem value="Establo">Establo</SelectItem>
                    <SelectItem value="Enfermeria">Enfermeria</SelectItem>
                    <SelectItem value="Cuarentena">Cuarentena</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editAreaHectareas" className="text-right">
                  Área (Hectáreas)
                </Label>
                <Input
                  id="editAreaHectareas"
                  type="number"
                  value={editAreaHectareas || ""}
                  onChange={(e) =>
                    setEditAreaHectareas(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="editCapacidadMaximaAnimales"
                  className="text-right"
                >
                  Capacidad Máxima (Animales)
                </Label>
                <Input
                  id="editCapacidadMaximaAnimales"
                  type="number"
                  value={editCapacidadMaximaAnimales || ""}
                  onChange={(e) =>
                    setEditCapacidadMaximaAnimales(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editDescripcion" className="text-right">
                  Descripción
                </Label>
                <Input
                  id="editDescripcion"
                  value={editDescripcion}
                  onChange={(e) => setEditDescripcion(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateUbicacion}>
                Actualizar Ubicación
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
