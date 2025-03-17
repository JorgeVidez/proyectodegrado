"use client";

import React, { useEffect, useState } from "react";
import { useGanado } from "../../../hooks/useGanado";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

interface EditarGanado {
  id: number;
  tipo: string;
  raza: string;
  edad: number;
  peso: number;
  estado_salud: string;
  fecha_ingreso: string;
  proveedor_id: number;
}

export default function ListaGanadoPage() {
  const { ganadoList, loading, error, getGanado, updateGanado, deleteGanado } =
    useGanado();
  const [editarGanado, setEditarGanado] = useState<EditarGanado | null>(null); // Usar any para simplificar el ejemplo
  const [tipo, setTipo] = useState("");
  const [raza, setRaza] = useState("");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [estadoSalud, setEstadoSalud] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState<Date | undefined>(undefined);
  const [proveedorId, setProveedorId] = useState("");

  const handleEditarGanado = async (ganado: EditarGanado) => {
    setEditarGanado(ganado);
    setTipo(ganado.tipo);
    setRaza(ganado.raza);
    setEdad(ganado.edad.toString());
    setPeso(ganado.peso.toString());
    setEstadoSalud(ganado.estado_salud);
    setFechaIngreso(new Date(ganado.fecha_ingreso));
    setProveedorId(ganado.proveedor_id.toString());
  };

  const handleGuardarCambios = async () => {
    if (editarGanado) {
      await updateGanado(editarGanado.id, {
        tipo,
        raza,
        edad: parseInt(edad),
        peso: parseFloat(peso),
        estado_salud: estadoSalud,
        fecha_ingreso: fechaIngreso
          ? format(fechaIngreso, "yyyy-MM-dd")
          : undefined,
        proveedor_id: parseInt(proveedorId),
      });
      await getGanado(); // Actualizar la lista después de editar
      setEditarGanado(null);
      setTipo("");
      setRaza("");
      setEdad("");
      setPeso("");
      setEstadoSalud("");
      setFechaIngreso(undefined);
      setProveedorId("");
    }
  };

  const handleEliminarGanado = async (id: number) => {
    await deleteGanado(id);
  };

  useEffect(() => {
    getGanado();
  }, [getGanado]);

  if (loading) {
    return <p>Cargando ganado...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Lista de Ganado</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Raza</TableHead>
                <TableHead>Edad</TableHead>
                <TableHead>Peso</TableHead>
                <TableHead>Estado de Salud</TableHead>
                <TableHead>Fecha de Ingreso</TableHead>
                <TableHead>Proveedor ID</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ganadoList.map((ganado) => (
                <TableRow key={ganado.id}>
                  <TableCell>{ganado.id}</TableCell>
                  <TableCell>{ganado.tipo}</TableCell>
                  <TableCell>{ganado.raza}</TableCell>
                  <TableCell>{ganado.edad}</TableCell>
                  <TableCell>{ganado.peso}</TableCell>
                  <TableCell>{ganado.estado_salud}</TableCell>
                  <TableCell>
                    {format(new Date(ganado.fecha_ingreso), "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell>{ganado.proveedor_id}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditarGanado(ganado)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleEliminarGanado(ganado.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Dialog
            open={!!editarGanado}
            onOpenChange={() => setEditarGanado(null)}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogDescription>
                Ingrese los datos del ganado a editar.
              </DialogDescription>
              <DialogHeader>
                <DialogTitle>Editar Ganado</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Input
                    type="text"
                    id="tipo"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="raza">Raza</Label>
                  <Input
                    type="text"
                    id="raza"
                    value={raza}
                    onChange={(e) => setRaza(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edad">Edad</Label>
                  <Input
                    type="number"
                    id="edad"
                    value={edad}
                    onChange={(e) => setEdad(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="peso">Peso</Label>
                  <Input
                    type="number"
                    id="peso"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="estadoSalud">Estado de Salud</Label>
                  <Input
                    type="text"
                    id="estadoSalud"
                    value={estadoSalud}
                    onChange={(e) => setEstadoSalud(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-[280px] justify-start text-left font-normal"
                      >
                        {fechaIngreso ? (
                          format(fechaIngreso, "PPP")
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={fechaIngreso}
                        onSelect={setFechaIngreso}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="proveedorId">ID del Proveedor</Label>
                  <Input
                    type="number"
                    id="proveedorId"
                    value={proveedorId}
                    onChange={(e) => setProveedorId(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleGuardarCambios}>Guardar Cambios</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
