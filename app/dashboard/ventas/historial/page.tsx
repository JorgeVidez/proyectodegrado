"use client";

import React, { useEffect, useState } from "react";
import { useVentas } from "../../../hooks/useVentas";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

export default function HistorialVentasPage() {
  const { ventas, getVentas, deleteVenta, loading } = useVentas();
  const [ventaSeleccionada, setVentaSeleccionada] = useState<number | null>(
    null
  );

  useEffect(() => {
    getVentas();
  }, [getVentas]);

  const handleDelete = async () => {
    if (ventaSeleccionada !== null) {
      await deleteVenta(ventaSeleccionada);
      toast("Venta Eliminada", {
        description: `La venta con ID ${ventaSeleccionada} ha sido eliminada.`,
      });
      setVentaSeleccionada(null);
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
              <BreadcrumbPage>Historial de Ventas</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      {/* Contenido */}
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="p-6 bg-muted/50 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Historial de Ventas</h2>

          {loading ? (
            <Skeleton className="h-10 w-full" />
          ) : ventas.length === 0 ? (
            <p className="text-gray-500">No hay ventas registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Ganado ID</TableHead>
                    <TableHead>Fecha Venta</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Comprador</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ventas.map((venta) => (
                    <TableRow key={venta.id}>
                      <TableCell>
                        <Badge variant="secondary">{venta.id}</Badge>
                      </TableCell>
                      <TableCell>{venta.ganado_id}</TableCell>
                      <TableCell>{venta.fecha_venta}</TableCell>
                      <TableCell>${venta.precio_venta}</TableCell>
                      <TableCell>{venta.comprador}</TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setVentaSeleccionada(venta.id)}
                            >
                              Eliminar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                ¿Estás seguro?
                              </AlertDialogTitle>
                              <p>Esta acción no se puede deshacer.</p>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setVentaSeleccionada(null)}
                              >
                                Cancelar
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={handleDelete}
                              >
                                Eliminar
                              </Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
