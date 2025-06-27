"use client";

import {
  useControlesSanitarios,
  ControlesSanitarios,
  ControlesSanitariosBase,
  createControlSanitario,
  updateControlSanitario,
  deleteControlSanitario,
} from "@/hooks/useControlesSanitarios";
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
import { useAuth } from "@/context/AuthContext";
import { UbicacionCombobox } from "@/components/UbicacionCombobox";
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
  controlSanitarioFormSchema,
  ControlSanitarioFormSchema,
} from "@/schemas/controlSanitarioFormSchema";

type ControlFormState = {
  animal_id: number;
  fecha_control?: string;
  peso_kg?: number;
  condicion_corporal?: number;
  altura_cm?: number;
  responsable_id?: number;
  ubicacion_id?: number;
  observaciones?: string;
};

const initialState: ControlFormState = {
  animal_id: 0,
};

export default function ListaControlesSanitarios() {
  const { controles, isLoading, isError, refresh } = useControlesSanitarios();
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedControl, setSelectedControl] =
    useState<ControlesSanitarios | null>(null);
  const [formData, setFormData] = useState<ControlFormState>(initialState);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  // Filtros y paginación
  const [filters, setFilters] = useState({
    animal: "",
    fechaDesde: "",
    fechaHasta: "",
    responsable: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (user?.usuario_id) {
      setFormData((prev) => ({ ...prev, responsable_id: user.usuario_id }));
    }
  }, [user]);

  useEffect(() => {
    if (isError) console.error(isError);
  }, [isError]);

  const handleInputChange = (field: keyof ControlFormState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => { 
    setSelectedControl(null);
  };

  const showAlert = (message: string, type: "success" | "error") => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const handleCreateControl = async (data: ControlSanitarioFormSchema) => {
    try {
      await createControlSanitario(data);
      showAlert("Control sanitario creado con éxito.", "success");
      setIsCreateDialogOpen(false);
      resetForm();
      refresh();
    } catch (err) {
      showAlert("Error al crear el control sanitario.", "error");
    }
  };

  const handleEditControl = (control: ControlesSanitarios) => {
    setSelectedControl(control);
    setFormData({
      animal_id: control.animal_id,
      fecha_control: control.fecha_control,
      peso_kg: control.peso_kg || undefined,
      condicion_corporal: control.condicion_corporal || undefined,
      altura_cm: control.altura_cm || undefined,
      responsable_id: control.responsable_id || undefined,
      ubicacion_id: control.ubicacion_id || undefined,
      observaciones: control.observaciones || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateControl = async (data: ControlSanitarioFormSchema) => {
    if (selectedControl) {
      try {
        await updateControlSanitario(selectedControl.control_id, data);
        showAlert("Control sanitario actualizado con éxito.", "success");
        setIsEditDialogOpen(false);
        resetForm();
        refresh();
      } catch (err) {
        showAlert("Error al actualizar el control sanitario.", "error");
      }
    }
  };

  const handleDeleteControl = async (controlId: number) => {
    try {
      await deleteControlSanitario(controlId);
      showAlert("Control sanitario eliminado con éxito.", "success");
      refresh();
    } catch (err) {
      showAlert("Error al eliminar el control sanitario.", "error");
    }
  };

  // Filtrar controles
  const filteredControles =
    controles?.filter((control) => {
      const fechaControl = new Date(control.fecha_control || "");
      const fechaDesde = filters.fechaDesde
        ? new Date(filters.fechaDesde)
        : null;
      const fechaHasta = filters.fechaHasta
        ? new Date(filters.fechaHasta)
        : null;

      return (
        (control.animal?.nombre_identificatorio
          ?.toLowerCase()
          .includes(filters.animal.toLowerCase()) ||
          filters.animal === "") &&
        (!fechaDesde || fechaControl >= fechaDesde) &&
        (!fechaHasta || fechaControl <= fechaHasta) &&
        (filters.responsable === "" ||
          control.responsable?.nombre
            .toLowerCase()
            .includes(filters.responsable.toLowerCase()))
      );
    }) || [];

  // Paginación
  const totalPages = Math.ceil(filteredControles.length / itemsPerPage);
  const paginatedControles = filteredControles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar controles sanitarios</div>;

  const renderFormField = (
    label: string,
    id: string,
    field: keyof ControlFormState,
    children: React.ReactNode
  ) => (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <div className="col-span-3">{children}</div>
    </div>
  );

  const ControlForm = ({
    onSubmit,
    defaultValues,
  }: {
    onSubmit: (data: ControlSanitarioFormSchema) => void;
    defaultValues?: ControlSanitarioFormSchema;
  }) => {
    const { control, handleSubmit, reset } =
      useForm<ControlSanitarioFormSchema>({
        resolver: zodResolver(controlSanitarioFormSchema),
        defaultValues: defaultValues || {
          animal_id: 0,
        },
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
        onSubmit={handleSubmit(onSubmit)}
        id="control-form"
        className="grid gap-4 py-4"
      >
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
          "Fecha Control",
          "fechaControl",
          <Controller
            name="fecha_control"
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
          "Peso (kg)",
          "pesoKg",
          <Controller
            name="peso_kg"
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
          "Condición Corporal %",
          "condicionCorporal",
          <Controller
            name="condicion_corporal"
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
          "Altura (cm)",
          "alturaCm",
          <Controller
            name="altura_cm"
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
          "Responsable",
          "responsableId",
          <Input value={user?.nombre || ""} disabled />
        )}

        {renderField(
          "Ubicación",
          "ubicacionId",
          <Controller
            name="ubicacion_id"
            control={control}
            render={({ field }) => (
              <UbicacionCombobox
                label="ubicación"
                value={field.value ?? null}
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
              <Input value={field.value ?? ""} onChange={field.onChange} />
            )}
          />
        )}
      </form>
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
                <BreadcrumbPage>Controles Sanitarios</BreadcrumbPage>
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
            <h1 className="text-2xl font-bold">
              Lista de Controles Sanitarios
            </h1>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Crear Nuevo Control
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

            <DatePicker
              placeholder="Fecha desde"
              value={filters.fechaDesde}
              onChange={(date) =>
                setFilters({
                  ...filters,
                  fechaDesde: date?.toString().split("T")[0] || "",
                })
              }
            />

            <DatePicker
              placeholder="Fecha hasta"
              value={filters.fechaHasta}
              onChange={(date) =>
                setFilters({
                  ...filters,
                  fechaHasta: date?.toString().split("T")[0] || "",
                })
              }
            />

            <Input
              placeholder="Filtrar por responsable"
              value={filters.responsable}
              onChange={(e) =>
                setFilters({ ...filters, responsable: e.target.value })
              }
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Animal</TableHead>
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
                  Responsable
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Ubicación
                </TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedControles.map((control) => (
                <TableRow key={control.control_id}>
                  <TableCell>
                    {control.animal?.nombre_identificatorio || "N/A"}
                  </TableCell>
                  <TableCell>{control.fecha_control}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {control.peso_kg || "N/A"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {control.condicion_corporal || "N/A"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {control.altura_cm || "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {control.responsable?.nombre || "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {control.ubicacion?.nombre || "N/A"}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedControl(control);
                        setIsDetailsDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditControl(control)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteControl(control.control_id)}
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Control</DialogTitle>
              <DialogDescription>
                Ingresa los detalles del nuevo control sanitario.
              </DialogDescription>
            </DialogHeader>
            <ControlForm
              defaultValues={{
                animal_id: 0,
                responsable_id: user?.usuario_id || undefined,
              }}
              onSubmit={handleCreateControl}
            />

            <DialogFooter>
              <Button form="control-form" type="submit">
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Control</DialogTitle>
              <DialogDescription>
                Actualiza los detalles del control sanitario.
              </DialogDescription>
            </DialogHeader>
            <ControlForm
              onSubmit={handleUpdateControl}
              defaultValues={formData as ControlSanitarioFormSchema}
            />

            <DialogFooter>
              <Button form="control-form" type="submit">
                Actualizar Control
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Detalles del Control</DialogTitle>
              <DialogDescription>
                Información completa del control sanitario.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {selectedControl && (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "ID Control", value: selectedControl.control_id },
                    {
                      label: "Animal",
                      value:
                        selectedControl.animal?.nombre_identificatorio || "N/A",
                    },
                    {
                      label: "Fecha Control",
                      value: selectedControl.fecha_control,
                    },
                    {
                      label: "Peso (kg)",
                      value: selectedControl.peso_kg || "N/A",
                    },
                    {
                      label: "Condición Corporal %",
                      value: selectedControl.condicion_corporal || "N/A",
                    },
                    {
                      label: "Altura (cm)",
                      value: selectedControl.altura_cm || "N/A",
                    },
                    {
                      label: "Responsable",
                      value: selectedControl.responsable?.nombre || "N/A",
                    },
                    {
                      label: "Ubicación",
                      value: selectedControl.ubicacion?.nombre || "N/A",
                    },
                    {
                      label: "Observaciones",
                      value: selectedControl.observaciones || "N/A",
                    },
                  ].map((item, index) => (
                    <div key={index}>
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

 