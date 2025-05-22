"use client";

import React, { useState } from "react";
import { useVentas } from "../../../hooks/useVentas";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Esquema de validación con Zod
const FormSchema = z.object({
  ganado_id: z.string().min(1, "El ID del ganado es requerido."),
  fecha_venta: z.date({
    required_error: "Debe seleccionar una fecha de venta.",
  }),
  precio_venta: z.string().min(1, "El precio de venta es requerido."),
  comprador: z.string().min(1, "El nombre del comprador es requerido."),
  estado_trazabilidad: z.string().min(1, "Debe seleccionar un estado."),
});

export default function NuevaVentaPage() {
  const { createVenta } = useVentas();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ganado_id: "",
      fecha_venta: new Date(),
      precio_venta: "",
      comprador: "",
      estado_trazabilidad: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    setDialogOpen(false);
    setLoading(true);

    try {
      await createVenta({
        ganado_id: Number(data.ganado_id),
        fecha_venta: format(data.fecha_venta, "yyyy-MM-dd"),
        precio_venta: Number(data.precio_venta),
        comprador: data.comprador,
        estado_trazabilidad: data.estado_trazabilidad,
      });

      toast("Venta Registrada", {
        description: `Fecha: ${format(data.fecha_venta, "PPP")}`,
        action: { label: "OK", onClick: () => console.log("Venta confirmada") },
      });

      form.reset();
    } catch {
      toast("Error al registrar", {
        description: "Hubo un problema al registrar la venta.",
        action: { label: "Reintentar", onClick: () => handleSubmit(data) },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="flex h-16 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/ventas/historial">
                Ventas
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Nueva Venta</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      {/* Formulario */}
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Card className="p-6 bg-muted/50 rounded-xl">
          <CardHeader>
            <CardTitle>Registrar Nueva Venta</CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                className="grid gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setDialogOpen(true);
                }}
              >
                {/* Campos del formulario */}
                <FormField
                  control={form.control}
                  name="ganado_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID del Ganado</FormLabel>
                      <FormControl>
                        <Input placeholder="ID del Ganado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fecha_venta"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de Venta</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline" className="w-full">
                              {field.value
                                ? format(field.value, "PPP")
                                : "Seleccionar Fecha"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="precio_venta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio de Venta</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Precio de Venta"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comprador"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comprador</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del Comprador" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estado_trazabilidad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado de Trazabilidad</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pendiente">Pendiente</SelectItem>
                          <SelectItem value="En proceso">En proceso</SelectItem>
                          <SelectItem value="Completado">Completado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <Skeleton className="h-5 w-24" />
                  ) : (
                    "Registrar Venta"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Diálogo de Confirmación */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Confirmar registro de venta?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={form.handleSubmit(handleSubmit)}
              disabled={loading}
            >
              {loading ? <Skeleton className="h-5 w-24" /> : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
