"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { BreadcrumbList } from "@/components/ui/breadcrumb";
import { BreadcrumbPage } from "@/components/ui/breadcrumb";
import { BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { useState, useEffect } from "react";
import { useInventarioAnimal } from "@/hooks/useInventarioAnimal";
import { useLotes } from "@/hooks/useLotes";
import { useUbicaciones } from "@/hooks/useUbicaciones";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MoreHorizontal, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  InventarioAnimalOut,
  MotivoIngreso,
  MotivoEgreso,
  InventarioAnimalUpdate,
} from "@/types/inventarioAnimal";
import { SidebarTrigger } from "@/components/ui/sidebar";

const AsignacionSchema = z.object({
  ubicacion_actual_id: z.number().optional().nullable(),
  lote_actual_id: z.number().optional().nullable(),
  fecha_cambio: z.date(),
  motivo: z.enum([
    MotivoIngreso.Nacimiento,
    MotivoIngreso.Compra,
    MotivoIngreso.TrasladoInterno,
    MotivoEgreso.Venta,
    MotivoEgreso.Muerte,
    MotivoEgreso.Descarte,
    MotivoEgreso.TrasladoExterno,
  ]),
});

const AsignacionAnimales = () => {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState("activos");
  const [selectedAnimales, setSelectedAnimales] = useState<number[]>([]);
  const [isAsignarMultiple, setIsAsignarMultiple] = useState(false);
  const [currentInventario, setCurrentInventario] =
    useState<InventarioAnimalOut | null>(null);

  const { inventarios, isLoading, error, updateInventario } =
    useInventarioAnimal();
  const { lotes, isLoading: isLoadingLotes } = useLotes();
  const { ubicaciones, isLoading: isLoadingUbicaciones } = useUbicaciones();

  const animalesActivos = inventarios.filter((inv) => inv.activo_en_finca);
  const animalesInactivos = inventarios.filter((inv) => !inv.activo_en_finca);

  const form = useForm<z.infer<typeof AsignacionSchema>>({
    resolver: zodResolver(AsignacionSchema),
    defaultValues: {
      ubicacion_actual_id: null,
      lote_actual_id: null,
      fecha_cambio: new Date(),
      motivo: MotivoIngreso.TrasladoInterno,
    },
  });

  const handleAsignar = (inventario: InventarioAnimalOut) => {
    setCurrentInventario(inventario);
    form.reset({
      ubicacion_actual_id: inventario.ubicacion_actual?.ubicacion_id || null,
      lote_actual_id: inventario.lote_actual_id || null,
      fecha_cambio: new Date(),
      motivo: MotivoIngreso.TrasladoInterno,
    });
    setOpenDialog(true);
    setIsAsignarMultiple(false);
  };

  const handleAsignarMultiple = () => {
    if (selectedAnimales.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debe seleccionar al menos un animal para asignar.",
      });
      return;
    }

    form.reset({
      ubicacion_actual_id: null,
      lote_actual_id: null,
      fecha_cambio: new Date(),
      motivo: MotivoIngreso.TrasladoInterno,
    });
    setOpenDialog(true);
    setIsAsignarMultiple(true);
  };

  const onSubmit = async (data: z.infer<typeof AsignacionSchema>) => {
    try {
      if (isAsignarMultiple) {
        // Procesar actualizaciones múltiples
        const promises = selectedAnimales.map((animalId) => {
          const inventario = inventarios.find(
            (inv) => inv.inventario_id === animalId
          );
          if (!inventario) return Promise.resolve(null);

          const updateData: InventarioAnimalUpdate = {
            animal_id: inventario.animal_id,
            fecha_ingreso: inventario.fecha_ingreso,
            motivo_ingreso: inventario.motivo_ingreso,
            ubicacion_actual_id: data.ubicacion_actual_id,
            lote_actual_id: data.lote_actual_id,
            proveedor_compra_id: inventario.proveedor_compra?.proveedor_id,
            precio_compra: inventario.precio_compra,
            fecha_egreso: inventario.fecha_egreso,
            motivo_egreso: inventario.motivo_egreso,
          };

          return updateInventario(inventario.inventario_id, updateData);
        });

        await Promise.all(promises);

        toast({
          title: "Éxito",
          description: `${selectedAnimales.length} animales actualizados correctamente.`,
        });

        setSelectedAnimales([]);
      } else if (currentInventario) {
        // Procesar actualización individual
        const updateData: InventarioAnimalUpdate = {
          animal_id: currentInventario.animal_id,
          fecha_ingreso: currentInventario.fecha_ingreso,
          motivo_ingreso: currentInventario.motivo_ingreso,
          ubicacion_actual_id: data.ubicacion_actual_id,
          lote_actual_id: data.lote_actual_id,
          proveedor_compra_id: currentInventario.proveedor_compra?.proveedor_id,
          precio_compra: currentInventario.precio_compra,
          fecha_egreso: currentInventario.fecha_egreso,
          motivo_egreso: currentInventario.motivo_egreso,
        };

        await updateInventario(currentInventario.inventario_id, updateData);

        toast({
          title: "Éxito",
          description: `Animal actualizado correctamente.`,
        });
      }

      setOpenDialog(false);
    } catch (error) {
      console.error("Error al asignar animal:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Ocurrió un error al asignar el animal. Intente nuevamente.",
      });
    }
  };

  const toggleAnimalSelection = (inventarioId: number) => {
    setSelectedAnimales((prev) =>
      prev.includes(inventarioId)
        ? prev.filter((id) => id !== inventarioId)
        : [...prev, inventarioId]
    );
  };

  const selectAllAnimales = (checked: boolean) => {
    if (checked) {
      setSelectedAnimales(
        selectedTab === "activos"
          ? animalesActivos.map((inv) => inv.inventario_id)
          : animalesInactivos.map((inv) => inv.inventario_id)
      );
    } else {
      setSelectedAnimales([]);
    }
  };

  if (isLoading || isLoadingLotes || isLoadingUbicaciones) {
    return (
      <div className="flex justify-center items-center h-64">Cargando...</div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

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

      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Asignación de Animales</h1>

        <Tabs defaultValue="activos" onValueChange={setSelectedTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="activos">Animales Activos</TabsTrigger>
              <TabsTrigger value="inactivos">Animales Inactivos</TabsTrigger>
            </TabsList>

            {selectedTab === "activos" && (
              <Button
                onClick={handleAsignarMultiple}
                disabled={selectedAnimales.length === 0}
              >
                <Plus className="mr-2 h-4 w-4" /> Asignar Seleccionados
              </Button>
            )}
          </div>

          <TabsContent value="activos">
            <Card>
              <CardHeader>
                <CardTitle>Animales Activos en Finca</CardTitle>
                <CardDescription>
                  Administra la ubicación y lote de los animales actualmente en
                  la finca
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          onCheckedChange={(checked) =>
                            selectAllAnimales(checked === true)
                          }
                        />
                      </TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Trazabilidad</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Especie</TableHead>
                      <TableHead>Raza</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Lote</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {animalesActivos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center">
                          No hay animales activos registrados
                        </TableCell>
                      </TableRow>
                    ) : (
                      animalesActivos.map((inventario) => (
                        <TableRow key={inventario.inventario_id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedAnimales.includes(
                                inventario.inventario_id
                              )}
                              onCheckedChange={() =>
                                toggleAnimalSelection(inventario.inventario_id)
                              }
                            />
                          </TableCell>
                          <TableCell>{inventario.animal.animal_id}</TableCell>
                          <TableCell>
                            {inventario.animal.numero_trazabilidad}
                          </TableCell>
                          <TableCell>
                            {inventario.animal.nombre_identificatorio}
                          </TableCell>
                          <TableCell>
                            {inventario.animal.especie.nombre_comun}
                          </TableCell>
                          <TableCell>
                            {inventario.animal.raza.nombre_raza}
                          </TableCell>
                          <TableCell>
                            {inventario.ubicacion_actual?.nombre ||
                              "No asignado"}
                          </TableCell>
                          <TableCell>
                            {lotes?.find(
                              (l) => l.lote_id === inventario.lote_actual_id
                            )?.codigo_lote || "No asignado"}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => handleAsignar(inventario)}
                                >
                                  Cambiar Ubicación/Lote
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inactivos">
            <Card>
              <CardHeader>
                <CardTitle>Animales Inactivos</CardTitle>
                <CardDescription>
                  Visualiza animales que ya no están activos en la finca
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Trazabilidad</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Especie</TableHead>
                      <TableHead>Raza</TableHead>
                      <TableHead>Fecha Egreso</TableHead>
                      <TableHead>Motivo Egreso</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {animalesInactivos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No hay animales inactivos registrados
                        </TableCell>
                      </TableRow>
                    ) : (
                      animalesInactivos.map((inventario) => (
                        <TableRow key={inventario.inventario_id}>
                          <TableCell>{inventario.animal.animal_id}</TableCell>
                          <TableCell>
                            {inventario.animal.numero_trazabilidad}
                          </TableCell>
                          <TableCell>
                            {inventario.animal.nombre_identificatorio}
                          </TableCell>
                          <TableCell>
                            {inventario.animal.especie.nombre_comun}
                          </TableCell>
                          <TableCell>
                            {inventario.animal.raza.nombre_raza}
                          </TableCell>
                          <TableCell>{inventario.fecha_egreso}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                inventario.motivo_egreso === MotivoEgreso.Muerte
                                  ? "destructive"
                                  : inventario.motivo_egreso ===
                                      MotivoEgreso.Venta
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {inventario.motivo_egreso}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isAsignarMultiple
                  ? `Asignar ${selectedAnimales.length} animales`
                  : `Asignar animal: ${currentInventario?.animal.nombre_identificatorio}`}
              </DialogTitle>
              <DialogDescription>
                Seleccione la ubicación y/o lote para asignar el animal
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="ubicacion_actual_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value) || null)
                        }
                        value={field.value?.toString() || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione ubicación" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Sin ubicación</SelectItem>
                          {ubicaciones?.map((ubicacion) => (
                            <SelectItem
                              key={ubicacion.ubicacion_id}
                              value={ubicacion.ubicacion_id.toString()}
                            >
                              {ubicacion.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lote_actual_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lote</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value) || null)
                        }
                        value={field.value?.toString() || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione lote" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Sin lote</SelectItem>
                          {lotes?.map((lote) => (
                            <SelectItem
                              key={lote.lote_id}
                              value={lote.lote_id.toString()}
                            >
                              {lote.codigo_lote}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fecha_cambio"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de cambio</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: es })
                              ) : (
                                <span>Seleccione una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="motivo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione motivo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={MotivoIngreso.TrasladoInterno}>
                            Traslado Interno
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AsignacionAnimales;
