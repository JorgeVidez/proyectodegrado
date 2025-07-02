"use client";

import { useMedicamentos } from "@/hooks/useMedicamentos";
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
import { MessageCircleWarning, Pencil, Trash2 } from "lucide-react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ListaMedicamentos() {
  const { medicamentos, isLoading, error, create, update, remove } =
    useMedicamentos();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newNombreComercial, setNewNombreComercial] = useState("");
  const [newPrincipioActivo, setNewPrincipioActivo] = useState("");
  const [newLaboratorio, setNewLaboratorio] = useState("");
  const [newPresentacion, setNewPresentacion] = useState("");
  const [newPeriodoRetiroCarneDias, setNewPeriodoRetiroCarneDias] = useState<
    number | undefined
  >(undefined);
  const [newPeriodoRetiroLecheDias, setNewPeriodoRetiroLecheDias] = useState<
    number | undefined
  >(undefined);
  const [editMedicamentoId, setEditMedicamentoId] = useState<number | null>(
    null
  );
  const [editNombreComercial, setEditNombreComercial] = useState("");
  const [editPrincipioActivo, setEditPrincipioActivo] = useState("");
  const [editLaboratorio, setEditLaboratorio] = useState("");
  const [editPresentacion, setEditPresentacion] = useState("");
  const [editPeriodoRetiroCarneDias, setEditPeriodoRetiroCarneDias] = useState<
    number | undefined
  >(undefined);
  const [editPeriodoRetiroLecheDias, setEditPeriodoRetiroLecheDias] = useState<
    number | undefined
  >(undefined);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  const handleCreateMedicamento = async () => {
    const newMedicamento = {
      nombre_comercial: newNombreComercial,
      principio_activo: newPrincipioActivo,
      laboratorio: newLaboratorio,
      presentacion: newPresentacion,
      periodo_retiro_carne_dias: newPeriodoRetiroCarneDias,
      periodo_retiro_leche_dias: newPeriodoRetiroLecheDias,
    };
    const createdMedicamento = await create(newMedicamento);
    if (createdMedicamento) {
      setAlertMessage("Medicamento creado con éxito.");
      setAlertType("success");
      setIsCreateDialogOpen(false);
      setNewNombreComercial("");
      setNewPrincipioActivo("");
      setNewLaboratorio("");
      setNewPresentacion("");
      setNewPeriodoRetiroCarneDias(undefined);
      setNewPeriodoRetiroLecheDias(undefined);
    } else {
      setAlertMessage("Error al crear el medicamento.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const handleUpdateMedicamento = async () => {
    if (editMedicamentoId) {
      const updatedMedicamento = await update(editMedicamentoId, {
        nombre_comercial: editNombreComercial,
        principio_activo: editPrincipioActivo,
        laboratorio: editLaboratorio,
        presentacion: editPresentacion,
        periodo_retiro_carne_dias: editPeriodoRetiroCarneDias,
        periodo_retiro_leche_dias: editPeriodoRetiroLecheDias,
      });
      if (updatedMedicamento) {
        setAlertMessage("Medicamento actualizado con éxito.");
        setAlertType("success");
        setIsEditDialogOpen(false);
        setEditMedicamentoId(null);
        setEditNombreComercial("");
        setEditPrincipioActivo("");
        setEditLaboratorio("");
        setEditPresentacion("");
        setEditPeriodoRetiroCarneDias(undefined);
        setEditPeriodoRetiroLecheDias(undefined);
      } else {
        setAlertMessage("Error al actualizar el medicamento.");
        setAlertType("error");
      }
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
    }
  };

  const handleDeleteMedicamento = async (id: number) => {
    const deleted = await remove(id);
    if (deleted) {
      setAlertMessage("Medicamento eliminado con éxito.");
      setAlertType("success");
    } else {
      setAlertMessage("Error al eliminar el medicamento.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const filteredMedicamentos = (medicamentos ?? []).filter((m) => {
    const searchMatch = m.nombre_comercial
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return searchMatch;
  });

  const totalPages = Math.ceil(filteredMedicamentos.length / itemsPerPage);
  const paginatedMedicamentos = filteredMedicamentos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar medicamentos</div>;

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
                <BreadcrumbPage>Medicamentos</BreadcrumbPage>
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
            <h1 className="text-2xl font-bold">Lista de Medicamentos</h1>
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Crear Nuevo Medicamento
              </Button>
            </div>
          </header>
          <Separator className="my-4" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Nombre Comercial</TableHead>
                <TableHead>Principio Activo</TableHead>
                <TableHead>Laboratorio</TableHead>
                <TableHead>Presentación</TableHead>
                <TableHead>Retiro Carne (días)</TableHead>
                <TableHead>Retiro Leche (días)</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMedicamentos.map((m) => (
                <TableRow key={m.medicamento_id}>
                  <TableCell className="font-medium truncate">
                    {m.nombre_comercial}
                  </TableCell>
                  <TableCell className="">
                    {m.principio_activo || "N/A"}
                  </TableCell>
                  <TableCell className="">{m.laboratorio || "N/A"}</TableCell>
                  <TableCell className="">{m.presentacion || "N/A"}</TableCell>
                  <TableCell className="">
                    {m.periodo_retiro_carne_dias || "N/A"}
                  </TableCell>
                  <TableCell className="">
                    {m.periodo_retiro_leche_dias || "N/A"}
                  </TableCell>
                  <TableCell className="text-right flex flex-wrap justify-end gap-2">
                    <Button
                      className=""
                      onClick={() => {
                        setEditMedicamentoId(m.medicamento_id);
                        setEditNombreComercial(m.nombre_comercial);
                        setEditPrincipioActivo(m.principio_activo || "");
                        setEditLaboratorio(m.laboratorio || "");
                        setEditPresentacion(m.presentacion || "");
                        setEditPeriodoRetiroCarneDias(
                          m.periodo_retiro_carne_dias
                        );
                        setEditPeriodoRetiroLecheDias(
                          m.periodo_retiro_leche_dias
                        );
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
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Formulario de Medicamentos</CardTitle>
            <CardDescription>
              Instrucciones para completar el formulario.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 text-pretty">
            <div>
              <p className="text-sm font-medium leading-none">
                Nombre comercial (obligatorio):
              </p>
              <p className="text-sm text-muted-foreground">
                El nombre de marca del medicamento, por ejemplo: Baytril 10%.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium leading-none">
                Principio activo:
              </p>
              <p className="text-sm text-muted-foreground">
                El compuesto químico que hace efecto, como Enrofloxacina.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium leading-none">Laboratorio:</p>
              <p className="text-sm text-muted-foreground">
                La empresa que lo fabrica, ej: Bayer.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium leading-none">Presentación:</p>
              <p className="text-sm text-muted-foreground">
                El formato en que viene, como frasco 100 ml o tabletas.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium leading-none">
                Período de retiro (carne y leche):
              </p>
              <p className="text-sm text-muted-foreground">
                Son los días que deben pasar desde la última dosis hasta que se
                pueda consumir la carne o leche del animal. Si no aplica, poné
                0.
              </p>
            </div>
            <div className="border rounded-md p-4 flex gap-2 items-center">
              <MessageCircleWarning className="w-12"></MessageCircleWarning>
              <p className="text-sm font-medium leading-none text-primary">
                No se pueden repetir medicamentos con el mismo nombre comercial,
                laboratorio y presentación. Si ya cargaste uno igual, te va a
                dar error.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Check /> Entendido
            </Button>
          </CardFooter>
        </Card>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Medicamento</DialogTitle>
              <DialogDescription>
                Ingresa los detalles del nuevo medicamento.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombreComercial" className="text-right">
                  Nombre Comercial
                </Label>
                <Input
                  id="nombreComercial"
                  value={newNombreComercial}
                  onChange={(e) => setNewNombreComercial(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="principioActivo" className="text-right">
                  Principio Activo
                </Label>

                <Input
                  id="principioActivo"
                  value={newPrincipioActivo}
                  onChange={(e) => setNewPrincipioActivo(e.target.value)}
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
                <Label htmlFor="presentacion" className="text-right">
                  Presentación
                </Label>
                <Input
                  id="presentacion"
                  value={newPresentacion}
                  onChange={(e) => setNewPresentacion(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="periodoRetiroCarneDias" className="text-right">
                  Retiro Carne (días)
                </Label>
                <Input
                  id="periodoRetiroCarneDias"
                  type="number"
                  value={newPeriodoRetiroCarneDias || ""}
                  onChange={(e) =>
                    setNewPeriodoRetiroCarneDias(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="periodoRetiroLecheDias" className="text-right">
                  Retiro Leche (días)
                </Label>
                <Input
                  id="periodoRetiroLecheDias"
                  type="number"
                  value={newPeriodoRetiroLecheDias || ""}
                  onChange={(e) =>
                    setNewPeriodoRetiroLecheDias(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateMedicamento}>
                Crear Medicamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Medicamento</DialogTitle>
              <DialogDescription>
                Actualiza los detalles del medicamento.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editNombreComercial" className="text-right">
                  Nombre Comercial
                </Label>
                <Input
                  id="editNombreComercial"
                  value={editNombreComercial}
                  onChange={(e) => setEditNombreComercial(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editPrincipioActivo" className="text-right">
                  Principio Activo
                </Label>
                <Input
                  id="editPrincipioActivo"
                  value={editPrincipioActivo}
                  onChange={(e) => setEditPrincipioActivo(e.target.value)}
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
                <Label htmlFor="editPresentacion" className="text-right">
                  Presentación
                </Label>
                <Input
                  id="editPresentacion"
                  value={editPresentacion}
                  onChange={(e) => setEditPresentacion(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="editPeriodoRetiroCarneDias"
                  className="text-right"
                >
                  Retiro Carne (días)
                </Label>
                <Input
                  id="editPeriodoRetiroCarneDias"
                  type="number"
                  value={editPeriodoRetiroCarneDias || ""}
                  onChange={(e) =>
                    setEditPeriodoRetiroCarneDias(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="editPeriodoRetiroLecheDias"
                  className="text-right"
                >
                  Retiro Leche (días)
                </Label>
                <Input
                  id="editPeriodoRetiroLecheDias"
                  type="number"
                  value={editPeriodoRetiroLecheDias || ""}
                  onChange={(e) =>
                    setEditPeriodoRetiroLecheDias(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateMedicamento}>
                Actualizar Medicamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
