"use client";

import React, { useEffect, useState } from "react";
import { useUsuarios, User } from "../../../../hooks/useUsuarios";
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { DialogDescription } from "@radix-ui/react-dialog";
import { RoleSelect, RolUsuario } from "@/components/RoleSelect"; // Importamos RoleSelect

export default function ListarUsuariosPage() {
  const { getUsers, updateUser, deleteUser } = useUsuarios();
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [usuarioEditando, setUsuarioEditando] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const data = await getUsers();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        setError("No se pudieron cargar los usuarios.");
      } finally {
        setLoading(false);
      }
    }
    fetchUsuarios();
  }, []);

  const handleEditarUsuario = async () => {
    if (usuarioEditando) {
      try {
        await updateUser(usuarioEditando.id, {
          nombre: usuarioEditando.nombre,
          email: usuarioEditando.email,
          rol: usuarioEditando.rol,
        });
        setUsuarios((prev) =>
          prev.map((u) => (u.id === usuarioEditando.id ? usuarioEditando : u))
        );
        setIsEditModalOpen(false);
      } catch (error) {
        console.error("Error al actualizar usuario:", error);
        setError("No se pudo actualizar el usuario.");
      }
    }
  };

  const handleEliminarUsuario = async (id: string) => {
    try {
      await deleteUser(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      setError("No se pudo eliminar el usuario.");
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
              <BreadcrumbPage>Lista de Usuarios</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-4">
          {/* Mostrar errores si los hay */}
          {error && (
            <Alert className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <p>Cargando usuarios...</p>
          ) : (
            <Table>
              <TableCaption>
                Lista de usuarios registrados en el sistema.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No hay usuarios registrados.
                    </TableCell>
                  </TableRow>
                ) : (
                  usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">
                        {usuario.nombre}
                      </TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>{usuario.rol}</TableCell>
                      <TableCell className="text-right">
                        <Dialog
                          open={
                            isEditModalOpen &&
                            usuarioEditando?.id === usuario.id
                          }
                          onOpenChange={setIsEditModalOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="mr-2"
                              onClick={() => setUsuarioEditando(usuario)}
                            >
                              Editar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Usuario</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                              Ingrese los datos del usuario a editar.
                            </DialogDescription>
                            <div className="grid gap-4">
                              <div>
                                <label>Nombre</label>
                                <Input
                                  type="text"
                                  value={usuarioEditando?.nombre || ""}
                                  onChange={(e) =>
                                    setUsuarioEditando((prev) =>
                                      prev
                                        ? { ...prev, nombre: e.target.value }
                                        : prev
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <label>Email</label>
                                <Input
                                  type="email"
                                  value={usuarioEditando?.email || ""}
                                  onChange={(e) =>
                                    setUsuarioEditando((prev) =>
                                      prev
                                        ? { ...prev, email: e.target.value }
                                        : prev
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <label>Rol</label>
                                <RoleSelect
                                  value={usuarioEditando?.rol as RolUsuario}
                                  onChange={(newRol) =>
                                    setUsuarioEditando((prev) =>
                                      prev ? { ...prev, rol: newRol } : prev
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <Button
                              className="mt-4"
                              onClick={handleEditarUsuario}
                            >
                              Guardar Cambios
                            </Button>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="destructive"
                          onClick={() => handleEliminarUsuario(usuario.id)}
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total Usuarios</TableCell>
                  <TableCell className="text-right">
                    {usuarios.length}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
