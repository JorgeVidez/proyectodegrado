"use client";

import { useAnimales } from "@/hooks/useAnimales";
import { useEffect, useState } from "react";
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
  AnimalCreate,
  AnimalUpdate,
  AnimalOut,
  EstadoAnimal,
} from "@/types/animal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimalCombobox } from "@/components/AnimalCombobox";
import { EspecieCombobox } from "@/components/EspecieCombobox";
import { RazaCombobox } from "@/components/RazaCombobox";
import { DatePicker } from "@/components/DatePicker";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Control, Controller, useForm } from "react-hook-form";
import { animalFormSchema, AnimalFormSchema } from "@/schemas/animalFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";

const initialStateForm: AnimalFormSchema = {
  numero_trazabilidad: "",
  nombre_identificatorio: "",
  especie_id: 0,
  raza_id: 0,
  sexo: "M",
  estado_actual: EstadoAnimal.Activo,
  fecha_nacimiento: undefined, // undefined para que el DatePicker lo maneje correctamente
  madre_id: undefined,
  padre_id: undefined,
  observaciones_generales: undefined,
};

export default function ListaAnimalesPage() {
  const { animales, isLoading, error, create, update, remove } = useAnimales();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [animalData, setAnimalData] = useState<AnimalOut | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue, // Agregado para poder setear valores programáticamente
  } = useForm<AnimalFormSchema>({
    resolver: zodResolver(animalFormSchema),
    defaultValues: initialStateForm,
  });

  const especieId = watch("especie_id"); // Observa el cambio de especie_id

  // Filtros y paginación
  const [filters, setFilters] = useState({
    numeroTrazabilidad: "",
    nombre: "",
    especie: "",
    estado: " ",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  const showAlert = (message: string, type: "success" | "error") => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const handleCreateAnimal = async (data: AnimalFormSchema) => {
    console.log("Creating animal with data:", data); // Aquí verás los datos del formulario
    const createdAnimal = await create(data as AnimalCreate);
    if (createdAnimal) {
      showAlert("Animal creado con éxito.", "success");
      setIsCreateDialogOpen(false);
      reset(initialStateForm); // Resetea el formulario con los valores iniciales
    } else {
      showAlert("Error al crear el animal.", "error");
    }
  };

  const handleUpdateAnimal = async (data: AnimalFormSchema) => {
    if (animalData?.animal_id) {
      const updated = await update(animalData.animal_id, data as AnimalUpdate);
      if (updated) {
        showAlert("Animal actualizado con éxito.", "success");
        setIsEditDialogOpen(false);
        reset(initialStateForm); // Resetea el formulario
      } else {
        showAlert("Error al actualizar el animal.", "error");
      }
    }
  };

  const handleDeleteAnimal = async (id: number) => {
    const deleted = await remove(id);
    showAlert(
      deleted ? "Animal eliminado con éxito." : "Error al eliminar el animal.",
      deleted ? "success" : "error"
    );
  };

  const prepareEditForm = (animal: AnimalOut) => {
    setAnimalData(animal); // Guarda el animal completo para el ID
    // Utiliza `reset` de react-hook-form para pre-llenar el formulario
    reset({
      numero_trazabilidad: animal.numero_trazabilidad,
      nombre_identificatorio: animal.nombre_identificatorio || "",
      especie_id: animal.especie.especie_id,
      raza_id: animal.raza.raza_id,
      sexo: animal.sexo === "M" ? "M" : "H",
      fecha_nacimiento: animal.fecha_nacimiento,
      madre_id: animal.madre?.animal_id,
      padre_id: animal.padre?.animal_id,
      estado_actual: animal.estado_actual,
      observaciones_generales: animal.observaciones_generales,
    });
    setIsEditDialogOpen(true);
  };

  // Filtrar animales
  const filteredAnimales =
    animales?.filter((animal) => {
      return (
        animal.numero_trazabilidad
          .toLowerCase()
          .includes(filters.numeroTrazabilidad.toLowerCase()) &&
        (animal.nombre_identificatorio
          ?.toLowerCase()
          .includes(filters.nombre.toLowerCase()) ||
          filters.nombre === "") &&
        animal.especie.nombre_comun
          .toLowerCase()
          .includes(filters.especie.toLowerCase()) &&
        (filters.estado === " " || animal.estado_actual === filters.estado)
      );
    }) || [];

  // Paginación
  const totalPages = Math.ceil(filteredAnimales.length / itemsPerPage);
  const paginatedAnimales = filteredAnimales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar animales</div>;

  const AnimalForm = ({
    control,
    especieId,
    setValue,
  }: {
    control: Control<AnimalFormSchema>;
    especieId: number;
    setValue: (
      name: keyof AnimalFormSchema,
      value: any,
      options?: object
    ) => void;
  }) => {
    const renderField = (
      label: string,
      id: string,
      children: React.ReactNode
    ) => (
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={id} className="text-right">
          {label}
        </Label>
        <div className="col-span-3">{children}</div>
      </div>
    );

    return (
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 py-4 max-h-96 overflow-y-auto">
        {renderField(
          "Número Trazabilidad",
          "numero_trazabilidad",
          <Controller
            name="numero_trazabilidad"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        )}

        {renderField(
          "Nombre Identificatorio",
          "nombre_identificatorio",
          <Controller
            name="nombre_identificatorio"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        )}

        {renderField(
          "Especie",
          "especie_id",
          <Controller
            name="especie_id"
            control={control}
            render={({ field }) => (
              <EspecieCombobox
                label="Especie"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  setValue("raza_id", 0); // Resetea la raza cuando cambia la especie
                }}
              />
            )}
          />
        )}

        {renderField(
          "Raza",
          "raza_id",
          <Controller
            name="raza_id"
            control={control}
            render={({ field }) => (
              <RazaCombobox
                label="Raza"
                especieId={especieId}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        )}

        {renderField(
          "Sexo",
          "sexo",
          <Controller
            name="sexo"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar Sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Macho</SelectItem>
                  <SelectItem value="H">Hembra</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        )}

        {renderField(
          "Fecha Nacimiento",
          "fecha_nacimiento",
          <Controller
            name="fecha_nacimiento"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={(date) => field.onChange(date)}
              />
            )}
          />
        )}

        {renderField(
          "Madre",
          "madre_id",
          <Controller
            name="madre_id"
            control={control}
            render={({ field }) => (
              <AnimalCombobox
                label="Madre"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        )}

        {renderField(
          "Padre",
          "padre_id",
          <Controller
            name="padre_id"
            control={control}
            render={({ field }) => (
              <AnimalCombobox
                label="Padre"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        )}

        {renderField(
          "Estado Actual",
          "estado_actual",
          <Controller
            name="estado_actual"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.values(EstadoAnimal).map((estado) => (
                      <SelectItem key={estado} value={estado}>
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        )}

        {renderField(
          "Observaciones Generales",
          "observaciones_generales",
          <Controller
            name="observaciones_generales"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Administración</BreadcrumbLink>
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

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Input
              placeholder="Filtrar por número de trazabilidad"
              value={filters.numeroTrazabilidad}
              onChange={(e) =>
                setFilters({ ...filters, numeroTrazabilidad: e.target.value })
              }
            />
            <Input
              placeholder="Filtrar por nombre"
              value={filters.nombre}
              onChange={(e) =>
                setFilters({ ...filters, nombre: e.target.value })
              }
            />
            <Input
              placeholder="Filtrar por especie"
              value={filters.especie}
              onChange={(e) =>
                setFilters({ ...filters, especie: e.target.value })
              }
            />
            <Select
              value={filters.estado}
              onValueChange={(value) =>
                setFilters({ ...filters, estado: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">Todos</SelectItem>
                {Object.values(EstadoAnimal).map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número Trazabilidad</TableHead>
                <TableHead>Nombre Identificatorio</TableHead>
                <TableHead className="hidden md:table-cell">Especie</TableHead>
                <TableHead className="hidden lg:table-cell">Raza</TableHead>
                <TableHead>Sexo</TableHead>
                <TableHead className="hidden md:table-cell">Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAnimales.map((animal) => (
                <TableRow key={animal.animal_id}>
                  <TableCell>{animal.numero_trazabilidad}</TableCell>
                  <TableCell>
                    {animal.nombre_identificatorio || "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {animal.especie.nombre_comun}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {animal.raza.nombre_raza}
                  </TableCell>
                  <TableCell>
                    {animal.sexo === "M" ? "Macho" : "Hembra"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {animal.estado_actual}
                  </TableCell>
                  <TableCell className="text-right flex flex-wrap justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setAnimalData(animal);
                        setIsViewDetailsDialogOpen(true);
                      }}
                    >
                      Detalles
                    </Button>
                    <Button onClick={() => prepareEditForm(animal)}>
                      <Pencil size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Paginación */}
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    isActive={currentPage > 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="px-4">
                    Página {currentPage} de {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    isActive={currentPage < totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>

        {/* Diálogos */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-sm sm:max-w-[600px] md:max-w-[750px] lg:max-w-[950px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Animal</DialogTitle>
              <DialogDescription>
                Ingresa los detalles del nuevo animal.
              </DialogDescription>
            </DialogHeader>
            <AnimalForm
              control={control}
              especieId={especieId}
              setValue={setValue}
            />
            <DialogFooter>
              <Button onClick={handleSubmit(handleCreateAnimal)}>
                Guardar Animal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-sm sm:max-w-[600px] md:max-w-[750px] lg:max-w-[950px]">
            <DialogHeader>
              <DialogTitle>Editar Animal</DialogTitle>
              <DialogDescription>
                Actualiza los detalles del animal.
              </DialogDescription>
            </DialogHeader>
            <AnimalForm
              control={control}
              especieId={especieId}
              setValue={setValue}
            />
            <DialogFooter>
              <Button onClick={handleSubmit(handleUpdateAnimal)}>
                Actualizar Animal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isViewDetailsDialogOpen}
          onOpenChange={setIsViewDetailsDialogOpen}
        >
          <DialogContent className="w-full h-5/6 max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-semibold">
                Detalles del Animal
              </DialogTitle>
              <DialogDescription>
                Aquí puedes ver los detalles del animal.
              </DialogDescription>
            </DialogHeader>

            {animalData && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-y-auto">
                {[
                  { label: "ID Animal", value: animalData.animal_id },
                  {
                    label: "Número Trazabilidad",
                    value: animalData.numero_trazabilidad,
                  },
                  {
                    label: "Nombre",
                    value: animalData.nombre_identificatorio || "N/A",
                  },
                  { label: "Especie", value: animalData.especie.nombre_comun },
                  { label: "Raza", value: animalData.raza.nombre_raza },
                  {
                    label: "Sexo",
                    value: animalData.sexo === "M" ? "Macho" : "Hembra",
                  },
                  {
                    label: "Fecha Nacimiento",
                    value: animalData.fecha_nacimiento || "No registrada",
                  },
                  { label: "Estado", value: animalData.estado_actual },
                  {
                    label: "Madre",
                    value:
                      animalData.madre?.numero_trazabilidad || "No registrada",
                  },
                  {
                    label: "Padre",
                    value:
                      animalData.padre?.numero_trazabilidad || "No registrado",
                  },
                  {
                    label: "Observaciones",
                    value:
                      animalData.observaciones_generales || "Sin observaciones",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex flex-col space-y-1">
                    <span className="text-sm font-medium">{item.label}:</span>
                    <span className="text-base">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
