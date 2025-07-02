"use client";

import { useEspecies } from "@/hooks/useEspecies";
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

export default function ListaEspecies() {
  const { especies, isLoading, error, create, update, remove } = useEspecies();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newNombreComun, setNewNombreComun] = useState("");
  const [newNombreCientifico, setNewNombreCientifico] = useState("");
  const [editEspecieId, setEditEspecieId] = useState<number | null>(null);
  const [editNombreComun, setEditNombreComun] = useState("");
  const [editNombreCientifico, setEditNombreCientifico] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  const handleCreateEspecie = async () => {
    const newEspecie = {
      nombre_comun: newNombreComun,
      nombre_cientifico: newNombreCientifico,
    };
    const createdEspecie = await create(newEspecie);
    if (createdEspecie) {
      setAlertMessage("Especie creada con éxito.");
      setAlertType("success");
      setIsCreateDialogOpen(false);
      setNewNombreComun("");
      setNewNombreCientifico("");
    } else {
      setAlertMessage("Error al crear la especie.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const handleUpdateEspecie = async () => {
    if (editEspecieId) {
      const updatedEspecie = await update(editEspecieId, {
        nombre_comun: editNombreComun,
        nombre_cientifico: editNombreCientifico,
      });
      if (updatedEspecie) {
        setAlertMessage("Especie actualizada con éxito.");
        setAlertType("success");
        setIsEditDialogOpen(false);
        setEditEspecieId(null);
        setEditNombreComun("");
        setEditNombreCientifico("");
      } else {
        setAlertMessage("Error al actualizar la especie.");
        setAlertType("error");
      }
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
    }
  };

  const handleDeleteEspecie = async (id: number) => {
    const deleted = await remove(id);
    if (deleted) {
      setAlertMessage("Especie eliminada con éxito.");
      setAlertType("success");
    } else {
      setAlertMessage("Error al eliminar la especie.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar especies</div>;

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
                <BreadcrumbPage>Especies</BreadcrumbPage>
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
            <h1 className="text-2xl font-bold">Lista de Especies</h1>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Crear Nueva Especie
            </Button>
          </header>

          <Separator className="my-4" />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Nombre Común</TableHead>
                <TableHead>Nombre Científico</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {especies?.map((e) => (
                <TableRow key={e.especie_id}>
                  <TableCell className="font-medium">
                    {e.nombre_comun}
                  </TableCell>
                  <TableCell className="">
                    {e.nombre_cientifico ? e.nombre_cientifico : "N/A"}
                  </TableCell>
                  <TableCell className="text-right flex flex-wrap justify-end gap-2">
                    <Button
                      className=""
                      onClick={() => {
                        setEditEspecieId(e.especie_id);
                        setEditNombreComun(e.nombre_comun);
                        setEditNombreCientifico(e.nombre_cientifico || "");
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
              <DialogTitle>Crear Nueva Especie</DialogTitle>
              <DialogDescription>
                Ingresa los detalles de la nueva especie.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombreComun" className="text-right">
                  Nombre Común
                </Label>
                <Input
                  id="nombreComun"
                  value={newNombreComun}
                  onChange={(e) => setNewNombreComun(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombreCientifico" className="text-right">
                  Nombre Científico
                </Label>
                <Input
                  id="nombreCientifico"
                  value={newNombreCientifico}
                  onChange={(e) => setNewNombreCientifico(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateEspecie}>Crear Especie</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Especie</DialogTitle>
              <DialogDescription>
                Actualiza los detalles de la especie.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editNombreComun" className="text-right">
                  Nombre Común
                </Label>
                <Input
                  id="editNombreComun"
                  value={editNombreComun}
                  onChange={(e) => setEditNombreComun(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editNombreCientifico" className="text-right">
                  Nombre Científico
                </Label>
                <Input
                  id="editNombreCientifico"
                  value={editNombreCientifico}
                  onChange={(e) => setEditNombreCientifico(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateEspecie}>Actualizar Especie</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
