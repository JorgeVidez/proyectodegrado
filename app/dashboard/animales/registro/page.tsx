"use client";

import { useAnimales } from "@/hooks/useAnimales"; // Importa el hook de animales
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
import { AnimalCreate, AnimalUpdate, AnimalOut, EstadoAnimal } from "@/types/animal"; // Importa los tipos de animales
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimalCombobox } from "@/components/AnimalCombobox";
import { EspecieCombobox } from "@/components/EspecieCombobox";

export default function ListaAnimalesPage() {
  // Renombrar el componente
  const { animales, isLoading, error, create, update, remove } = useAnimales();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newNumeroTrazabilidad, setNewNumeroTrazabilidad] = useState("");
  const [newNombreIdentificatorio, setNewNombreIdentificatorio] = useState("");
  const [newEspecieId, setNewEspecieId] = useState<number>(0);
  const [newRazaId, setNewRazaId] = useState<number>(0);
  const [newSexo, setNewSexo] = useState<string>("M");
  const [newFechaNacimiento, setNewFechaNacimiento] = useState<
    string | undefined
  >(undefined);
  const [newMadreId, setNewMadreId] = useState<number | undefined>(undefined);
  const [newPadreId, setNewPadreId] = useState<number | undefined>(undefined);
  const [newEstadoActual, setNewEstadoActual] = useState<EstadoAnimal>(
    EstadoAnimal.Activo
  );
  const [newObservacionesGenerales, setNewObservacionesGenerales] = useState<
    string | undefined
  >(undefined);
  const [editAnimalId, setEditAnimalId] = useState<number | null>(null);
  const [editNumeroTrazabilidad, setEditNumeroTrazabilidad] = useState("");
  const [editNombreIdentificatorio, setEditNombreIdentificatorio] =
    useState("");
  const [editEspecieId, setEditEspecieId] = useState<number>(0);
  const [editRazaId, setEditRazaId] = useState<number>(0);
  const [editSexo, setEditSexo] = useState<string>("M");
  const [editFechaNacimiento, setEditFechaNacimiento] = useState<
    string | undefined
  >(undefined);
  const [editMadreId, setEditMadreId] = useState<number | undefined>(undefined);
  const [editPadreId, setEditPadreId] = useState<number | undefined>(undefined);
  const [editEstadoActual, setEditEstadoActual] = useState<EstadoAnimal>(
    EstadoAnimal.Activo
  );
  const [editObservacionesGenerales, setEditObservacionesGenerales] = useState<
    string | undefined
  >(undefined);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  const handleCreateAnimal = async () => {
    const newAnimal: AnimalCreate = {
      numero_trazabilidad: newNumeroTrazabilidad,
      nombre_identificatorio: newNombreIdentificatorio,
      especie_id: newEspecieId,
      raza_id: newRazaId,
      sexo: newSexo,
      fecha_nacimiento: newFechaNacimiento,
      madre_id: newMadreId,
      padre_id: newPadreId,
      estado_actual: newEstadoActual,
      observaciones_generales: newObservacionesGenerales,
    };
    const createdAnimal = await create(newAnimal);
    if (createdAnimal) {
      setAlertMessage("Animal creado con éxito.");
      setAlertType("success");
      setIsCreateDialogOpen(false);
      setNewNumeroTrazabilidad("");
      setNewNombreIdentificatorio("");
      setNewEspecieId(0);
      setNewRazaId(0);
      setNewSexo("M");
      setNewFechaNacimiento(undefined);
      setNewMadreId(undefined);
      setNewPadreId(undefined);
      setNewEstadoActual(EstadoAnimal.Activo);
      setNewObservacionesGenerales(undefined);
    } else {
      setAlertMessage("Error al crear el animal.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const handleUpdateAnimal = async () => {
    if (editAnimalId) {
      const updatedAnimal: AnimalUpdate = {
        numero_trazabilidad: editNumeroTrazabilidad,
        nombre_identificatorio: editNombreIdentificatorio,
        especie_id: editEspecieId,
        raza_id: editRazaId,
        sexo: editSexo,
        fecha_nacimiento: editFechaNacimiento,
        madre_id: editMadreId,
        padre_id: editPadreId,
        estado_actual: editEstadoActual,
        observaciones_generales: editObservacionesGenerales,
      };
      const updated = await update(editAnimalId, updatedAnimal);
      if (updated) {
        setAlertMessage("Animal actualizado con éxito.");
        setAlertType("success");
        setIsEditDialogOpen(false);
        setEditAnimalId(null);
        setEditNumeroTrazabilidad("");
        setEditNombreIdentificatorio("");
        setEditEspecieId(0);
        setEditRazaId(0);
        setEditSexo("M");
        setEditFechaNacimiento(undefined);
        setEditMadreId(undefined);
        setEditPadreId(undefined);
        setEditEstadoActual(EstadoAnimal.Activo);
        setEditObservacionesGenerales(undefined);
      } else {
        setAlertMessage("Error al actualizar el animal.");
        setAlertType("error");
      }
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
    }
  };

  const handleDeleteAnimal = async (id: number) => {
    const deleted = await remove(id);
    if (deleted) {
      setAlertMessage("Animal eliminado con éxito.");
      setAlertType("success");
    } else {
      setAlertMessage("Error al eliminar el animal.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar animales</div>;

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
                <BreadcrumbPage>Animales</BreadcrumbPage>
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
            <h1 className="text-2xl font-bold">Lista de Animales</h1>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Crear Nuevo Animal
            </Button>
          </header>

          <Separator className="my-4" />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Número Trazabilidad</TableHead>
                <TableHead>Nombre Identificatorio</TableHead>
                <TableHead>Especie</TableHead>
                <TableHead>Raza</TableHead>
                <TableHead>Sexo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {animales?.map((a) => (
                <TableRow key={a.animal_id}>
                  <TableCell className="font-medium">
                    {a.numero_trazabilidad}
                  </TableCell>
                  <TableCell className="">
                    {a.nombre_identificatorio
                      ? a.nombre_identificatorio
                      : "N/A"}
                  </TableCell>
                  <TableCell className="">{a.especie.nombre_comun}</TableCell>
                  <TableCell className="">{a.raza.nombre_raza}</TableCell>
                  <TableCell className="">{a.sexo}</TableCell>
                  <TableCell className="text-right flex flex-wrap justify-end gap-2">
                    <Button
                      className=""
                      onClick={() => {
                        setEditAnimalId(a.animal_id);
                        setEditNumeroTrazabilidad(a.numero_trazabilidad);
                        setEditNombreIdentificatorio(
                          a.nombre_identificatorio || ""
                        );
                        setEditEspecieId(a.especie.especie_id);
                        setEditRazaId(a.raza.raza_id);
                        setEditSexo(a.sexo);
                        setEditFechaNacimiento(a.fecha_nacimiento);
                        setEditMadreId(a.madre?.animal_id);
                        setEditPadreId(a.padre?.animal_id);
                        setEditEstadoActual(a.estado_actual);
                        setEditObservacionesGenerales(
                          a.observaciones_generales
                        );
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil></Pencil>
                    </Button>
                    <Button
                      variant="destructive"
                      className=""
                      onClick={() => handleDeleteAnimal(a.animal_id)}
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
          <DialogContent className=" max-w-sm  sm:max-w-[600px] md:max-w-[750px] lg:max-w-[900px] ">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Animal</DialogTitle>
              <DialogDescription>
                Ingresa los detalles del nuevo animal.
              </DialogDescription>
            </DialogHeader>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2  gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="numeroTrazabilidad"
                  className="text-right overflow-hidden text-ellipsis"
                >
                  Número Trazabilidad
                </Label>
                <Input
                  id="numeroTrazabilidad"
                  value={newNumeroTrazabilidad}
                  onChange={(e) => setNewNumeroTrazabilidad(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="nombreIdentificatorio"
                  className="text-right overflow-hidden text-ellipsis"
                >
                  {" "}
                  Nombre Identificatorio
                </Label>
                <Input
                  id="nombreIdentificatorio"
                  value={newNombreIdentificatorio}
                  onChange={(e) => setNewNombreIdentificatorio(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="especieId" className="text-right">
                  Especie ID
                </Label>
                <Input
                  id="especieId"
                  type="number"
                  value={newEspecieId}
                  onChange={(e) => setNewEspecieId(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="razaId" className="text-right">
                  Raza ID
                </Label>
                <Input
                  id="razaId"
                  type="number"
                  value={newRazaId}
                  onChange={(e) => setNewRazaId(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sexo" className="text-right">
                  Sexo (M/H)
                </Label>
                <Input
                  id="sexo"
                  value={newSexo}
                  onChange={(e) => setNewSexo(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fechaNacimiento" className="text-right">
                  Fecha Nacimiento
                </Label>
                <Input
                  id="fechaNacimiento"
                  type="date"
                  value={newFechaNacimiento}
                  onChange={(e) => setNewFechaNacimiento(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="madreId" className="text-right">
                  Madre ID
                </Label>
                <AnimalCombobox
                  label="Madre"
                  value={newMadreId}
                  onChange={(id) => setNewMadreId(id)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="padreId" className="text-right">
                  Padre ID
                </Label>

                <AnimalCombobox
                  label="Padre"
                  value={newPadreId}
                  onChange={(id) => setNewPadreId(id)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="estadoActual" className="text-right">
                  Estado Actual
                </Label>

                <Select
                  value={newEstadoActual}
                  onValueChange={(value) =>
                    setNewEstadoActual(value as EstadoAnimal)
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={EstadoAnimal.Activo}>
                        Activo
                      </SelectItem>
                      <SelectItem value={EstadoAnimal.Vendido}>
                        Vendido
                      </SelectItem>
                      <SelectItem value={EstadoAnimal.Muerto}>
                        Muerto
                      </SelectItem>
                      <SelectItem value={EstadoAnimal.Descartado}>
                        Descartado
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="observacionesGenerales"
                  className="text-right overflow-hidden text-ellipsis"
                >
                  Observaciones Generales
                </Label>
                <Input
                  id="observacionesGenerales"
                  value={newObservacionesGenerales}
                  onChange={(e) => setNewObservacionesGenerales(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleCreateAnimal}>Crear Animal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-sm  sm:max-w-[600px] md:max-w-[750px] lg:max-w-[900px] ">
            <DialogHeader>
              <DialogTitle>Editar Animal</DialogTitle>
              <DialogDescription>
                Actualiza los detalles del animal.
              </DialogDescription>
            </DialogHeader>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="editNumeroTrazabilidad"
                  className="text-right overflow-hidden text-ellipsis"
                >
                  Número Trazabilidad
                </Label>
                <Input
                  id="editNumeroTrazabilidad"
                  value={editNumeroTrazabilidad}
                  onChange={(e) => setEditNumeroTrazabilidad(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="editNombreIdentificatorio"
                  className="text-right overflow-hidden text-ellipsis"
                >
                  Nombre Identificatorio
                </Label>
                <Input
                  id="editNombreIdentificatorio"
                  value={editNombreIdentificatorio}
                  onChange={(e) => setEditNombreIdentificatorio(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editEspecieId" className="text-right">
                  Especie ID
                </Label>
                <EspecieCombobox
                  label="Especie"
                  value={editEspecieId}
                  onChange={(especieId) => setEditEspecieId(especieId ?? 0)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editRazaId" className="text-right">
                  Raza ID
                </Label>
                <Input
                  id="editRazaId"
                  type="number"
                  value={editRazaId}
                  onChange={(e) => setEditRazaId(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editSexo" className="text-right">
                  Sexo (M/H)
                </Label>
                <Input
                  id="editSexo"
                  value={editSexo}
                  onChange={(e) => setEditSexo(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editFechaNacimiento" className="text-right">
                  Fecha Nacimiento
                </Label>
                <Input
                  id="editFechaNacimiento"
                  type="date"
                  value={editFechaNacimiento}
                  onChange={(e) => setEditFechaNacimiento(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editMadreId" className="text-right">
                  Madre ID
                </Label>
                <AnimalCombobox
                  label="Madre"
                  value={editMadreId}
                  onChange={(id) => setEditMadreId(id)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editPadreId" className="text-right">
                  Padre ID
                </Label>
                <AnimalCombobox
                  label="Padre"
                  value={editPadreId}
                  onChange={(id) => setEditPadreId(id)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editEstadoActual" className="text-right">
                  Estado Actual
                </Label>

                <Select
                  value={editEstadoActual}
                  onValueChange={(value) =>
                    setEditEstadoActual(value as EstadoAnimal)
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={EstadoAnimal.Activo}>
                        Activo
                      </SelectItem>
                      <SelectItem value={EstadoAnimal.Vendido}>
                        Vendido
                      </SelectItem>
                      <SelectItem value={EstadoAnimal.Muerto}>
                        Muerto
                      </SelectItem>
                      <SelectItem value={EstadoAnimal.Descartado}>
                        Descartado
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="editObservacionesGenerales"
                  className="text-right overflow-hidden text-ellipsis"
                >
                  Observaciones Generales
                </Label>
                <Input
                  id="editObservacionesGenerales"
                  value={editObservacionesGenerales}
                  onChange={(e) =>
                    setEditObservacionesGenerales(e.target.value)
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateAnimal}>Actualizar Animal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}