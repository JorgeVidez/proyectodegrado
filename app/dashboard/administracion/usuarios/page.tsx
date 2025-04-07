// app/(dashboard)/usuarios/page.tsx
"use client";

import React, { useState } from "react";
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
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Rol = {
  rol_id: number;
  nombre_rol: string;
};

type Usuario = {
  usuario_id: number;
  nombre: string;
  email: string;
  rol: Rol;
  activo: boolean;
};

const mockRoles: Rol[] = [
  { rol_id: 1, nombre_rol: "Admin" },
  { rol_id: 2, nombre_rol: "Editor" },
  { rol_id: 3, nombre_rol: "Viewer" },
];

const mockUsuarios: Usuario[] = [
  {
    usuario_id: 1,
    nombre: "Juan Pérez",
    email: "juan@example.com",
    rol: mockRoles[0],
    activo: true,
  },
  {
    usuario_id: 2,
    nombre: "María Gómez",
    email: "maria@example.com",
    rol: mockRoles[2],
    activo: false,
  },
];

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios);
  const [roles] = useState<Rol[]>(mockRoles);

  const columns: ColumnDef<Usuario>[] = [
    {
      accessorKey: "nombre",
      header: "Nombre",
    },
    {
      accessorKey: "email",
      header: "Correo",
    },
    {
      accessorKey: "rol.nombre_rol",
      header: "Rol",
    },
    {
      accessorKey: "activo",
      header: "Estado",
      cell: ({ row }) =>
        row.original.activo ? (
          <Badge variant="default">Activo</Badge>
        ) : (
          <Badge variant="destructive">Inactivo</Badge>
        ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Editar Rol</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Rol de {row.original.nombre}</DialogTitle>
            </DialogHeader>
            <Select
              defaultValue={row.original.rol.rol_id.toString()}
              onValueChange={(value) => {
                const newRole = roles.find(
                  (r) => r.rol_id.toString() === value
                );
                if (newRole) {
                  const updated = usuarios.map((u) =>
                    u.usuario_id === row.original.usuario_id
                      ? { ...u, rol: newRole }
                      : u
                  );
                  setUsuarios(updated);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((rol) => (
                  <SelectItem key={rol.rol_id} value={rol.rol_id.toString()}>
                    {rol.nombre_rol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Usuarios</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="p-4">
        <DataTable columns={columns} data={usuarios} />
      </div>
    </div>
  );
}
