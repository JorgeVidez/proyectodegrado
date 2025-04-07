"use client";

import React, { useState } from "react";
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
import useRoles from "@/hooks/useRoles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function Welcome() {
  const { roles, loading, error, createRol, updateRol, deleteRol } =
    useRoles();
  const [newRolName, setNewRolName] = useState("");
  const [newRolDescription, setNewRolDescription] = useState("");
  const [updateRolDescription, setUpdateRolDescription] = useState("");
  const [updateRolId, setUpdateRolId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleCreateRol = async () => {
    const newRol = { nombre_rol: newRolName, descripcion: newRolDescription };
    const createdRol = await createRol(newRol);
    if (createdRol) {
      alert("Rol Creado");
      setIsDialogOpen(false);
      setNewRolName("");
      setNewRolDescription("");
    } else {
      alert("Error al crear el rol");
    }
  };

  const handleUpdateRol = async () => {
    if (updateRolId) {
      const updatedRol = await updateRol(updateRolId, {
        descripcion: updateRolDescription,
      });
      if (updatedRol) {
        alert("Rol Actualizado");
        setIsEditDialogOpen(false);
        setUpdateRolId(null);
        setUpdateRolDescription("");
      } else {
        alert("Error al actualizar el rol");
      }
    }
  };

  const handleDeleteRol = async (id: number) => {
    const deleted = await deleteRol(id);
    if (deleted) {
      alert("Rol Eliminado");
    } else {
      alert("Error al eliminar el rol");
    }
  };

  if (loading) {
    return <div>Cargando roles...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Administracion</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Gestion de Roles</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className=" gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {roles &&
            roles.map((rol) => (
              <Card key={rol.rol_id}>
                <CardHeader>
                  <CardTitle>{rol.nombre_rol}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className=" truncate">{rol.descripcion}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteRol(rol.rol_id)}
                    >
                      Eliminar
                    </Button>
                    <Button onClick={() => {
                      setUpdateRolId(rol.rol_id);
                      setUpdateRolDescription(rol.descripcion || '');
                      setIsEditDialogOpen(true);
                    }}>Editar</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        <Button onClick={() => setIsDialogOpen(true)}>Crear Nuevo Rol</Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Rol</DialogTitle>
              <DialogDescription>
                Ingresa los detalles del nuevo rol.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={newRolName}
                  onChange={(e) => setNewRolName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descripción
                </Label>
                <Input
                  id="description"
                  value={newRolDescription}
                  onChange={(e) => setNewRolDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateRol}>Crear Rol</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Actualizar Rol</DialogTitle>
              <DialogDescription>
                Actualiza la descripción del rol.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Nueva Descripción
                </Label>
                <Input
                  id="description"
                  value={updateRolDescription}
                  onChange={(e) => setUpdateRolDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateRol}>Actualizar Rol</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}