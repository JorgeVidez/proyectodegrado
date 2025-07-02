"use client";

import {
  useMovimientosAnimal,
  TipoMovimiento,
  MovimientoAnimal,
  MovimientoAnimalBase,
  updateMovimientoAnimal,
  deleteMovimientoAnimal,
} from "@/hooks/useMovimientosAnimal";
import { useEffect, useRef, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UbicacionCombobox } from "@/components/UbicacionCombobox";
import { LoteCombobox } from "@/components/LoteCombobox";
import { ProveedorCombobox } from "@/components/ProveedorCombobox";
import { ClienteCombobox } from "@/components/ClienteCombobox";
import { useAuth } from "@/context/AuthContext";
import { createMovimientoAnimal } from "../../../../hooks/useMovimientosAnimal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import {
  movimientoAnimalFormSchema,
  MovimientoAnimalFormSchema,
} from "@/schemas/movimientoAnimalFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ListaMovimientosAnimales() {
  const { movimientos, isLoading, isError, refresh } = useMovimientosAnimal();
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedMovimiento, setSelectedMovimiento] =
    useState<MovimientoAnimal | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  // Reference for the form methods to be able to submit from the parent component
  const createFormMethodsRef =
    useRef<UseFormReturn<MovimientoAnimalFormSchema> | null>(null);

  const editFormMethodsRef =
    useRef<UseFormReturn<MovimientoAnimalFormSchema> | null>(null);

  // Filtros y paginación
  const [filters, setFilters] = useState({
    animal: "",
    tipoMovimiento: " ",
    proveedor: "",
    cliente: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (isError) console.error(isError);
  }, [isError]);

  const resetFormStates = () => {
    setSelectedMovimiento(null);
    createFormMethodsRef.current?.reset();
    editFormMethodsRef.current?.reset();
  };

  const showAlert = (message: string, type: "success" | "error") => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const handleCreateMovimientoSubmit = async (
    data: MovimientoAnimalFormSchema
  ) => {
    try {
      // Ensure user_id is included from the authenticated user
      const dataWithUserId = { ...data, usuario_id: user?.usuario_id };
      console.log("Creating movimiento with data:", dataWithUserId);
      await createMovimientoAnimal(dataWithUserId as MovimientoAnimalBase);
      showAlert("Movimiento creado con éxito.", "success");
      setIsCreateDialogOpen(false);
      resetFormStates(); // Reset forms
      refresh();
    } catch (err) {
      showAlert("Error al crear el movimiento.", "error");
    }
  };

  const handleEditMovimiento = (movimiento: MovimientoAnimal) => {
    setSelectedMovimiento(movimiento); // esto hará que se pasen como defaultValues
    setIsEditDialogOpen(true); // y el form se montará con esos valores
  };

  const handleUpdateMovimientoSubmit = async (
    data: MovimientoAnimalFormSchema
  ) => {
    if (selectedMovimiento) {
      try {
        await updateMovimientoAnimal(
          selectedMovimiento.movimiento_id,
          data as Partial<MovimientoAnimalBase>
        );
        showAlert("Movimiento actualizado con éxito.", "success");
        setIsEditDialogOpen(false);
        resetFormStates(); // Reset forms
        refresh();
      } catch (err) {
        showAlert("Error al actualizar el movimiento.", "error");
      }
    }
  };

  const handleDeleteMovimiento = async (movimientoId: number) => {
    try {
      await deleteMovimientoAnimal(movimientoId);
      showAlert("Movimiento eliminado con éxito.", "success");
      refresh();
    } catch (err) {
      showAlert("Error al eliminar el movimiento.", "error");
    }
  };

  // Filtrar movimientos
  const filteredMovimientos =
    movimientos?.filter((movimiento) => {
      return (
        (movimiento.animal.nombre_identificatorio
          ?.toLowerCase()
          .includes(filters.animal.toLowerCase()) ||
          filters.animal === "") &&
        (filters.tipoMovimiento === " " ||
          movimiento.tipo_movimiento === filters.tipoMovimiento) &&
        (filters.proveedor === "" ||
          movimiento.proveedor?.nombre
            .toLowerCase()
            .includes(filters.proveedor.toLowerCase())) &&
        (filters.cliente === "" ||
          movimiento.cliente?.nombre
            .toLowerCase()
            .includes(filters.cliente.toLowerCase()))
      );
    }) || [];

  // Paginación
  const totalPages = Math.ceil(filteredMovimientos.length / itemsPerPage);
  const paginatedMovimientos = filteredMovimientos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar movimientos</div>;

  const MovimientoForm = ({
    onSubmit,
    defaultValues,
    setFormMethods, // New prop to pass useForm methods back to parent
  }: {
    onSubmit: (data: MovimientoAnimalFormSchema) => void;
    defaultValues?: MovimientoAnimalFormSchema;
    setFormMethods?: (
      methods: UseFormReturn<MovimientoAnimalFormSchema>
    ) => void;
  }) => {
    const methods = useForm<MovimientoAnimalFormSchema>({
      resolver: zodResolver(movimientoAnimalFormSchema),
      defaultValues: defaultValues || {
        animal_id: 0,
        tipo_movimiento: TipoMovimiento.IngresoCompra,
        origen_ubicacion_id: undefined,
        destino_ubicacion_id: undefined,
        origen_lote_id: undefined,
        destino_lote_id: undefined,
        proveedor_id: undefined,
        cliente_id: undefined,
        documento_referencia: "",
        observaciones: "",
        usuario_id: undefined, // Will be set by the parent
      },
    });

    useEffect(() => {
      if (defaultValues) {
        const isDifferent =
          JSON.stringify(methods.getValues()) !== JSON.stringify(defaultValues);
        if (isDifferent) {
          methods.reset(defaultValues);
        }
      }
    }, [defaultValues]);

    useEffect(() => {
      if (setFormMethods) {
        setFormMethods(methods);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        onSubmit={methods.handleSubmit(onSubmit)} // Use methods.handleSubmit
        className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 py-4 max-h-96 overflow-y-auto"
      >
        {renderField(
          "Animal",
          "animalId",
          <Controller
            name="animal_id"
            control={methods.control}
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
          "Tipo Movimiento",
          "tipoMovimiento",
          <Controller
            name="tipo_movimiento"
            control={methods.control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar Tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TipoMovimiento).map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}

        {renderField(
          "Origen Ubicación",
          "origenUbicacionId",
          <Controller
            name="origen_ubicacion_id"
            control={methods.control}
            render={({ field }) => (
              <UbicacionCombobox
                label="origen"
                value={field.value ?? null}
                onChange={field.onChange}
              />
            )}
          />
        )}

        {renderField(
          "Destino Ubicación",
          "destinoUbicacionId",
          <Controller
            name="destino_ubicacion_id"
            control={methods.control}
            render={({ field }) => (
              <UbicacionCombobox
                label="destino"
                value={field.value ?? null}
                onChange={field.onChange}
              />
            )}
          />
        )}

        {renderField(
          "Origen Lote",
          "origenLoteId",
          <Controller
            name="origen_lote_id"
            control={methods.control}
            render={({ field }) => (
              <LoteCombobox
                label="origen"
                value={field.value ?? null}
                onChange={field.onChange}
              />
            )}
          />
        )}

        {renderField(
          "Destino Lote",
          "destinoLoteId",
          <Controller
            name="destino_lote_id"
            control={methods.control}
            render={({ field }) => (
              <LoteCombobox
                label="destino"
                value={field.value ?? null}
                onChange={field.onChange}
              />
            )}
          />
        )}

        {renderField(
          "Proveedor",
          "proveedorId",
          <Controller
            name="proveedor_id"
            control={methods.control}
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
          "Cliente",
          "clienteId",
          <Controller
            name="cliente_id"
            control={methods.control}
            render={({ field }) => (
              <ClienteCombobox
                label="cliente"
                value={field.value ?? undefined}
                onChange={field.onChange}
              />
            )}
          />
        )}

        {renderField(
          "Documento Referencia",
          "documentoReferencia",
          <Controller
            name="documento_referencia"
            control={methods.control}
            render={({ field }) => (
              <Select
                value={field.value || ""}
                onValueChange={(value) =>
                  field.onChange(value === " " ? null : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar Documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">Ninguno</SelectItem>
                  <SelectItem value="Factura">Factura</SelectItem>
                  <SelectItem value="Recibo">Recibo</SelectItem>
                  <SelectItem value="Otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        )}

        {renderField(
          "Observaciones",
          "observaciones",
          <Controller
            name="observaciones"
            control={methods.control}
            render={({ field }) => (
              <Input {...field} value={field.value || ""} />
            )}
          />
        )}
      </form>
    );
  };

  return (
    <div className="flex h-screen flex-col">
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
                <BreadcrumbPage>Movimientos</BreadcrumbPage>
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
            <h1 className="text-2xl font-bold">Lista de Movimientos</h1>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Crear Nuevo Movimiento
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
              value={filters.tipoMovimiento}
              onValueChange={(value) =>
                setFilters({ ...filters, tipoMovimiento: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">Todos</SelectItem>
                {Object.values(TipoMovimiento).map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo.replace(/([A-Z])/g, " $1").trim()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Filtrar por proveedor"
              value={filters.proveedor}
              onChange={(e) =>
                setFilters({ ...filters, proveedor: e.target.value })
              }
            />

            <Input
              placeholder="Filtrar por cliente"
              value={filters.cliente}
              onChange={(e) =>
                setFilters({ ...filters, cliente: e.target.value })
              }
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Animal</TableHead>
                <TableHead>Tipo Movimiento</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Proveedor
                </TableHead>
                <TableHead className="hidden lg:table-cell">Cliente</TableHead>
                <TableHead className="hidden md:table-cell">
                  Documento
                </TableHead>
                <TableHead className="hidden md:table-cell">Usuario</TableHead>
                <TableHead className="hidden md:table-cell">
                  Observaciones
                </TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMovimientos.map((movimiento) => (
                <TableRow key={movimiento.movimiento_id}>
                  <TableCell>
                    {movimiento.animal.nombre_identificatorio}
                  </TableCell>
                  <TableCell>{movimiento.tipo_movimiento}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {movimiento.proveedor?.nombre || "N/A"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {movimiento.cliente?.nombre || "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {movimiento.documento_referencia || "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {movimiento.usuario?.nombre || "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {movimiento.observaciones || "N/A"}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsDetailsDialogOpen(true)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditMovimiento(movimiento)}
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
          <DialogContent className="max-w-sm sm:max-w-[600px] md:max-w-[750px] lg:max-w-[950px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Movimiento</DialogTitle>
              <DialogDescription>
                Ingresa los detalles del nuevo movimiento.
              </DialogDescription>
            </DialogHeader>
            <MovimientoForm
              setFormMethods={(methods) => {
                createFormMethodsRef.current = methods;
              }} // Pass setter to get methods
              onSubmit={handleCreateMovimientoSubmit} // Pass the submit handler
            />

            <DialogFooter>
              <Button
                onClick={() =>
                  createFormMethodsRef.current?.handleSubmit(
                    handleCreateMovimientoSubmit
                  )()
                }
              >
                Crear Movimiento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-sm sm:max-w-[600px] md:max-w-[750px] lg:max-w-[950px]">
            <DialogHeader>
              <DialogTitle>Editar Movimiento</DialogTitle>
              <DialogDescription>
                Actualiza los detalles del movimiento.
              </DialogDescription>
            </DialogHeader>
            {selectedMovimiento && ( // Only render form if selectedMovimiento exists
              <MovimientoForm
                setFormMethods={(methods) => {
                  createFormMethodsRef.current = methods; // o editFormMethodsRef.current
                }}
                defaultValues={{
                  ...selectedMovimiento,
                  documento_referencia:
                    selectedMovimiento.documento_referencia ?? "",
                  observaciones: selectedMovimiento.observaciones ?? "",
                }}
                onSubmit={handleUpdateMovimientoSubmit} // Pass the submit handler
              />
            )}

            <DialogFooter>
              <Button
                onClick={() =>
                  createFormMethodsRef.current?.handleSubmit(
                    handleUpdateMovimientoSubmit
                  )()
                }
              >
                Actualizar Movimiento
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
              <DialogTitle>Detalles del Movimiento</DialogTitle>
              <DialogDescription>
                Información detallada del movimiento seleccionado.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {selectedMovimiento && (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      label: "ID Movimiento",
                      value: selectedMovimiento.movimiento_id,
                    },
                    {
                      label: "Animal",
                      value: selectedMovimiento.animal.nombre_identificatorio,
                    },
                    {
                      label: "Tipo Movimiento",
                      value: selectedMovimiento.tipo_movimiento,
                    },
                    {
                      label: "Origen Ubicación",
                      value:
                        selectedMovimiento.origen_ubicacion?.nombre || "N/A",
                    },
                    {
                      label: "Destino Ubicación",
                      value:
                        selectedMovimiento.destino_ubicacion?.nombre || "N/A",
                    },
                    {
                      label: "Origen Lote",
                      value:
                        selectedMovimiento.origen_lote?.codigo_lote || "N/A",
                    },
                    {
                      label: "Destino Lote",
                      value:
                        selectedMovimiento.destino_lote?.codigo_lote || "N/A",
                    },
                    {
                      label: "Proveedor",
                      value: selectedMovimiento.proveedor?.nombre || "N/A",
                    },
                    {
                      label: "Cliente",
                      value: selectedMovimiento.cliente?.nombre || "N/A",
                    },
                    {
                      label: "Documento Referencia",
                      value: selectedMovimiento.documento_referencia || "N/A",
                    },
                    {
                      label: "Usuario",
                      value: selectedMovimiento.usuario?.nombre || "N/A",
                    },
                    {
                      label: "Observaciones",
                      value: selectedMovimiento.observaciones || "N/A",
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
