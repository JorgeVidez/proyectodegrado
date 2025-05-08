"use client";

import { useLotes } from "@/hooks/useLotes";
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
import { Switch } from "@/components/ui/switch";

export default function ListaLotes() {
  const { lotes, isLoading, error, create, update, remove } = useLotes();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newCodigoLote, setNewCodigoLote] = useState("");
  const [newProposito, setNewProposito] = useState("");
  const [newDescripcion, setNewDescripcion] = useState("");
  const [newActivo, setNewActivo] = useState(true);
  const [editLoteId, setEditLoteId] = useState<number | null>(null);
  const [editCodigoLote, setEditCodigoLote] = useState("");
  const [editProposito, setEditProposito] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");
  const [editActivo, setEditActivo] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  const handleCreateLote = async () => {
    const newLote = {
      codigo_lote: newCodigoLote,
      proposito: newProposito,
      descripcion: newDescripcion,
      activo: newActivo,
    };
    const createdLote = await create(newLote);
    if (createdLote) {
      setAlertMessage("Lote creado con éxito.");
      setAlertType("success");
      setIsCreateDialogOpen(false);
      setNewCodigoLote("");
      setNewProposito("");
      setNewDescripcion("");
      setNewActivo(true);
    } else {
      setAlertMessage("Error al crear el lote.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const handleUpdateLote = async () => {
    if (editLoteId) {
      const updatedLote = await update(editLoteId, {
        codigo_lote: editCodigoLote,
        proposito: editProposito,
        descripcion: editDescripcion,
        activo: editActivo,
      });
      if (updatedLote) {
        setAlertMessage("Lote actualizado con éxito.");
        setAlertType("success");
        setIsEditDialogOpen(false);
        setEditLoteId(null);
        setEditCodigoLote("");
        setEditProposito("");
        setEditDescripcion("");
        setEditActivo(true);
      } else {
        setAlertMessage("Error al actualizar el lote.");
        setAlertType("error");
      }
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
    }
  };

  const handleDeleteLote = async (id: number) => {
    const deleted = await remove(id);
    if (deleted) {
      setAlertMessage("Lote eliminado con éxito.");
      setAlertType("success");
    } else {
      setAlertMessage("Error al eliminar el lote.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  //genera una funciona para generar un codigo de lote aleatorio
  const generateRandomLoteCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  if (isLoading) return <div>Cargando lotes...</div>;
  if (error) return <div>Error al cargar lotes</div>;

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
                <BreadcrumbPage>Lotes</BreadcrumbPage>
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
            <h1 className="text-2xl font-bold">Lista de Lotes</h1>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Crear Nuevo Lote
            </Button>
          </header>
          <Separator className="my-4" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Código Lote</TableHead>
                <TableHead>Propósito</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lotes?.map((l) => (
                <TableRow key={l.lote_id}>
                  <TableCell className="font-medium">{l.codigo_lote}</TableCell>
                  <TableCell className="">{l.proposito || "N/A"}</TableCell>
                  <TableCell className="">{l.descripcion || "N/A"}</TableCell>
                  <TableCell className="">{l.activo ? "Sí" : "No"}</TableCell>
                  <TableCell className="text-right flex flex-wrap justify-end gap-2">
                    <Button
                      className=""
                      onClick={() => {
                        setEditLoteId(l.lote_id);
                        setEditCodigoLote(l.codigo_lote);
                        setEditProposito(l.proposito || "");
                        setEditDescripcion(l.descripcion || "");
                        setEditActivo(l.activo ?? false);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil></Pencil>
                    </Button>
                    <Button
                      variant="destructive"
                      className=""
                      onClick={() => handleDeleteLote(l.lote_id)}
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
              <DialogTitle>Crear Nuevo Lote</DialogTitle>
              <DialogDescription>
                Ingresa los detalles del nuevo lote.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="codigoLote" className="text-right">
                  Código Lote
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="codigoLote"
                    value={newCodigoLote}
                    onChange={(e) => setNewCodigoLote(e.target.value)}
                  />

                  <Button
                    onClick={() => {
                      const randomCode = generateRandomLoteCode();
                      setNewCodigoLote(randomCode);
                    }}
                    className="w-1/2"
                  >
                    Generar
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="proposito" className="text-right">
                  Propósito
                </Label>
                <Input
                  id="proposito"
                  value={newProposito}
                  onChange={(e) => setNewProposito(e.target.value)}
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
                <Label htmlFor="activo" className="text-right">
                  Activo
                </Label>
                <Switch
                  id="activo"
                  checked={newActivo}
                  onCheckedChange={setNewActivo}
                  onChange={(e) =>
                    setNewActivo((e.target as HTMLInputElement).checked)
                  }
                  className="col-span-3"
                ></Switch>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateLote}>Crear Lote</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Lote</DialogTitle>
              <DialogDescription>
                Actualiza los detalles del lote.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editCodigoLote" className="text-right">
                  Código Lote
                </Label>
                <Input
                  id="editCodigoLote"
                  value={editCodigoLote}
                  onChange={(e) => setEditCodigoLote(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editProposito" className="text-right">
                  Propósito
                </Label>
                <Input
                  id="editProposito"
                  value={editProposito}
                  onChange={(e) => setEditProposito(e.target.value)}
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
                <Label htmlFor="editActivo" className="text-right">
                  Activo
                </Label>
                <Switch
                  id="editActivo"
                  checked={editActivo}
                  onCheckedChange={setEditActivo}
                  onChange={(e) =>
                    setEditActivo((e.target as HTMLInputElement).checked)
                  }
                  className="col-span-3"
                ></Switch>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateLote}>Actualizar Lote</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
