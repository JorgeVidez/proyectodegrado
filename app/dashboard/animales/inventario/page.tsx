"use client";

import { useInventarioAnimal } from "@/hooks/useInventarioAnimal";
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
import {
  MotivoIngreso,
  MotivoEgreso,
  InventarioAnimalCreate,
  InventarioAnimalUpdate,
  InventarioAnimalOut,
} from "@/types/inventarioAnimal";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimalCombobox } from "@/components/AnimalCombobox";
import { DatePicker } from "@/components/DatePicker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProveedorCombobox } from "@/components/ProveedorCombobox";
import { UbicacionCombobox } from "@/components/UbicacionCombobox";
import { LoteCombobox } from "@/components/LoteCombobox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useForm, Controller, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  inventarioFormSchema,
  InventarioFormSchema,
} from "@/schemas/inventarioFormSchema";

const initialStateForm: InventarioFormSchema = {
  animal_id: 0,
  fecha_ingreso: "",
  motivo_ingreso: MotivoIngreso.Nacimiento,
  proveedor_compra_id: null,
  precio_compra: null,
  ubicacion_actual_id: null,
  lote_actual_id: null,
  fecha_egreso: null,
  motivo_egreso: null,
};

export default function ListaInventarioAnimales() {
  const {
    inventarios,
    isLoading,
    error,
    createInventario,
    updateInventario,
    deleteInventario,
  } = useInventarioAnimal();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedInventario, setSelectedInventario] =
    useState<InventarioAnimalOut | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  const { control, handleSubmit, reset, setValue } =
    useForm<InventarioFormSchema>({
      resolver: zodResolver(inventarioFormSchema),
      defaultValues: initialStateForm,
    });

  // Filtros y paginación
  const [filters, setFilters] = useState({
    animal: "",
    motivoIngreso: " ",
    estado: " ",
    ubicacion: "",
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

  const handleCreateInventarioSubmit = async (data: InventarioFormSchema) => {
    console.log("Creating inventario with data:", data);
    const success = await createInventario(data as InventarioAnimalCreate);
    if (success !== undefined) {
      showAlert("Inventario creado con éxito.", "success");
      setIsCreateDialogOpen(false);
      reset(initialStateForm); // Resetea el formulario
    } else {
      showAlert("Error al crear el inventario.", "error");
    }
  };

  const handleEditInventario = (inventario: InventarioAnimalOut) => {
    setSelectedInventario(inventario);
    // Usa reset de react-hook-form para pre-llenar el formulario
    reset({
      animal_id: inventario.animal_id,
      fecha_ingreso: inventario.fecha_ingreso,
      motivo_ingreso: inventario.motivo_ingreso,
      proveedor_compra_id: inventario.proveedor_compra_id ?? null,
      precio_compra: inventario.precio_compra ?? null,
      ubicacion_actual_id: inventario.ubicacion_actual_id ?? null,
      lote_actual_id: inventario.lote_actual_id ?? null,
      fecha_egreso: inventario.fecha_egreso ?? null,
      motivo_egreso: inventario.motivo_egreso ?? null,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateInventarioSubmit = async (data: InventarioFormSchema) => {
    if (selectedInventario) {
      const success = await updateInventario(
        selectedInventario.inventario_id,
        data as InventarioAnimalUpdate
      );

      if (success && !error) {
        showAlert("Inventario actualizado con éxito.", "success");
        setIsEditDialogOpen(false);
        reset(initialStateForm); // Resetea el formulario
      } else {
        showAlert("Error al actualizar el inventario.", "error");
      }
    }
  };

  const handleDeleteInventario = async (inventarioId: number) => {
    const success = await deleteInventario(inventarioId);
    showAlert(
      success
        ? "Inventario eliminado con éxito."
        : "Error al eliminar el inventario.",
      success ? "success" : "error"
    );
  };

  // Filtrar inventarios
  const filteredInventarios =
    inventarios?.filter((inventario) => {
      return (
        (inventario.animal.nombre_identificatorio
          ?.toLowerCase()
          .includes(filters.animal.toLowerCase()) ||
          filters.animal === "") &&
        (filters.motivoIngreso === " " ||
          inventario.motivo_ingreso === filters.motivoIngreso) &&
        (filters.estado === " " ||
          (filters.estado === "activo" && inventario.activo_en_finca) ||
          (filters.estado === "inactivo" && !inventario.activo_en_finca)) &&
        (filters.ubicacion === "" ||
          inventario.ubicacion_actual?.nombre
            .toLowerCase()
            .includes(filters.ubicacion.toLowerCase()))
      );
    }) || [];

  // Paginación
  const totalPages = Math.ceil(filteredInventarios.length / itemsPerPage);
  const paginatedInventarios = filteredInventarios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar inventarios</div>;

  const InventarioForm = ({
    control,
    setValue,
  }: {
    control: Control<InventarioFormSchema>;
    setValue: (
      name: keyof InventarioFormSchema,
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
      <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
        {renderField(
          "Animal",
          "animalId",
          <Controller
            name="animal_id"
            control={control}
            render={({ field }) => (
              <AnimalCombobox
                label="animal"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        )}

        {renderField(
          "Fecha Ingreso",
          "fechaIngreso",
          <Controller
            name="fecha_ingreso"
            control={control}
            render={({ field }) => (
              <DatePicker value={field.value} onChange={field.onChange} />
            )}
          />
        )}

        {renderField(
          "Motivo Ingreso",
          "motivoIngreso",
          <Controller
            name="motivo_ingreso"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.values(MotivoIngreso).map((motivo) => (
                      <SelectItem key={motivo} value={motivo}>
                        {motivo}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        )}

        {renderField(
          "Proveedor Compra",
          "proveedorCompraId",
          <Controller
            name="proveedor_compra_id"
            control={control}
            render={({ field }) => (
              <ProveedorCombobox
                label="proveedor"
                value={field.value ?? null}
                onChange={field.onChange}
              />
            )}
          />
        )}

        {renderField(
          "Precio Compra",
          "precioCompra",
          <Controller
            name="precio_compra"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(e.target.value ? Number(e.target.value) : null)
                }
              />
            )}
          />
        )}

        {renderField(
          "Ubicación Actual",
          "ubicacionActualId",
          <Controller
            name="ubicacion_actual_id"
            control={control}
            render={({ field }) => (
              <UbicacionCombobox
                label="ubicacion actual"
                value={field.value ?? null}
                onChange={field.onChange}
              />
            )}
          />
        )}

        {renderField(
          "Lote Actual",
          "loteActualId",
          <Controller
            name="lote_actual_id"
            control={control}
            render={({ field }) => (
              <LoteCombobox
                label="lote actual"
                value={field.value ?? null}
                onChange={field.onChange}
              />
            )}
          />
        )}

        {renderField(
          "Fecha Egreso",
          "fechaEgreso",
          <Controller
            name="fecha_egreso"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value || undefined}
                onChange={field.onChange}
              />
            )}
          />
        )}

        {renderField(
          "Motivo Egreso",
          "motivoEgreso",
          <Controller
            name="motivo_egreso"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ?? ""}
                onValueChange={(value) =>
                  field.onChange(value === " " ? null : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value=" ">-- Sin seleccionar --</SelectItem>
                    {Object.values(MotivoEgreso).map((motivo) => (
                      <SelectItem key={motivo} value={motivo}>
                        {motivo}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
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
                <BreadcrumbLink href="#">Animales</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Inventario</BreadcrumbPage>
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
            <h1 className="text-2xl font-bold">Lista de Inventario</h1>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Crear Nuevo Inventario
            </Button>
          </header>

          <Separator className="my-4" />

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Input
              placeholder="Filtrar por animal"
              value={filters.animal}
              onChange={(e) =>
                setFilters({ ...filters, animal: e.target.value })
              }
            />

            <Select
              value={filters.motivoIngreso}
              onValueChange={(value) =>
                setFilters({ ...filters, motivoIngreso: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por motivo ingreso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">Todos</SelectItem>
                {Object.values(MotivoIngreso).map((motivo) => (
                  <SelectItem key={motivo} value={motivo}>
                    {motivo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
                <SelectItem value="activo">Activos en finca</SelectItem>
                <SelectItem value="inactivo">Inactivos</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Filtrar por ubicación"
              value={filters.ubicacion}
              onChange={(e) =>
                setFilters({ ...filters, ubicacion: e.target.value })
              }
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Animal</TableHead>
                <TableHead>Fecha Ingreso</TableHead>
                <TableHead className="hidden md:table-cell">
                  Motivo Ingreso
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  Proveedor Compra
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  Precio Compra
                </TableHead>
                <TableHead className="hidden xl:table-cell">
                  Ubicación Actual
                </TableHead>
                <TableHead className="hidden xl:table-cell">
                  Lote Actual
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Fecha Egreso
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Motivo Egreso
                </TableHead>
                <TableHead>Activo en Finca</TableHead>
                <TableHead className="w-28 text-end">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInventarios.map((inventario) => (
                <TableRow key={inventario.inventario_id}>
                  <TableCell className="font-medium">
                    {inventario.animal.nombre_identificatorio || "N/A"}
                  </TableCell>
                  <TableCell>{inventario.fecha_ingreso}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {inventario.motivo_ingreso}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {inventario.proveedor_compra?.nombre || "N/A"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {inventario.precio_compra
                      ? `$${inventario.precio_compra.toLocaleString()}`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    {inventario.ubicacion_actual?.nombre || "N/A"}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    {inventario.lote_actual?.codigo_lote || "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {inventario.fecha_egreso || "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {inventario.motivo_egreso || "N/A"}
                  </TableCell>
                  <TableCell>
                    {inventario.activo_en_finca ? (
                      <Badge variant="outline">Activo</Badge>
                    ) : (
                      <Badge variant="destructive">Inactivo</Badge>
                    )}
                  </TableCell>
                  <TableCell className="flex flex-wrap justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditInventario(inventario)}
                    >
                      <Pencil className="h-4 w-4" />
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Inventario</DialogTitle>
              <DialogDescription>
                Ingresa los detalles del nuevo inventario.
              </DialogDescription>
            </DialogHeader>
            <InventarioForm control={control} setValue={setValue} />
            <DialogFooter>
              {/* Llama a handleSubmit de useForm y pasa tu función de manejo */}
              <Button onClick={handleSubmit(handleCreateInventarioSubmit)}>
                Crear Inventario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Inventario</DialogTitle>
              <DialogDescription>
                Actualiza los detalles del inventario.
              </DialogDescription>
            </DialogHeader>
            <InventarioForm control={control} setValue={setValue} />
            <DialogFooter>
              {/* Llama a handleSubmit de useForm y pasa tu función de manejo */}
              <Button onClick={handleSubmit(handleUpdateInventarioSubmit)}>
                Actualizar Inventario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
