"use client";

import {
  useControlesSanitarios,
  ControlSanitario,
  ControlSanitarioBase,
  deleteControlSanitario,
  updateControlSanitario,
  createControlSanitario,
} from "@/hooks/useControlesSanitarios";
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
import { AnimalCombobox } from "@/components/AnimalCombobox";
import { DatePicker } from "@/components/DatePicker";
import { useAuth } from "@/context/AuthContext";
import { UbicacionCombobox } from "@/components/UbicacionCombobox";

export default function ListaControlesSanitarios() {
  const { controles, isLoading, isError, refresh } = useControlesSanitarios();
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedControl, setSelectedControl] =
    useState<ControlSanitario | null>(null);

  const [newAnimalId, setNewAnimalId] = useState<number>(0);
  const [newFechaControl, setNewFechaControl] = useState<string | undefined>(
    undefined
  );
  const [newPesoKg, setNewPesoKg] = useState<number | undefined>(undefined);
  const [newCondicionCorporal, setNewCondicionCorporal] = useState<
    number | undefined
  >(undefined);
  const [newAlturaCm, setNewAlturaCm] = useState<number | undefined>(undefined);
  const [newResponsableId, setNewResponsableId] = useState<number | undefined>(
    undefined
  );
  const [newUbicacionId, setNewUbicacionId] = useState<number | undefined>(
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

  useEffect(() => {
    if (user?.usuario_id) {
      setNewResponsableId(user.usuario_id);
    }
  }, [user]);

  const handleCreateControl = async () => {
    const newControl: ControlSanitarioBase = {
      animal_id: newAnimalId,
      fecha_control: newFechaControl,
      peso_kg: newPesoKg,
      condicion_corporal: newCondicionCorporal,
      altura_cm: newAlturaCm,
      responsable_id: newResponsableId,
      ubicacion_id: newUbicacionId,
      observaciones: newObservaciones,
    };
    try {
      await createControlSanitario(newControl);
      setAlertMessage("Control sanitario creado con éxito.");
      setAlertType("success");
      setIsCreateDialogOpen(false);
      refresh();
    } catch (err) {
      setAlertMessage("Error al crear el control sanitario.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const handleEditControl = (control: ControlSanitario) => {
    setSelectedControl(control);
    setNewAnimalId(control.animal_id);
    setNewFechaControl(control.fecha_control);
    setNewPesoKg(control.peso_kg);
    setNewCondicionCorporal(control.condicion_corporal);
    setNewAlturaCm(control.altura_cm);
    setNewResponsableId(control.responsable_id);
    setNewUbicacionId(control.ubicacion_id);
    setNewObservaciones(control.observaciones);
    setIsEditDialogOpen(true);
  };

  const handleUpdateControl = async () => {
    if (selectedControl) {
      const updatedControl: Partial<ControlSanitarioBase> = {
        animal_id: newAnimalId,
        fecha_control: newFechaControl,
        peso_kg: newPesoKg,
        condicion_corporal: newCondicionCorporal,
        altura_cm: newAlturaCm,
        responsable_id: newResponsableId,
        ubicacion_id: newUbicacionId,
        observaciones: newObservaciones,
      };
      try {
        await updateControlSanitario(
          selectedControl.control_id,
          updatedControl
        );
        setAlertMessage("Control sanitario actualizado con éxito.");
        setAlertType("success");
        setIsEditDialogOpen(false);
        refresh();
      } catch (err) {
        setAlertMessage("Error al actualizar el control sanitario.");
        setAlertType("error");
      }
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
    }
  };

  const handleDeleteControl = async (controlId: number) => {
    try {
      await deleteControlSanitario(controlId);
      setAlertMessage("Control sanitario eliminado con éxito.");
      setAlertType("success");
      refresh();
    } catch (err) {
      setAlertMessage("Error al eliminar el control sanitario.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar controles sanitarios</div>;

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
            <h1 className="text-2xl font-bold">
              Lista de Controles Sanitarios
            </h1>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Crear Nuevo Control Sanitario
            </Button>
          </header>
          <Separator className="my-4" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Animal ID</TableHead>
                <TableHead>Fecha Control</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Peso (kg)
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  Condición Corporal
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  Altura (cm)
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Responsable ID
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Ubicación ID
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  Observaciones
                </TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {controles?.map((c) => (
                <TableRow key={c.control_id}>
                  <TableCell className="font-medium">{c.animal_id}</TableCell>
                  <TableCell className="">{c.fecha_control}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {c.peso_kg}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {c.condicion_corporal}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {c.altura_cm}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {c.responsable_id}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {c.ubicacion_id}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {c.observaciones}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditControl(c)}
                    >
                      <Pencil></Pencil>
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteControl(c.control_id)}
                    >
                      <Trash2></Trash2>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Control Sanitario</DialogTitle>
            <DialogDescription>
              Ingresa los detalles del nuevo control sanitario.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="animalId" className="text-right">
                Animal ID
              </Label>
              <div className="col-span-3">
                <AnimalCombobox
                  label="Animal"
                  value={newAnimalId}
                  onChange={(value) => setNewAnimalId(value ?? 0)}
                ></AnimalCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaControl" className="text-right">
                Fecha Control
              </Label>
              <div className="col-span-3">
                <DatePicker
                  value={newFechaControl}
                  onChange={(date) =>
                    setNewFechaControl(
                      date ? date.toString().split("T")[0] : undefined
                    )
                  }
                ></DatePicker>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pesoKg" className="text-right">
                Peso (kg)
              </Label>
              <Input
                id="pesoKg"
                value={newPesoKg?.toString() || ""}
                onChange={(e) =>
                  setNewPesoKg(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="condicionCorporal" className="text-right">
                Condición Corporal %
              </Label>
              <Input
                id="condicionCorporal"
                value={newCondicionCorporal?.toString() || ""}
                onChange={(e) =>
                  setNewCondicionCorporal(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="alturaCm" className="text-right">
                Altura (cm)
              </Label>
              <Input
                id="alturaCm"
                value={newAlturaCm?.toString() || ""}
                onChange={(e) =>
                  setNewAlturaCm(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsableId" className="text-right">
                Responsable ID
              </Label>
              <div className="col-span-3">
                <Input
                  id="responsableId"
                  value={user?.nombre || ""}
                  className="w-full"
                  disabled
                />
                {user && user.usuario_id && (
                  <input
                    type="hidden"
                    value={user.usuario_id}
                    onChange={() => {}}
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ubicacionId" className="text-right">
                Ubicación ID
              </Label>
              <div className="col-span-3">
                <UbicacionCombobox
                  label="Ubicación"
                  value={newUbicacionId || null}
                  onChange={(value) => setNewUbicacionId(value ?? 0)}
                ></UbicacionCombobox>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="observaciones"
                className="text-right overflow-hidden"
              >
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
            <Button onClick={handleCreateControl}>
              Crear Control Sanitario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Control Sanitario</DialogTitle>
            <DialogDescription>
              Edita los detalles del control sanitario.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* ... (Inputs para editar los campos, similar al diálogo de creación) */}
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
              <Label htmlFor="fechaControl" className="text-right">
                Fecha Control
              </Label>
              <Input
                id="fechaControl"
                value={newFechaControl || ""}
                onChange={(e) => setNewFechaControl(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pesoKg" className="text-right">
                Peso (kg)
              </Label>
              <Input
                id="pesoKg"
                value={newPesoKg?.toString() || ""}
                onChange={(e) =>
                  setNewPesoKg(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="condicionCorporal" className="text-right">
                Condición Corporal
              </Label>
              <Input
                id="condicionCorporal"
                value={newCondicionCorporal?.toString() || ""}
                onChange={(e) =>
                  setNewCondicionCorporal(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="alturaCm" className="text-right">
                Altura (cm)
              </Label>
              <Input
                id="alturaCm"
                value={newAlturaCm?.toString() || ""}
                onChange={(e) =>
                  setNewAlturaCm(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsableId" className="text-right">
                Responsable ID
              </Label>
              <Input
                id="responsableId"
                value={newResponsableId?.toString() || ""}
                onChange={(e) =>
                  setNewResponsableId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ubicacionId" className="text-right">
                Ubicación ID
              </Label>
              <Input
                id="ubicacionId"
                value={newUbicacionId?.toString() || ""}
                onChange={(e) =>
                  setNewUbicacionId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="observaciones"
                className="text-right overflow-hidden"
              >
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
            <Button onClick={handleUpdateControl}>
              Actualizar Control Sanitario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
