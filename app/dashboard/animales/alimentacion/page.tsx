"use client";

import {
  useAlimentaciones,
  Alimentacion,
  AlimentacionBase,
  updateAlimentacion,
  createAlimentacion,
  deleteAlimentacion,
} from "@/hooks/useAlimentaciones";
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
import { Pencil, Trash2, Eye, Search } from "lucide-react";
import { AnimalCombobox } from "@/components/AnimalCombobox";
import { LoteCombobox } from "@/components/LoteCombobox";
import { UbicacionCombobox } from "@/components/UbicacionCombobox";
import { DatePicker } from "@/components/DatePicker";
import { TipoAlimentoCombobox } from "@/components/TipoAlimentoCombobox";
import { ProveedorCombobox } from "@/components/ProveedorCombobox";
import { useAuth } from "@/context/AuthContext";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { z } from "zod";
import { animalFormSchema } from "@/schemas/animalFormSchema";
import { Animal } from "../../../../hooks/useVentas";
import { useAnimales } from "@/hooks/useAnimales";
import { useInventarioAnimal } from "@/hooks/useInventarioAnimal";

// Esquema de validación
const alimentacionSchema = z.object({
  animal_id: z.number().optional(),
  lote_id: z.number().optional(),
  ubicacion_id: z.number().optional(),
  fecha_suministro: z.string().min(1, "Fecha de suministro es requerida"),
  tipo_alimento_id: z.number().min(1, "Tipo de alimento es requerido"),
  cantidad_suministrada: z.number().min(0.1, "Cantidad debe ser mayor a 0"),
  proveedor_alimento_id: z.number().optional(),
  costo_total_alimento: z
    .number()
    .min(0, "Costo no puede ser negativo")
    .optional(),
  responsable_id: z.number().min(1, "Responsable es requerido"),
  observaciones: z.string().optional(),
});

type AlimentacionFormState = z.infer<typeof alimentacionSchema>;

export default function ListaAlimentaciones() {
  const { alimentaciones, isLoading, isError, refresh } = useAlimentaciones();
  const { user } = useAuth();
  const [dialogType, setDialogType] = useState<"create" | "edit" | null>(null);
  const [selectedAlimentacion, setSelectedAlimentacion] =
    useState<Alimentacion | null>(null);
  const [formState, setFormState] = useState<AlimentacionFormState>({
    animal_id: undefined,
    lote_id: undefined,
    ubicacion_id: undefined,
    fecha_suministro: "",
    tipo_alimento_id: 0,
    cantidad_suministrada: 0,
    proveedor_alimento_id: undefined,
    costo_total_alimento: undefined,
    responsable_id: user?.usuario_id || 0,
    observaciones: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Filtros y paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filters, setFilters] = useState({
    fechaDesde: "",
    fechaHasta: "",
    tipoAlimento: "",
  });

  const { inventario } = useInventarioAnimal();

  useEffect(() => {
    if (isError) console.error(isError);
  }, [isError]);

  const resetForm = () => {
    setFormState({
      animal_id: undefined,
      lote_id: undefined,
      ubicacion_id: undefined,
      fecha_suministro: "",
      tipo_alimento_id: 0,
      cantidad_suministrada: 0,
      proveedor_alimento_id: undefined,
      costo_total_alimento: undefined,
      responsable_id: user?.usuario_id || 0,
      observaciones: undefined,
    });
    setErrors({});
  };

  const handleOpenDialog = (
    type: "create" | "edit",
    alimentacion?: Alimentacion
  ) => {
    setDialogType(type);
    if (alimentacion) {
      setSelectedAlimentacion(alimentacion);
      setFormState({
        animal_id: alimentacion.animal_id,
        lote_id: alimentacion.lote_id,
        ubicacion_id: alimentacion.ubicacion_id,
        fecha_suministro: alimentacion.fecha_suministro,
        tipo_alimento_id: alimentacion.tipo_alimento_id,
        cantidad_suministrada: alimentacion.cantidad_suministrada,
        proveedor_alimento_id: alimentacion.proveedor_alimento_id,
        costo_total_alimento: alimentacion.costo_total_alimento,
        responsable_id: alimentacion.responsable_id || 0,
        observaciones: alimentacion.observaciones,
      });
    } else {
      resetForm();
    }
  };

  const handleCloseDialog = () => {
    setDialogType(null);
    setSelectedAlimentacion(null);
    resetForm();
  };

  const handleChange = (field: keyof AlimentacionFormState, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    try {
      alimentacionSchema.parse(formState);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const showAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSubmit = async (type: "create" | "edit") => {
    if (!validateForm()) return;

    try {
      if (type === "create") {
        await createAlimentacion(formState);
        showAlert("Alimentación creada con éxito.", "success");
      } else if (selectedAlimentacion) {
        await updateAlimentacion(
          selectedAlimentacion.alimentacion_id,
          formState
        );
        showAlert("Alimentación actualizada con éxito.", "success");
      }
      refresh();
      handleCloseDialog();
    } catch (err) {
      showAlert(
        `Error al ${type === "create" ? "crear" : "actualizar"} la alimentación.`,
        "error"
      );
    }
  };

  const handleDeleteAlimentacion = async (alimentacionId: number) => {
    try {
      await deleteAlimentacion(alimentacionId);
      showAlert("Alimentación eliminada con éxito.", "success");
      refresh();
    } catch (err) {
      showAlert("Error al eliminar la alimentación.", "error");
    }
  };

  // Filtrado y paginación
  const filteredData =
    alimentaciones?.filter((alimentacion) => {
      const matchesSearch =
        alimentacion.animal_id?.toString().includes(searchTerm) ||
        alimentacion.lote_id?.toString().includes(searchTerm) ||
        alimentacion.ubicacion_id?.toString().includes(searchTerm) ||
        alimentacion.tipo_alimento_id.toString().includes(searchTerm) ||
        alimentacion.cantidad_suministrada.toString().includes(searchTerm) ||
        alimentacion.observaciones
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesDate =
        (!filters.fechaDesde ||
          alimentacion.fecha_suministro >= filters.fechaDesde) &&
        (!filters.fechaHasta ||
          alimentacion.fecha_suministro <= filters.fechaHasta);

      const matchesTipoAlimento =
        !filters.tipoAlimento ||
        alimentacion.tipo_alimento_id.toString() === filters.tipoAlimento;

      return matchesSearch && matchesDate && matchesTipoAlimento;
    }) || [];

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar alimentaciones</div>;

  const renderFormField = (
    field: keyof AlimentacionFormState,
    label: string,
    type: "text" | "number" | "date" | "combobox" = "text",
    comboboxType?:
      | "animal"
      | "lote"
      | "ubicacion"
      | "tipoAlimento"
      | "proveedor",
    extraProps?: any
  ) => {
    const value = formState[field];
    const error = errors[field];

    return (
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={field} className="text-right">
          {label}
        </Label>
        <div className="col-span-3">
          {type === "date" ? (
            <DatePicker
              value={value as string}
              onChange={(date) => handleChange(field, date || "")}
              {...extraProps}
            />
          ) : type === "combobox" && comboboxType ? (
            comboboxType === "animal" ? (
              <AnimalCombobox
                value={value as number | undefined}
                onChange={(id) => handleChange(field, id)}
                label={label}
                {...extraProps}
              />
            ) : comboboxType === "lote" ? (
              <LoteCombobox
                value={value as number | undefined}
                onChange={(id) => handleChange(field, id)}
                label={label}
                {...extraProps}
              />
            ) : comboboxType === "ubicacion" ? (
              <UbicacionCombobox
                value={value as number | undefined}
                onChange={(id) => handleChange(field, id)}
                label={label}
                {...extraProps}
              />
            ) : comboboxType === "tipoAlimento" ? (
              <TipoAlimentoCombobox
                value={value as number}
                onChange={(id) => handleChange(field, id ?? 0)}
                label={label}
                {...extraProps}
              />
            ) : (
              <ProveedorCombobox
                value={value as number | undefined}
                onChange={(id) => handleChange(field, id)}
                label={label}
                {...extraProps}
              />
            )
          ) : (
            <Input
              id={field}
              type={type}
              min={type === "number" ? 0 : undefined}
              step={type === "number" ? "any" : undefined}
              value={value?.toString() || ""}
              onChange={(e) =>
                handleChange(
                  field,
                  type === "number"
                    ? e.target.value
                      ? Number(e.target.value)
                      : undefined
                    : e.target.value
                )
              }
              disabled={field === "responsable_id"}
              {...extraProps}
            />
          )}
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
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
                <BreadcrumbPage>Alimentacion</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="p-4">
        {alert && (
          <Alert
            variant={alert.type === "success" ? "default" : "destructive"}
            className="mb-4"
          >
            <AlertTitle>
              {alert.type === "success" ? "Éxito" : "Error"}
            </AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <header className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Lista de Alimentaciones</h1>
          <Button onClick={() => handleOpenDialog("create")}>
            Ingresar Alimentación
          </Button>
        </header>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DatePicker
            placeholder="Desde"
            value={filters.fechaDesde}
            onChange={(date) =>
              setFilters({ ...filters, fechaDesde: date || "" })
            }
          />
          <DatePicker
            placeholder="Hasta"
            value={filters.fechaHasta}
            onChange={(date) =>
              setFilters({ ...filters, fechaHasta: date || "" })
            }
          />
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setFilters({
                fechaDesde: "",
                fechaHasta: "",
                tipoAlimento: "",
              });
            }}
          >
            Limpiar filtros
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Animal</TableHead>
                <TableHead className="hidden md:table-cell">Lote</TableHead>
                <TableHead className="hidden md:table-cell">
                  Ubicación
                </TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="hidden md:table-cell">
                  Tipo Alimento
                </TableHead>
                <TableHead className="hidden md:table-cell">Cantidad</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Proveedor
                </TableHead>
                <TableHead className="hidden lg:table-cell">Costo</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((a) => (
                <TableRow key={a.alimentacion_id}>
                  <TableCell>
                    {a.animal?.nombre_identificatorio ||
                      a.animal?.numero_trazabilidad ||
                      "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {a.lote?.codigo_lote || "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {a.ubicacion?.nombre || "-"}
                  </TableCell>
                  <TableCell>{a.fecha_suministro}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {a.tipo_alimento.nombre || "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {a.cantidad_suministrada}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {a.proveedor_alimento_id || "-"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {a.costo_total_alimento
                      ? `$${a.costo_total_alimento.toFixed(2)}`
                      : "-"}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenDialog("edit", a)}
                    >
                      <Pencil size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

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

      {/* Diálogo de formulario */}
      <Dialog
        open={dialogType !== null}
        onOpenChange={(open) => !open && handleCloseDialog()}
      >
        <DialogContent className="sm:max-w-[600px] md:max-w-[750px] lg:max-w-[950px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogType === "create"
                ? "Crear Nueva Alimentación"
                : "Editar Alimentación"}
            </DialogTitle>
            <DialogDescription>
              {dialogType === "create"
                ? "Ingresa los detalles de la nueva alimentación."
                : "Edita los detalles de la alimentación."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 py-4">
            {renderFormField("animal_id", "Animal", "combobox", "animal")}
            {renderFormField("lote_id", "Lote", "combobox", "lote")}
            {renderFormField(
              "ubicacion_id",
              "Ubicación",
              "combobox",
              "ubicacion"
            )}
            {renderFormField("fecha_suministro", "Fecha Suministro", "date")}
            {renderFormField(
              "tipo_alimento_id",
              "Tipo Alimento",
              "combobox",
              "tipoAlimento"
            )}
            {renderFormField(
              "cantidad_suministrada",
              "Cantidad Suministrada",
              "number"
            )}
            {renderFormField(
              "proveedor_alimento_id",
              "Proveedor Alimento",
              "combobox",
              "proveedor"
            )}
            {renderFormField(
              "costo_total_alimento",
              "Costo Total Alimento",
              "number"
            )}
            {renderFormField(
              "responsable_id",
              "Responsable",
              "text",
              undefined,
              {
                value: user?.nombre || "Usuario actual",
              }
            )}
            {renderFormField("observaciones", "Observaciones")}
          </div>

          <DialogFooter>
            <Button
              onClick={() => handleSubmit(dialogType as "create" | "edit")}
            >
              {dialogType === "create" ? "Crear" : "Actualizar"} Alimentación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
