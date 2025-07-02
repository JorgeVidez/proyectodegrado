"use client";

import {
  useTratamientosSanitarios,
  TratamientosSanitarios,
  TratamientosSanitariosBase,
  deleteTratamientoSanitario,
  updateTratamientoSanitario,
  createTratamientoSanitario,
} from "@/hooks/useTratamientosSanitarios";
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
import { Pencil, Trash2, Eye } from "lucide-react";
import { AnimalCombobox } from "@/components/AnimalCombobox";
import { DatePicker } from "@/components/DatePicker";
import { MedicamentoCombobox } from "@/components/MedicamentoCombobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProveedorCombobox } from "@/components/ProveedorCombobox";
import { useAuth } from "@/context/AuthContext";
import { z } from "zod";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Esquema de validación
const tratamientoSchema = z.object({
  animal_id: z.number().min(1, "Se requiere un animal"),
  fecha_diagnostico: z.string().min(1, "Fecha de diagnóstico es requerida"),
  sintomas_observados: z.string().optional(),
  diagnostico: z.string().optional(),
  fecha_inicio_tratamiento: z.string().optional(),
  medicamento_id: z.number().optional(),
  dosis_aplicada: z.number().min(0, "Dosis debe ser positiva").optional(),
  unidad_dosis: z.string().optional(),
  via_administracion: z.string().optional(),
  duracion_tratamiento_dias: z
    .number()
    .min(0, "Duración debe ser positiva")
    .optional(),
  fecha_fin_tratamiento: z.string().optional(),
  proveedor_medicamento_id: z.number().optional(),
  responsable_veterinario_id: z.number().optional(),
  periodo_retiro_aplicable_dias: z
    .number()
    .min(0, "Período debe ser positivo")
    .optional(),
  fecha_fin_retiro: z.string().optional(),
  proxima_revision: z.string().optional(),
  resultado_tratamiento: z.string().optional(),
  observaciones: z.string().optional(),
});

type TratamientoFormState = z.infer<typeof tratamientoSchema>;

export default function ListaTratamientosSanitarios() {
  const { tratamientos, isLoading, isError, refresh } =
    useTratamientosSanitarios();
  const { user } = useAuth();
  const [dialogType, setDialogType] = useState<
    "create" | "edit" | "details" | null
  >(null);
  const [selectedTratamiento, setSelectedTratamiento] =
    useState<TratamientosSanitarios | null>(null);
  const [formState, setFormState] = useState<TratamientoFormState>({
    animal_id: 0,
    fecha_diagnostico: "",
    sintomas_observados: undefined,
    diagnostico: undefined,
    fecha_inicio_tratamiento: undefined,
    medicamento_id: undefined,
    dosis_aplicada: undefined,
    unidad_dosis: undefined,
    via_administracion: undefined,
    duracion_tratamiento_dias: undefined,
    fecha_fin_tratamiento: undefined,
    proveedor_medicamento_id: undefined,
    responsable_veterinario_id: undefined,
    periodo_retiro_aplicable_dias: undefined,
    fecha_fin_retiro: undefined,
    proxima_revision: undefined,
    resultado_tratamiento: undefined,
    observaciones: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [search, setSearch] = useState("");
  const [resultadoFiltro, setResultadoFiltro] = useState<string | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const resultadosPorPagina = 10;

  useEffect(() => {
    if (isError) console.error(isError);
  }, [isError]);

  useEffect(() => {
    if (user?.usuario_id) {
      setFormState((prev) => ({
        ...prev,
        responsable_veterinario_id: user.usuario_id,
      }));
    }
  }, [user]);

  const resetForm = () => {
    setFormState({
      animal_id: 0,
      fecha_diagnostico: "",
      sintomas_observados: undefined,
      diagnostico: undefined,
      fecha_inicio_tratamiento: undefined,
      medicamento_id: undefined,
      dosis_aplicada: undefined,
      unidad_dosis: undefined,
      via_administracion: undefined,
      duracion_tratamiento_dias: undefined,
      fecha_fin_tratamiento: undefined,
      proveedor_medicamento_id: undefined,
      responsable_veterinario_id: user?.usuario_id,
      periodo_retiro_aplicable_dias: undefined,
      fecha_fin_retiro: undefined,
      proxima_revision: undefined,
      resultado_tratamiento: undefined,
      observaciones: undefined,
    });
    setErrors({});
  };

  const handleOpenDialog = (
    type: "create" | "edit" | "details",
    tratamiento?: TratamientosSanitarios
  ) => {
    setDialogType(type);
    if (tratamiento) {
      setSelectedTratamiento(tratamiento);
      if (type !== "details") {
        setFormState({
          animal_id: tratamiento.animal_id,
          fecha_diagnostico: tratamiento.fecha_diagnostico,
          sintomas_observados: tratamiento.sintomas_observados ?? undefined,
          diagnostico: tratamiento.diagnostico ?? undefined,
          fecha_inicio_tratamiento:
            tratamiento.fecha_inicio_tratamiento ?? undefined,
          medicamento_id: tratamiento.medicamento_id ?? undefined,
          dosis_aplicada: tratamiento.dosis_aplicada ?? undefined,
          unidad_dosis: tratamiento.unidad_dosis ?? undefined,
          via_administracion: tratamiento.via_administracion ?? undefined,
          duracion_tratamiento_dias:
            tratamiento.duracion_tratamiento_dias ?? undefined,
          fecha_fin_tratamiento: tratamiento.fecha_fin_tratamiento ?? undefined,
          proveedor_medicamento_id:
            tratamiento.proveedor_medicamento_id ?? undefined,
          responsable_veterinario_id:
            tratamiento.responsable_veterinario_id ?? undefined,
          periodo_retiro_aplicable_dias:
            tratamiento.periodo_retiro_aplicable_dias ?? undefined,
          fecha_fin_retiro: tratamiento.fecha_fin_retiro ?? undefined,
          proxima_revision: tratamiento.proxima_revision ?? undefined,
          resultado_tratamiento: tratamiento.resultado_tratamiento ?? undefined,
          observaciones: tratamiento.observaciones ?? undefined,
        });
      }
    } else {
      resetForm();
    }
  };

  const handleCloseDialog = () => {
    setDialogType(null);
    setSelectedTratamiento(null);
    resetForm();
  };

  const handleChange = (field: keyof TratamientoFormState, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    try {
      tratamientoSchema.parse(formState);
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
        await createTratamientoSanitario(formState);
        showAlert("Tratamiento sanitario creado con éxito.", "success");
      } else if (selectedTratamiento) {
        await updateTratamientoSanitario(
          selectedTratamiento.tratamiento_id,
          formState
        );
        showAlert("Tratamiento sanitario actualizado con éxito.", "success");
      }
      refresh();
      handleCloseDialog();
    } catch (err) {
      showAlert(
        `Error al ${type === "create" ? "crear" : "actualizar"} el tratamiento sanitario.`,
        "error"
      );
    }
  };

  const handleDeleteTratamiento = async (tratamientoId: number) => {
    try {
      await deleteTratamientoSanitario(tratamientoId);
      showAlert("Tratamiento sanitario eliminado con éxito.", "success");
      refresh();
    } catch (err) {
      showAlert("Error al eliminar el tratamiento sanitario.", "error");
    }
  };

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar tratamientos sanitarios</div>;

  const tratamientosFiltrados =
    tratamientos?.filter((t) => {
      const coincideBusqueda =
        t.animal?.nombre_identificatorio
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        t.sintomas_observados?.toLowerCase().includes(search.toLowerCase()) ||
        t.diagnostico?.toLowerCase().includes(search.toLowerCase());

      const coincideResultado =
        resultadoFiltro === " " || t.resultado_tratamiento === resultadoFiltro;

      return coincideBusqueda && coincideResultado;
    }) || [];

  const totalPaginas = Math.ceil(
    tratamientosFiltrados.length / resultadosPorPagina
  );

  const tratamientosPaginados = tratamientosFiltrados.slice(
    (paginaActual - 1) * resultadosPorPagina,
    paginaActual * resultadosPorPagina
  );

  const renderFormField = (
    field: keyof TratamientoFormState,
    label: string,
    type:
      | "text"
      | "number"
      | "date"
      | "select"
      | "combobox"
      | "animal"
      | "medicamento"
      | "proveedor" = "text",
    options?: { value: string; label: string }[],
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
          ) : type === "select" && options ? (
            <Select
              value={value as string}
              onValueChange={(val) => handleChange(field, val)}
              {...extraProps}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={`Seleccionar ${label.toLowerCase()}`}
                />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : type === "animal" ? (
            <AnimalCombobox
              value={value as number}
              onChange={(id) => handleChange(field, id ?? 0)}
              label={label}
              {...extraProps}
            />
          ) : type === "medicamento" ? (
            <MedicamentoCombobox
              value={value as number | undefined}
              onChange={(id) => handleChange(field, id ?? undefined)}
              label={label}
              {...extraProps}
            />
          ) : type === "proveedor" ? (
            <ProveedorCombobox
              value={value as number | undefined}
              onChange={(id) => handleChange(field, id ?? undefined)}
              label={label}
              {...extraProps}
            />
          ) : (
            <Input
              id={field}
              type={type}
              min={type === "number" ? 0 : undefined}
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
              disabled={field === "responsable_veterinario_id"}
              {...extraProps}
            />
          )}
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      </div>
    );
  };

  const renderDetails = () => {
    if (!selectedTratamiento) return null;

    // Define a mapping for how to display specific keys and their values
    // This map explicitly tells us how to render each potential key.
    // Define a mapping for how to display specific keys and their values
    // This map explicitly tells us how to render each potential key.
    const displayMap: Record<string, string | null | ((value: any) => string)> =
      {
        // Direct mappings for simple fields
        tratamiento_id: "Tratamiento Id",
        fecha_diagnostico: "Fecha Diagnóstico",
        sintomas_observados: "Síntomas Observados",
        diagnostico: "Diagnóstico",
        fecha_inicio_tratamiento: "Fecha Inicio Tratamiento",
        dosis_aplicada: "Dosis Aplicada",
        unidad_dosis: "Unidad Dosis",
        via_administracion: "Vía Administración",
        duracion_tratamiento_dias: "Duración Tratamiento Días",
        fecha_fin_tratamiento: "Fecha Fin Tratamiento",
        periodo_retiro_aplicable_dias: "Periodo Retiro Aplicable Días",
        fecha_fin_retiro: "Fecha Fin Retiro",
        proxima_revision: "Proxima Revisión",
        resultado_tratamiento: "Resultado Tratamiento",
        observaciones: "Observaciones",

        // Special handling for nested objects - these are functions that format the value
        animal: (value) =>
          value
            ? `Id: ${value.animal_id}, Nro. Trazabilidad: ${value.numero_trazabilidad}, Nombre: ${value.nombre_identificatorio}`
            : "N/A",
        proveedor_medicamento: (value) =>
          value ? `Id: ${value.proveedor_id}, Nombre: ${value.nombre}` : "N/A",
        responsable_veterinario: (value) =>
          value
            ? `Id: ${value.usuario_id}, Nombre: ${value.nombre}, Email: ${value.email}`
            : "N/A",
        medicamento: (value) =>
          value
            ? `Id: ${value.medicamento_id}, Nombre: ${value.nombre_comercial}`
            : "N/A", // Assuming you might have a 'medicamento' object

        // Explicitly exclude internal IDs if they are redundant with the nested object display
        animal_id: null,
        medicamento_id: null,
        proveedor_medicamento_id: null,
        responsable_veterinario_id: null,
      };

    return (
      <div className="space-y-4">
        {Object.entries(selectedTratamiento).map(([key, value]) => {
          // Skip if the value is null or if the key is explicitly set to null for exclusion in displayMap
          if (value === null || displayMap[key] === null) {
            return null;
          }

          let displayLabel = key.replace(/_/g, " "); // Default: convert snake_case to readable
          let displayValue = value?.toString() || "N/A"; // Default: string representation

          // Check if there's a custom mapping for this key
          if (displayMap.hasOwnProperty(key)) {
            const mapEntry = displayMap[key];

            if (typeof mapEntry === "function") {
              // If it's a function, it means it's a nested object to be formatted
              displayValue = mapEntry(value);
              // Use a specific label for these if desired, otherwise default (snake_case replaced)
              displayLabel = key
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
            } else if (typeof mapEntry === "string") {
              // If it's a string, it's a custom label
              displayLabel = mapEntry;
            }
            // If mapEntry is null, it's already handled by the initial `if (displayMap[key] === null)`
          } else if (typeof value === "object" && value !== null) {
            // Fallback for any other unmapped objects: stringify them
            displayValue = JSON.stringify(value);
            displayLabel = key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
          }
          // Capitalize the first letter of the display label if it's not custom-defined
          // and we are using the default snake_case conversion.
          if (
            typeof displayMap[key] !== "string" &&
            typeof displayMap[key] !== "function"
          ) {
            displayLabel =
              displayLabel.charAt(0).toUpperCase() + displayLabel.slice(1);
          }

          return (
            <div key={key} className="grid grid-cols-4 gap-4">
              <Label className="text-right">{displayLabel}:</Label>
              <div className="col-span-3">{displayValue}</div>
            </div>
          );
        })}
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
                <BreadcrumbPage>Tratamientos Sanitarios</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="p-4 flex flex-col">
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

        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Lista de Tratamientos Sanitarios
          </h1>
          <Button onClick={() => handleOpenDialog("create")}>
            Crear Nuevo Tratamiento
          </Button>
        </header>
        <Separator className="my-4" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div className="flex flex-col gap-1 w-full md:max-w-sm">
            <Label htmlFor="search">Buscar</Label>
            <Input
              id="search"
              placeholder="Buscar por animal, síntomas o diagnóstico..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPaginaActual(1);
              }}
            />
          </div>

          <div className="flex flex-col gap-1 w-full md:w-64">
            <Label htmlFor="resultadoFiltro">Resultado Tratamiento</Label>
            <Select
              value={resultadoFiltro ?? ""}
              onValueChange={(value) => {
                setResultadoFiltro(value === "" ? null : value);
                setPaginaActual(1);
              }}
            >
              <SelectTrigger id="resultadoFiltro">
                <SelectValue placeholder="Todos los resultados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">Todos</SelectItem>
                <SelectItem value="Exitoso">Exitoso</SelectItem>
                <SelectItem value="Fallido">Fallido</SelectItem>
                <SelectItem value="En progreso">En progreso</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Animal</TableHead>
              <TableHead className="hidden md:table-cell">
                Síntomas Observados
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Diagnóstico
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                Fecha Fin Tratamiento
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                Próxima Revisión
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Resultado Tratamiento
              </TableHead>
              <TableHead>Observaciones</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tratamientosPaginados?.map((t) => (
              <TableRow key={t.tratamiento_id}>
                <TableCell className="font-medium">
                  {t.animal?.nombre_identificatorio}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {t.sintomas_observados}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {t.diagnostico}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {t.fecha_fin_tratamiento}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {t.proxima_revision}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {t.resultado_tratamiento}
                </TableCell>
                <TableCell>{t.observaciones}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenDialog("edit", t)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog("details", t)}
                  >
                    <Eye size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {totalPaginas > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (paginaActual > 1) setPaginaActual((prev) => prev - 1);
                  }}
                />
              </PaginationItem>

              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                (pagina) => (
                  <PaginationItem key={pagina}>
                    <PaginationLink
                      href="#"
                      isActive={pagina === paginaActual}
                      onClick={(e) => {
                        e.preventDefault();
                        setPaginaActual(pagina);
                      }}
                    >
                      {pagina}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (paginaActual < totalPaginas)
                      setPaginaActual((prev) => prev + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Diálogos */}
      <Dialog
        open={dialogType !== null}
        onOpenChange={(open) => !open && handleCloseDialog()}
      >
        <DialogContent className="sm:max-w-[600px] md:max-w-[750px] lg:max-w-[950px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogType === "create"
                ? "Crear Nuevo Tratamiento Sanitario"
                : dialogType === "edit"
                  ? "Editar Tratamiento Sanitario"
                  : "Detalles del Tratamiento"}
            </DialogTitle>
            <DialogDescription>
              {dialogType === "create"
                ? "Ingresa los detalles del nuevo tratamiento sanitario."
                : dialogType === "edit"
                  ? "Edita los detalles del tratamiento sanitario."
                  : "Información detallada del tratamiento sanitario."}
            </DialogDescription>
          </DialogHeader>

          {dialogType === "details" ? (
            renderDetails()
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 py-4">
              {renderFormField("animal_id", "Animal", "animal")}
              {renderFormField(
                "fecha_diagnostico",
                "Fecha Diagnóstico",
                "date"
              )}
              {renderFormField("sintomas_observados", "Síntomas Observados")}
              {renderFormField("diagnostico", "Diagnóstico")}
              {renderFormField(
                "fecha_inicio_tratamiento",
                "Fecha Inicio Tratamiento",
                "date"
              )}
              {renderFormField("medicamento_id", "Medicamento", "medicamento")}
              {renderFormField("dosis_aplicada", "Dosis Aplicada", "number")}
              {renderFormField("unidad_dosis", "Unidad Dosis", "select", [
                { value: "ml", label: "ml" },
                { value: "mg", label: "mg" },
                { value: "g", label: "g" },
                { value: "UI", label: "UI" },
                { value: "dosis", label: "dosis" },
                { value: "otro", label: "Otro" },
              ])}
              {renderFormField(
                "via_administracion",
                "Vía Administración",
                "select",
                [
                  { value: "oral", label: "Oral" },
                  { value: "intravenosa", label: "Intravenosa" },
                  { value: "intramuscular", label: "Intramuscular" },
                  { value: "subcutanea", label: "Subcutánea" },
                  { value: "topica", label: "Tópica" },
                  { value: "otro", label: "Otro" },
                ]
              )}
              {renderFormField(
                "duracion_tratamiento_dias",
                "Duración Tratamiento (días)",
                "number"
              )}
              {renderFormField(
                "fecha_fin_tratamiento",
                "Fecha Fin Tratamiento",
                "date"
              )}
              {renderFormField(
                "proveedor_medicamento_id",
                "Proveedor Medicamento",
                "proveedor"
              )}
              {renderFormField(
                "responsable_veterinario_id",
                "Responsable Veterinario",
                "text",
                undefined,
                {
                  value: user?.nombre?.toString() || "",
                }
              )}
              {renderFormField(
                "periodo_retiro_aplicable_dias",
                "Periodo Retiro (días)",
                "number"
              )}
              {renderFormField("fecha_fin_retiro", "Fecha Fin Retiro", "date")}
              {renderFormField("proxima_revision", "Próxima Revisión", "date")}
              {renderFormField(
                "resultado_tratamiento",
                "Resultado Tratamiento"
              )}
              {renderFormField("observaciones", "Observaciones")}
            </div>
          )}

          {dialogType !== "details" && (
            <DialogFooter>
              <Button
                onClick={() => handleSubmit(dialogType as "create" | "edit")}
              >
                {dialogType === "create" ? "Crear" : "Actualizar"} Tratamiento
                Sanitario
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
