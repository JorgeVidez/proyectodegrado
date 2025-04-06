"use client";

import React, { useState } from "react";
import { useProveedores } from "../../../../hooks/useProveedores";
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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function ProveedoresPage() {
  const { proveedores, loading, error, createProveedor, getProveedores } =
    useProveedores();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const handleCreateProveedor = async () => {
    if (nombre) {
      await createProveedor({ nombre, telefono, direccion });
      await getProveedores(); // Actualizar la lista después de crear
      setNombre("");
      setTelefono("");
      setDireccion("");
    }
  };

  if (loading) {
    return <p>Cargando proveedores...</p>;
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
                <BreadcrumbPage>Proveedores</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Agregar Proveedor</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Agregar Proveedor</DialogTitle>
                <DialogDescription>
                  Ingrese los datos del nuevo proveedor.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    type="text"
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    type="text"
                    id="telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    type="text"
                    id="direccion"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleCreateProveedor}>Crear Proveedor</Button>
            </DialogContent>
          </Dialog>

          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Dirección</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proveedores.map((proveedor) => (
                <TableRow key={proveedor.id}>
                  <TableCell>{proveedor.id}</TableCell>
                  <TableCell>{proveedor.nombre}</TableCell>
                  <TableCell>{proveedor.telefono || "-"}</TableCell>
                  <TableCell>{proveedor.direccion || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
