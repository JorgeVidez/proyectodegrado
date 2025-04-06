"use client";

import React, { useState } from "react";
import { useGanado } from "../../../../hooks/useGanado";
import { useProveedores } from "../../../../hooks/useProveedores";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AgregarGanadoPage() {
  const { createGanado, getGanado, ganadoList, loading, error } = useGanado();
  const {
    proveedores,
    loading: loadingProveedores,
    error: errorProveedores,
  } = useProveedores();

  const [tipo, setTipo] = useState("");
  const [raza, setRaza] = useState("");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [estadoSalud, setEstadoSalud] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState<Date | undefined>(undefined);
  const [proveedorId, setProveedorId] = useState<number | undefined>(undefined);
  const [mensajeExito, setMensajeExito] = useState(false);

  const handleAgregarGanado = async () => {
    if (
      tipo &&
      raza &&
      edad &&
      peso &&
      estadoSalud &&
      fechaIngreso &&
      proveedorId
    ) {
      const nuevoGanado = {
        tipo,
        raza,
        edad: parseInt(edad),
        peso: parseFloat(peso),
        estado_salud: estadoSalud,
        fecha_ingreso: format(fechaIngreso, "yyyy-MM-dd"),
        proveedor_id: proveedorId,
      };

      const resultado = await createGanado(nuevoGanado);
      if (resultado) {
        setMensajeExito(true);
        setTimeout(() => setMensajeExito(false), 3000);
        await getGanado(); // Actualizar la lista desde la API
      }

      // Limpiar los campos
      setTipo("");
      setRaza("");
      setEdad("");
      setPeso("");
      setEstadoSalud("");
      setFechaIngreso(undefined);
      setProveedorId(undefined);
    }
  };

  return (
    <div>
      <header className="flex h-16 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Agregar Ganado</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-4">
          {/* Notificación de éxito */}
          {mensajeExito && (
            <Alert className="mb-4">
              <AlertTitle>Éxito</AlertTitle>
              <AlertDescription>
                El ganado ha sido agregado correctamente.
              </AlertDescription>
            </Alert>
          )}

          {/* Manejo de carga y error */}
          {loading && <p>Cargando datos...</p>}
          {error && <Alert className="mb-4 text-red-600">{error}</Alert>}

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
                    className="w-full justify-start text-left font-normal"
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

            {/* Select de proveedores con ShadCN */}
            <div className="grid gap-2">
              <Label htmlFor="proveedorId">Proveedor</Label>
              {loadingProveedores ? (
                <p>Cargando proveedores...</p>
              ) : errorProveedores ? (
                <p className="text-red-600">{errorProveedores}</p>
              ) : (
                <Select
                  onValueChange={(value) => setProveedorId(parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {proveedores.map((proveedor) => (
                        <SelectItem
                          key={proveedor.id}
                          value={proveedor.id.toString()}
                        >
                          {proveedor.nombre}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <Button onClick={handleAgregarGanado}>Agregar Ganado</Button>

          {/* Lista de los últimos 3 ganados en orden descendente */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold">
              Últimos 3 Ganados Agregados
            </h2>
            <ul className="mt-2 border border-gray-300 rounded-lg p-4">
              {ganadoList.length === 0 ? (
                <p className="text-gray-500">No hay ganado agregado.</p>
              ) : (
                ganadoList
                  .slice(-3)
                  .reverse()
                  .map((ganado) => (
                    <li
                      key={ganado.id}
                      className="py-2 border-b last:border-none"
                    >
                      <span className="font-medium">{ganado.tipo}</span> -{" "}
                      {ganado.raza} ({ganado.edad} años, {ganado.peso} kg)
                    </li>
                  ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
