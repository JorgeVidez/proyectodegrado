"use client";

import { useRazas } from "@/hooks/useRazas";
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
  TableFooter,
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
import { SelectionEspecie } from "@/components/SelectionEspecie"

export default function ListaRazas() {
  const { razas, isLoading, error, create, update, remove } = useRazas();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newEspecieId, setNewEspecieId] = useState<number>(0);
  const [newNombreRaza, setNewNombreRaza] = useState("");
  const [editRazaId, setEditRazaId] = useState<number | null>(null);
  const [editEspecieId, setEditEspecieId] = useState<number>(0);
  const [editNombreRaza, setEditNombreRaza] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentEspecie, setCurrentEspecie] = useState(""); // Nuevo estado para la especie seleccionada
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  const handleCreateRaza = async () => {
    const newRaza = {
      especie_id: newEspecieId,
      nombre_raza: newNombreRaza,
    };
    const createdRaza = await create(newRaza);
    if (createdRaza) {
      setAlertMessage("Raza creada con éxito.");
      setAlertType("success");
      setIsCreateDialogOpen(false);
      setNewEspecieId(0);
      setNewNombreRaza("");
    } else {
      setAlertMessage("Error al crear la raza.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const handleUpdateRaza = async () => {
    if (editRazaId) {
      const updatedRaza = await update(editRazaId, {
        especie_id: editEspecieId,
        nombre_raza: editNombreRaza,
      });
      if (updatedRaza) {
        setAlertMessage("Raza actualizada con éxito.");
        setAlertType("success");
        setIsEditDialogOpen(false);
        setEditRazaId(null);
        setEditEspecieId(0);
        setEditNombreRaza("");
      } else {
        setAlertMessage("Error al actualizar la raza.");
        setAlertType("error");
      }
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
    }
  };

  const handleDeleteRaza = async (id: number) => {
    const deleted = await remove(id);
    if (deleted) {
      setAlertMessage("Raza eliminada con éxito.");
      setAlertType("success");
    } else {
      setAlertMessage("Error al eliminar la raza.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const filteredRazas = (razas ?? []).filter((r) => {
    const especieMatch = currentEspecie === "all" ? true : r.especie_id.toString() === currentEspecie;
    const searchMatch = r.especie.nombre_comun.toLowerCase().includes(searchTerm.toLowerCase());
    return especieMatch && searchMatch;
  });
  
  const totalPages = Math.ceil(filteredRazas.length / itemsPerPage);
  const paginatedRazas = filteredRazas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar razas</div>;

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
                <BreadcrumbPage>Razas</BreadcrumbPage>
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
          <header className="flex flex-wrap items-center justify-between p-2">
            <h1 className="text-2xl font-bold">Lista de Razas</h1>
            <div className="flex items-center gap-2">
               
            <SelectionEspecie value={currentEspecie} onChange={(value: React.SetStateAction<string>)=> setCurrentEspecie(value)} />

              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Crear Nueva Raza
              </Button>
            </div>
          </header>
          <Separator className="my-4" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Especie</TableHead>
                <TableHead>Nombre Raza</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRazas.map((r) => (
                <TableRow key={r.raza_id}>
                  <TableCell className="font-medium truncate">
                    {r.especie.nombre_comun}
                  </TableCell>
                  <TableCell className="">{r.nombre_raza}</TableCell>
                  <TableCell className="text-right flex flex-wrap justify-end gap-2">
                    <Button
                      className=""
                      onClick={() => {
                        setEditRazaId(r.raza_id);
                        setEditEspecieId(r.especie_id);
                        setEditNombreRaza(r.nombre_raza);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil></Pencil>
                    </Button>
                    <Button
                      variant="destructive"
                      className=""
                      onClick={() => handleDeleteRaza(r.raza_id)}
                    >
                      <Trash2> </Trash2>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
             
          </Table>
          <div className="flex justify-center items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  >
                    Anterior
                  </Button>
                  <span>
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  >
                    Siguiente
                  </Button>
                </div>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nueva Raza</DialogTitle>
              <DialogDescription>
                Ingresa los detalles de la nueva raza.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="especieId" className="text-right">
                  Especie
                </Label>
                <SelectionEspecie value={newEspecieId} onChange={(value: React.SetStateAction<number>) => setNewEspecieId(value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombreRaza" className="text-right">
                  Nombre Raza
                </Label>
                <Input
                  id="nombreRaza"
                  value={newNombreRaza}
                  onChange={(e) => setNewNombreRaza(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateRaza}>Crear Raza</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Raza</DialogTitle>
              <DialogDescription>
                Actualiza los detalles de la raza.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editEspecieId" className="text-right">
                  Especie
                </Label>
                <SelectionEspecie value={editEspecieId} onChange={(value: React.SetStateAction<number>) => setEditEspecieId(value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editNombreRaza" className="text-right">
                  Nombre Raza
                </Label>
                <Input
                  id="editNombreRaza"
                  value={editNombreRaza}
                  onChange={(e) => setEditNombreRaza(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateRaza}>Actualizar Raza</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
