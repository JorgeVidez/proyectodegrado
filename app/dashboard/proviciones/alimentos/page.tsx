"use client";

import { useTipoAlimentos } from "@/hooks/useTipoAlimentos";
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

export default function ListaAlimentos() {
  const { tiposAlimento, isLoading, error, create, update, remove } =
    useTipoAlimentos();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newNombre, setNewNombre] = useState("");
  const [newDescripcion, setNewDescripcion] = useState("");
  const [newUnidadMedida, setNewUnidadMedida] = useState("");
  const [editAlimentoId, setEditAlimentoId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");
  const [editUnidadMedida, setEditUnidadMedida] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  const handleCreateAlimento = async () => {
    const newAlimento = {
      nombre: newNombre,
      descripcion: newDescripcion,
      unidad_medida: newUnidadMedida,
    };
    const createdAlimento = await create(newAlimento);
    if (createdAlimento) {
      setAlertMessage("Alimento creado con éxito.");
      setAlertType("success");
      setIsCreateDialogOpen(false);
      setNewNombre("");
      setNewDescripcion("");
      setNewUnidadMedida("");
    } else {
      setAlertMessage("Error al crear el alimento.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const handleUpdateAlimento = async () => {
    if (editAlimentoId) {
      const updatedAlimento = await update(editAlimentoId, {
        nombre: editNombre,
        descripcion: editDescripcion,
        unidad_medida: editUnidadMedida,
      });
      if (updatedAlimento) {
        setAlertMessage("Alimento actualizado con éxito.");
        setAlertType("success");
        setIsEditDialogOpen(false);
        setEditAlimentoId(null);
        setEditNombre("");
        setEditDescripcion("");
        setEditUnidadMedida("");
      } else {
        setAlertMessage("Error al actualizar el alimento.");
        setAlertType("error");
      }
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
    }
  };

  const handleDeleteAlimento = async (id: number) => {
    const deleted = await remove(id);
    if (deleted) {
      setAlertMessage("Alimento eliminado con éxito.");
      setAlertType("success");
    } else {
      setAlertMessage("Error al eliminar el alimento.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar alimentos</div>;

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Proviciones</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Tipos de Alimentos</BreadcrumbPage>
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
            <h1 className="text-2xl font-bold">Tipos de Alimentos</h1>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Crear Nuevo Alimento
            </Button>
          </header>
          <Separator className="my-4" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Unidad de Medida</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiposAlimento?.map((a) => (
                <TableRow key={a.tipo_alimento_id}>
                  <TableCell className="font-medium">{a.nombre}</TableCell>
                  <TableCell className="">{a.descripcion || "N/A"}</TableCell>
                  <TableCell className="">{a.unidad_medida || "N/A"}</TableCell>
                  <TableCell className="text-right flex flex-wrap justify-end gap-2">
                    <Button
                      className=""
                      onClick={() => {
                        setEditAlimentoId(a.tipo_alimento_id);
                        setEditNombre(a.nombre);
                        setEditDescripcion(a.descripcion || "");
                        setEditUnidadMedida(a.unidad_medida || "");
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil></Pencil>
                    </Button>
                    <Button
                      variant="destructive"
                      className=""
                      onClick={() => handleDeleteAlimento(a.tipo_alimento_id)}
                    >
                      <Trash2> </Trash2>
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
              <DialogTitle>Crear Nuevo Alimento</DialogTitle>
              <DialogDescription>
                Ingresa los detalles del nuevo alimento.
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unidadMedida" className="text-right">
                  Unidad de Medida
                </Label>
                <Input
                  id="unidadMedida"
                  value={newUnidadMedida}
                  onChange={(e) => setNewUnidadMedida(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateAlimento}>Crear Alimento</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Alimento</DialogTitle>
              <DialogDescription>
                Actualiza los detalles del alimento.
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editUnidadMedida" className="text-right">
                  Unidad de Medida
                </Label>
                <Input
                  id="editUnidadMedida"
                  value={editUnidadMedida}
                  onChange={(e) => setEditUnidadMedida(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateAlimento}>
                Actualizar Alimento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
