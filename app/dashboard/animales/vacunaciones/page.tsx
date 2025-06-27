"use client";

import {
  createVacunacion,
  deleteVacunacion,
  updateVacunacion,
  useVacunaciones,
  Vacunacion,
  VacunacionBase,
} from "@/hooks/useVacunaciones";
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
import { Eye, Pencil, Trash2 } from "lucide-react";
import { AnimalCombobox } from "@/components/AnimalCombobox";
import { DatePicker } from "@/components/DatePicker";
import { TipoVacunaCombobox } from "@/components/TipoVacunaCombobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProveedorCombobox } from "@/components/ProveedorCombobox";
import { useAuth } from "@/context/AuthContext";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  vacunacionFormSchema,
  VacunacionFormSchema,
} from "@/schemas/vacunacionFormSchema";

export default function ListaVacunaciones() {
  const { vacunaciones, isLoading, isError, refresh } = useVacunaciones();
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedVacunacion, setSelectedVacunacion] =
    useState<Vacunacion | null>(null);
  const [formData, setFormData] = useState<Partial<VacunacionFormSchema>>({});
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  // Filtros y paginación
  const [filters, setFilters] = useState({
    animal: "",
    fechaDesde: "",
    fechaHasta: "",
    tipoVacuna: "",
    proveedor: "",
    responsable: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (isError) console.error(isError);
  }, [isError]);

  const resetForm = () => {
    setSelectedVacunacion(null);
  };

  const showAlert = (message: string, type: "success" | "error") => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  // Función helper para transformar el esquema del formulario a VacunacionBase
  const transformFormDataToVacunacionBase = (
    data: VacunacionFormSchema
  ): VacunacionBase => {
    return {
      animal_id: data.animal_id,
      fecha_aplicacion: data.fecha_aplicacion,
      tipo_vacuna_id: data.tipo_vacuna_id,
      // Convertir null a undefined para campos opcionales
      dosis_aplicada: data.dosis_aplicada ?? undefined,
      unidad_dosis: data.unidad_dosis ?? undefined,
      lote_vacuna: data.lote_vacuna ?? undefined,
      fecha_vencimiento_lote: data.fecha_vencimiento_lote ?? undefined,
      proveedor_vacuna_id: data.proveedor_vacuna_id ?? undefined,
      responsable_aplicacion_id: data.responsable_aplicacion_id ?? undefined,
      proxima_vacunacion_sugerida:
        data.proxima_vacunacion_sugerida ?? undefined,
      observaciones: data.observaciones ?? undefined,
    };
  };

  const handleCreateVacunacion = async (data: VacunacionFormSchema) => {
    try {
      const transformedData = transformFormDataToVacunacionBase(data);
      await createVacunacion(transformedData);
      showAlert("Vacunación creada con éxito.", "success");
      setIsCreateDialogOpen(false);
      resetForm();
      refresh();
    } catch (err) {
      showAlert("Error al crear la vacunación.", "error");
    }
  };

  const handleEditVacunacion = (vacunacion: Vacunacion) => {
    setSelectedVacunacion(vacunacion);

    setIsEditDialogOpen(true);
  };

  const handleUpdateVacunacion = async (data: VacunacionFormSchema) => {
    if (selectedVacunacion) {
      try {
        const transformedData = transformFormDataToVacunacionBase(data);
        await updateVacunacion(
          selectedVacunacion.vacunacion_id,
          transformedData
        );
        showAlert("Vacunación actualizada con éxito.", "success");
        setIsEditDialogOpen(false);
        resetForm();
        refresh();
      } catch (err) {
        showAlert("Error al actualizar la vacunación.", "error");
      }
    }
  };

  const handleDeleteVacunacion = async (vacunacionId: number) => {
    try {
      await deleteVacunacion(vacunacionId);
      showAlert("Vacunación eliminada con éxito.", "success");
      refresh();
    } catch (err) {
      showAlert("Error al eliminar la vacunación.", "error");
    }
  };

  // Filtrar vacunaciones
  const filteredVacunaciones =
    vacunaciones?.filter((vacunacion) => {
      const fechaAplicacion = new Date(vacunacion.fecha_aplicacion);
      const fechaDesde = filters.fechaDesde
        ? new Date(filters.fechaDesde)
        : null;
      const fechaHasta = filters.fechaHasta
        ? new Date(filters.fechaHasta)
        : null;

      const animalMatch =
        vacunacion.animal.nombre_identificatorio
          ?.toLowerCase()
          .includes(filters.animal.toLowerCase()) ||
        vacunacion.animal.numero_trazabilidad
          .toString()
          .includes(filters.animal) ||
        filters.animal === "";

      const tipoVacunaMatch =
        vacunacion.tipo_vacuna.nombre_vacuna
          .toLowerCase()
          .includes(filters.tipoVacuna.toLowerCase()) ||
        filters.tipoVacuna === "";

      const proveedorMatch =
        vacunacion.proveedor?.nombre
          .toLowerCase()
          .includes(filters.proveedor.toLowerCase()) ||
        filters.proveedor === "";

      const responsableMatch =
        vacunacion.responsable?.nombre
          .toLowerCase()
          .includes(filters.responsable.toLowerCase()) ||
        filters.responsable === "";

      return (
        animalMatch &&
        tipoVacunaMatch &&
        proveedorMatch &&
        responsableMatch &&
        (!fechaDesde || fechaAplicacion >= fechaDesde) &&
        (!fechaHasta || fechaAplicacion <= fechaHasta)
      );
    }) || [];

  // Paginación
  const totalPages = Math.ceil(filteredVacunaciones.length / itemsPerPage);
  const paginatedVacunaciones = filteredVacunaciones.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar vacunaciones</div>;

  const renderFormField = (
    label: string,
    id: string,
    field: keyof VacunacionFormSchema,
    children: React.ReactNode
  ) => (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <div className="col-span-3">{children}</div>
    </div>
  );

  const VacunacionForm = ({
    onSubmit,
    defaultValues,
  }: {
    onSubmit: (data: VacunacionFormSchema) => void;
    defaultValues?: Partial<VacunacionFormSchema>; // <--- CHANGE THIS LINE
  }) => {
    const { control, handleSubmit, reset } = useForm<VacunacionFormSchema>({
      resolver: zodResolver(vacunacionFormSchema),
      defaultValues,
    });

    useEffect(() => {
      if (defaultValues) reset(defaultValues);
    }, [defaultValues, reset]);

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
      <form
        id="vacunacion-form"
        onSubmit={handleSubmit(onSubmit)}
        className="grid sm:grid-cols-2 gap-4 py-4 max-h-96 overflow-y-auto"
      >
        {renderField(
          "Animal",
          "animal_id",
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
          "Fecha Aplicación",
          "fecha_aplicacion",
          <Controller
            name="fecha_aplicacion"
            control={control}
            render={({ field }) => (
              <DatePicker value={field.value} onChange={field.onChange} />
            )}
          />
        )}

        {renderField(
          "Tipo Vacuna",
          "tipo_vacuna_id",
          <Controller
            name="tipo_vacuna_id"
            control={control}
            render={({ field }) => (
              <TipoVacunaCombobox
                label="tipo de vacuna"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        )}

        {renderField(
          "Dosis Aplicada",
          "dosis_aplicada",
          <Controller
            name="dosis_aplicada"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              />
            )}
          />
        )}

        {renderField(
          "Unidad Dosis",
          "unidad_dosis",
          <Controller
            name="unidad_dosis"
            control={control}
            render={({ field }) => (
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar unidad" />
                </SelectTrigger>
                <SelectContent>
                  {["ml", "mg", "g", "UI", "dosis", "otro"].map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}

        {renderField(
          "Lote Vacuna",
          "lote_vacuna",
          <Controller
            name="lote_vacuna"
            control={control}
            render={({ field }) => (
              <Input value={field.value || ""} onChange={field.onChange} />
            )}
          />
        )}

        {renderField(
          "Fecha Vencimiento",
          "fecha_vencimiento_lote",
          <Controller
            name="fecha_vencimiento_lote"
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
          "Proveedor",
          "proveedor_vacuna_id",
          <Controller
            name="proveedor_vacuna_id"
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
          "Responsable",
          "responsable_aplicacion_id",
          <Input value={user?.nombre || ""} disabled />
        )}

        {renderField(
          "Próxima Vacunación",
          "proxima_vacunacion_sugerida",
          <Controller
            name="proxima_vacunacion_sugerida"
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
          "Observaciones",
          "observaciones",
          <Controller
            name="observaciones"
            control={control}
            render={({ field }) => (
              <Input value={field.value || ""} onChange={field.onChange} />
            )}
          />
        )}
      </form>
    );
  };

  return (
    <div className="flex h-full flex-col">
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
                <BreadcrumbPage>Vacunaciones</BreadcrumbPage>
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
            <h1 className="text-2xl font-bold">Lista de Vacunaciones</h1>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Crear Nueva Vacunación
            </Button>
          </header>

          <Separator className="my-4" />

          {/* Filtros mejorados */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Input
              placeholder="Filtrar por nombre o número de animal"
              value={filters.animal}
              onChange={(e) =>
                setFilters({ ...filters, animal: e.target.value })
              }
            />

            <Input
              placeholder="Filtrar por tipo de vacuna"
              value={filters.tipoVacuna}
              onChange={(e) =>
                setFilters({ ...filters, tipoVacuna: e.target.value })
              }
            />

            <Input
              placeholder="Filtrar por proveedor"
              value={filters.proveedor}
              onChange={(e) =>
                setFilters({ ...filters, proveedor: e.target.value })
              }
            />

            <Input
              placeholder="Filtrar por responsable"
              value={filters.responsable}
              onChange={(e) =>
                setFilters({ ...filters, responsable: e.target.value })
              }
            />

            <DatePicker
              placeholder="Fecha desde"
              value={filters.fechaDesde}
              onChange={(value) =>
                setFilters({ ...filters, fechaDesde: value || "" })
              }
            />

            <DatePicker
              placeholder="Fecha hasta"
              value={filters.fechaHasta}
              onChange={(value) =>
                setFilters({ ...filters, fechaHasta: value || "" })
              }
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Animal</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Tipo Vacuna
                </TableHead>
                <TableHead className="hidden lg:table-cell">Dosis</TableHead>
                <TableHead className="hidden md:table-cell">
                  Proveedor
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Responsable
                </TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVacunaciones.map((vacunacion) => (
                <TableRow key={vacunacion.vacunacion_id}>
                  <TableCell>
                    {vacunacion.animal.numero_trazabilidad +
                      (vacunacion.animal.nombre_identificatorio
                        ? ` (${vacunacion.animal.nombre_identificatorio})`
                        : "")}
                  </TableCell>
                  <TableCell>
                    {new Date(vacunacion.fecha_aplicacion).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {vacunacion.tipo_vacuna.nombre_vacuna}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {vacunacion.dosis_aplicada} {vacunacion.unidad_dosis}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {vacunacion.proveedor?.nombre || "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {vacunacion.responsable?.nombre || "N/A"}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedVacunacion(vacunacion);
                        setIsDetailsDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditVacunacion(vacunacion)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() =>
                        handleDeleteVacunacion(vacunacion.vacunacion_id)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
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
              <DialogTitle>Crear Vacunación</DialogTitle>
              <DialogDescription>
                Registre una nueva vacunación
              </DialogDescription>
            </DialogHeader>
            <VacunacionForm
              defaultValues={{
                animal_id: 0,
                fecha_aplicacion: "",
                tipo_vacuna_id: 0,
                responsable_aplicacion_id: user?.usuario_id ?? null, // Use null if your schema allows null and you want it explicit
              }}
              onSubmit={handleCreateVacunacion}
            />

            <DialogFooter>
              <Button form="vacunacion-form" type="submit">
                Crear
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-sm sm:max-w-[600px] md:max-w-[750px] lg:max-w-[950px]">
            <DialogHeader>
              <DialogTitle>Editar Vacunación</DialogTitle>
              <DialogDescription>
                Modifique los datos de la vacunación
              </DialogDescription>
            </DialogHeader>
            <VacunacionForm
              onSubmit={handleUpdateVacunacion}
              defaultValues={selectedVacunacion as VacunacionFormSchema}
            />

            <DialogFooter>
              <Button form="vacunacion-form" type="submit">
                Actualizar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Detalles de Vacunación</DialogTitle>
              <DialogDescription>Información completa</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {selectedVacunacion && (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      label: "ID Vacunación",
                      value: selectedVacunacion.vacunacion_id,
                    },
                    {
                      label: "Animal",
                      value: `${selectedVacunacion.animal.numero_trazabilidad} ${selectedVacunacion.animal.nombre_identificatorio || ""}`,
                    },
                    {
                      label: "Fecha Aplicación",
                      value: new Date(
                        selectedVacunacion.fecha_aplicacion
                      ).toLocaleDateString(),
                    },
                    {
                      label: "Tipo Vacuna",
                      value: selectedVacunacion.tipo_vacuna.nombre_vacuna,
                    },
                    {
                      label: "Dosis Aplicada",
                      value: `${selectedVacunacion.dosis_aplicada || "N/A"} ${selectedVacunacion.unidad_dosis || ""}`,
                    },
                    {
                      label: "Lote Vacuna",
                      value: selectedVacunacion.lote_vacuna || "N/A",
                    },
                    {
                      label: "Fecha Vencimiento",
                      value: selectedVacunacion.fecha_vencimiento_lote
                        ? new Date(
                            selectedVacunacion.fecha_vencimiento_lote
                          ).toLocaleDateString()
                        : "N/A",
                    },
                    {
                      label: "Proveedor",
                      value: selectedVacunacion.proveedor?.nombre || "N/A",
                    },
                    {
                      label: "Responsable",
                      value: selectedVacunacion.responsable?.nombre || "N/A",
                    },
                    {
                      label: "Próxima Vacunación",
                      value: selectedVacunacion.proxima_vacunacion_sugerida
                        ? new Date(
                            selectedVacunacion.proxima_vacunacion_sugerida
                          ).toLocaleDateString()
                        : "N/A",
                    },
                    {
                      label: "Observaciones",
                      value: selectedVacunacion.observaciones || "N/A",
                      colSpan: 2,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`col-span-${item.colSpan || 1}`}
                    >
                      <Label className="font-semibold">{item.label}:</Label>
                      <p>{item.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setIsDetailsDialogOpen(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
