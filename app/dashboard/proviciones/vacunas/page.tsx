"use client";

import { useTipoVacunas } from "@/hooks/useTipoVacunas";
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
import { SelectionEspecie } from "@/components/SelectionEspecie";

export default function ListaVacunas() {
  const { tiposVacuna, isLoading, error, create, update, remove } =
    useTipoVacunas();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newNombreVacuna, setNewNombreVacuna] = useState("");
  const [newEnfermedadPrevenida, setNewEnfermedadPrevenida] = useState("");
  const [newLaboratorio, setNewLaboratorio] = useState("");
  const [newEspecieDestinoId, setNewEspecieDestinoId] = useState<
    number | undefined
  >(undefined);
  const [editVacunaId, setEditVacunaId] = useState<number | null>(null);
  const [editNombreVacuna, setEditNombreVacuna] = useState("");
  const [editEnfermedadPrevenida, setEditEnfermedadPrevenida] = useState("");
  const [editLaboratorio, setEditLaboratorio] = useState("");
  const [editEspecieDestinoId, setEditEspecieDestinoId] = useState<
    number | undefined
  >(undefined);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentEspecie, setCurrentEspecie] = useState("all"); // Nuevo estado para la especie seleccionada
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  const handleCreateVacuna = async () => {
    const newVacuna = {
      nombre_vacuna: newNombreVacuna,
      enfermedad_prevenida: newEnfermedadPrevenida,
      laboratorio: newLaboratorio,
      especie_destino_id: newEspecieDestinoId,
    };
    const createdVacuna = await create(newVacuna);
    if (createdVacuna) {
      setAlertMessage("Vacuna creada con éxito.");
      setAlertType("success");
      setIsCreateDialogOpen(false);
      setNewNombreVacuna("");
      setNewEnfermedadPrevenida("");
      setNewLaboratorio("");
      setNewEspecieDestinoId(undefined);
    } else {
      setAlertMessage("Error al crear la vacuna.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const handleUpdateVacuna = async () => {
    if (editVacunaId) {
      const updatedVacuna = await update(editVacunaId, {
        nombre_vacuna: editNombreVacuna,
        enfermedad_prevenida: editEnfermedadPrevenida,
        laboratorio: editLaboratorio,
        especie_destino_id: editEspecieDestinoId,
      });
      if (updatedVacuna) {
        setAlertMessage("Vacuna actualizada con éxito.");
        setAlertType("success");
        setIsEditDialogOpen(false);
        setEditVacunaId(null);
        setEditNombreVacuna("");
        setEditEnfermedadPrevenida("");
        setEditLaboratorio("");
        setEditEspecieDestinoId(undefined);
      } else {
        setAlertMessage("Error al actualizar la vacuna.");
        setAlertType("error");
      }
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
    }
  };

  const handleDeleteVacuna = async (id: number) => {
    const deleted = await remove(id);
    if (deleted) {
      setAlertMessage("Vacuna eliminada con éxito.");
      setAlertType("success");
    } else {
      setAlertMessage("Error al eliminar la vacuna.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const filteredVacunas = (tiposVacuna ?? []).filter((v) => {
    const especieMatch =
      currentEspecie === "all"
        ? true
        : v.especie_destino_id?.toString() === currentEspecie;
    const searchMatch = v.nombre_vacuna
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return especieMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredVacunas.length / itemsPerPage);
  const paginatedVacunas = filteredVacunas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar vacunas</div>;

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
                <BreadcrumbPage>Vacunas</BreadcrumbPage>
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
            <h1 className="text-2xl font-bold">Lista de Vacunas</h1>
            <div className="flex items-center gap-2">
              <SelectionEspecie
                value={currentEspecie}
                onChange={(value: React.SetStateAction<string>) =>
                  setCurrentEspecie(value)
                }
              />
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Crear Nueva Vacuna
              </Button>
            </div>
          </header>
          <Separator className="my-4" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Nombre Vacuna</TableHead>
                <TableHead>Enfermedad Prevenida</TableHead>
                <TableHead>Laboratorio</TableHead>
                <TableHead>Especie Destino</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVacunas.map((v) => (
                <TableRow key={v.tipo_vacuna_id}>
                  <TableCell className="font-medium truncate">
                    {v.nombre_vacuna}
                  </TableCell>
                  <TableCell className="">
                    {v.enfermedad_prevenida || "N/A"}
                  </TableCell>
                  <TableCell className="">{v.laboratorio || "N/A"}</TableCell>
                  <TableCell className="">
                    {v.especie_destino?.nombre_comun || "N/A"}
                  </TableCell>
                  <TableCell className="text-right flex flex-wrap justify-end gap-2">
                    <Button
                      className=""
                      onClick={() => {
                        setEditVacunaId(v.tipo_vacuna_id);
                        setEditNombreVacuna(v.nombre_vacuna);
                        setEditEnfermedadPrevenida(
                          v.enfermedad_prevenida || ""
                        );
                        setEditLaboratorio(v.laboratorio || "");
                        setEditEspecieDestinoId(v.especie_destino_id);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil></Pencil>
                    </Button>
                    <Button
                      variant="destructive"
                      className=""
                      onClick={() => handleDeleteVacuna(v.tipo_vacuna_id)}
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              Siguiente
            </Button>
          </div>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nueva Vacuna</DialogTitle>
              <DialogDescription>
                Ingresa los detalles de la nueva vacuna.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombreVacuna" className="text-right">
                  Nombre Vacuna
                </Label>
                <Input
                  id="nombreVacuna"
                  value={newNombreVacuna}
                  onChange={(e) => setNewNombreVacuna(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="enfermedadPrevenida" className="text-right">
                  Enfermedad Prevenida
                </Label>
                <Input
                  id="enfermedadPrevenida"
                  value={newEnfermedadPrevenida}
                  onChange={(e) => setNewEnfermedadPrevenida(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="laboratorio" className="text-right">
                  Laboratorio
                </Label>
                <Input
                  id="laboratorio"
                  value={newLaboratorio}
                  onChange={(e) => setNewLaboratorio(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="especieDestinoId" className="text-right">
                  Especie Destino
                </Label>
                <SelectionEspecie
                  value={
                    newEspecieDestinoId !== undefined
                      ? newEspecieDestinoId.toString()
                      : null
                  }
                  onChange={(value: string) =>
                    setNewEspecieDestinoId(
                      value ? parseInt(value, 10) : undefined
                    )
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateVacuna}>Crear Vacuna</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Vacuna</DialogTitle>
              <DialogDescription>
                Actualiza los detalles de la vacuna.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editNombreVacuna" className="text-right">
                  Nombre Vacuna
                </Label>
                <Input
                  id="editNombreVacuna"
                  value={editNombreVacuna}
                  onChange={(e) => setEditNombreVacuna(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editEnfermedadPrevenida" className="text-right">
                  Enfermedad Prevenida
                </Label>
                <Input
                  id="editEnfermedadPrevenida"
                  value={editEnfermedadPrevenida}
                  onChange={(e) => setEditEnfermedadPrevenida(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editLaboratorio" className="text-right">
                  Laboratorio
                </Label>
                <Input
                  id="editLaboratorio"
                  value={editLaboratorio}
                  onChange={(e) => setEditLaboratorio(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editEspecieDestinoId" className="text-right">
                  Especie Destino
                </Label>
                <SelectionEspecie
                  value={
                    editEspecieDestinoId !== undefined
                      ? editEspecieDestinoId.toString()
                      : null
                  }
                  onChange={(value: string) =>
                    setEditEspecieDestinoId(
                      value ? parseInt(value, 10) : undefined
                    )
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateVacuna}>Actualizar Vacuna</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
