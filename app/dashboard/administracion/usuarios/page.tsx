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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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

const initialUsuarios: Usuario[] = [
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
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios);
  const [roles] = useState<Rol[]>(mockRoles);

  const eliminarUsuario = (id: number) => {
    setUsuarios((prev) => prev.filter((u) => u.usuario_id !== id));
  };

  const toggleEstado = (id: number) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.usuario_id === id ? { ...u, activo: !u.activo } : u))
    );
  };

  const agregarUsuario = (nuevo: Omit<Usuario, "usuario_id">) => {
    const id = Math.max(...usuarios.map((u) => u.usuario_id)) + 1;
    setUsuarios([...usuarios, { ...nuevo, usuario_id: id }]);
  };

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
        <div className="flex gap-2">
          {/* Editar Rol */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Editar</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar a {row.original.nombre}</DialogTitle>
              </DialogHeader>
              <Label>Rol</Label>
              <Select
                defaultValue={row.original.rol.rol_id.toString()}
                onValueChange={(value) => {
                  const newRole = roles.find(
                    (r) => r.rol_id.toString() === value
                  );
                  if (newRole) {
                    setUsuarios((prev) =>
                      prev.map((u) =>
                        u.usuario_id === row.original.usuario_id
                          ? { ...u, rol: newRole }
                          : u
                      )
                    );
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((rol) => (
                    <SelectItem key={rol.rol_id} value={rol.rol_id.toString()}>
                      {rol.nombre_rol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-4 flex items-center gap-2">
                <Label>Activo</Label>
                <Switch
                  checked={row.original.activo}
                  onCheckedChange={() => toggleEstado(row.original.usuario_id)}
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Eliminar */}
          <Button
            variant="destructive"
            onClick={() => eliminarUsuario(row.original.usuario_id)}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <header className="flex h-16 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger />
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

      <div className="p-4 flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Agregar Usuario</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Usuario</DialogTitle>
            </DialogHeader>

            <form
              onSubmit={(e: any) => {
                e.preventDefault();
                const data = new FormData(e.target);
                const nombre = data.get("nombre")?.toString() || "";
                const email = data.get("email")?.toString() || "";
                const rolId = data.get("rol")?.toString();
                const rol = roles.find((r) => r.rol_id.toString() === rolId);
                if (nombre && email && rol) {
                  agregarUsuario({
                    nombre,
                    email,
                    rol,
                    activo: true,
                  });
                  e.target.reset();
                }
              }}
              className="space-y-4"
            >
              <Input name="nombre" placeholder="Nombre" required />
              <Input name="email" placeholder="Correo" required />
              <Select name="rol" required>
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
              <Button type="submit">Crear</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="p-4">
        <DataTable columns={columns} data={usuarios} />
      </div>
    </div>
  );
}
