"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useRoles from "@/hooks/useRoles"; // Importa useRoles y RolUsuario
import axios from "axios";
import { Switch } from "@/components/ui/switch";

export default function UsuariosPage() {
  const router = useRouter();
  const {
    user: currentUser,
    loading: authLoading,
    getUsuarios,
    getUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    logout,
    hasPermission,
  } = useAuth();
  const {
    roles,
    loading: rolesLoading,
    error: rolesError,
    fetchRoles,
  } = useRoles(); // Usa useRoles

  // Estados para datos y UI
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para diálogos
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  // Estados para formulario de creación
  const [newNombre, setNewNombre] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRolId, setNewRolId] = useState(1);
  const [newActivo, setNewActivo] = useState(true);

  // Estados para formulario de edición
  const [editUsuarioId, setEditUsuarioId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRolId, setEditRolId] = useState(1);
  const [editActivo, setEditActivo] = useState(true);

  // Cargar usuarios al montar
  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        setLoading(true);
        const usuariosData = await getUsuarios();

        if (usuariosData) {
          setUsuarios(usuariosData);
        }
      } catch (err) {
        setError("Error al cargar usuarios");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      cargarUsuarios();
    }
  }, [authLoading, getUsuarios]);

  useEffect(() => {
    fetchRoles();
  }, []);

  // Manejar creación de usuario
  const handleCreate = async () => {
    try {
      const nuevoUsuario = await crearUsuario({
        nombre: newNombre,
        email: newEmail,
        password: newPassword,
        rol_id: newRolId,
        activo: newActivo,
      });

      if (nuevoUsuario) {
        showAlert("Usuario creado con éxito", "success");
        setIsCreateDialogOpen(false);
        resetCreateForm();
        // Recargar la lista de usuarios después de la creación
        const usuariosData = await getUsuarios();
        if (usuariosData) {
          setUsuarios(usuariosData);
        }
      } else {
        showAlert("Error al crear usuario. Verifica los datos.", "error");
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        showAlert(
          `Error: ${err.response?.data?.detail || err.message}`,
          "error"
        );
      } else {
        showAlert("Error inesperado al crear usuario.", "error");
      }
      console.error(err);
    }
  };

  // Manejar actualización de usuario
  const handleUpdate = async () => {
    if (!editUsuarioId) return;

    try {
      const usuarioActualizado = await actualizarUsuario(editUsuarioId, {
        nombre: editNombre,
        email: editEmail,
        password: editPassword || undefined, // Solo enviar si hay valor
        rol_id: editRolId,
        activo: editActivo,
      });

      if (usuarioActualizado) {
        setUsuarios(
          usuarios.map((u) =>
            u.usuario_id === usuarioActualizado.usuario_id
              ? usuarioActualizado
              : u
          )
        );
        showAlert("Usuario actualizado con éxito", "success");
        setIsEditDialogOpen(false);
        resetEditForm();
      }
    } catch (err) {
      showAlert("Error al actualizar usuario", "error");
      console.error(err);
    }
  };

  // Manejar eliminación de usuario
  const handleDelete = async (id: number) => {
    try {
      const eliminado = await eliminarUsuario(id);
      setUsuarios(usuarios.filter((u) => u.usuario_id !== id));
      showAlert("Usuario eliminado con éxito", "success");
    } catch (err) {
      showAlert("Error al eliminar usuario", "error");
      console.error(err);
    }
  };

  // Preparar formulario de edición
  const handleEdit = (usuario: any) => {
    setEditUsuarioId(usuario.usuario_id);
    setEditNombre(usuario.nombre);
    setEditEmail(usuario.email);
    setEditPassword("");
    setEditRolId(usuario.rol.rol_id);
    setEditActivo(usuario.activo);
    setIsEditDialogOpen(true);
  };

  // Resetear formularios
  const resetCreateForm = () => {
    setNewNombre("");
    setNewEmail("");
    setNewPassword("");
    setNewRolId(1);
    setNewActivo(true);
  };

  const resetEditForm = () => {
    setEditUsuarioId(null);
    setEditNombre("");
    setEditEmail("");
    setEditPassword("");
    setEditRolId(1);
    setEditActivo(true);
  };

  // Mostrar alertas
  const showAlert = (message: string, type: "success" | "error") => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  // Verificar permisos
  if (authLoading || rolesLoading) return <div>Cargando...</div>;
  if (!currentUser) {
    router.push("/login");
    return null;
  }
  if (!hasPermission("/admin/usuarios")) {
    router.push("/unauthorized");
    return null;
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
                <BreadcrumbLink href="#">Administración</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Usuarios</BreadcrumbPage>
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
            <h1 className="text-2xl font-bold">Lista de Usuarios</h1>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Crear Nuevo Usuario
            </Button>
          </header>
          <Separator className="my-4" />

          {loading ? (
            <div>Cargando usuarios...</div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((usuario) => (
                  <TableRow key={usuario.usuario_id}>
                    <TableCell className="font-medium">
                      {usuario.nombre}
                    </TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{usuario.rol.nombre_rol}</TableCell>
                    <TableCell>
                      <Badge
                        variant={usuario.activo ? "outline" : "destructive"}
                      >
                        {usuario.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(usuario)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(usuario.usuario_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Diálogo de creación */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Complete los datos del nuevo usuario.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="nombre"
                  value={newNombre}
                  onChange={(e) => setNewNombre(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="col-span-3"
                  required
                  minLength={6}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rol" className="text-right">
                  Rol
                </Label>
                <div className="col-span-3">
                  <Select
                    value={newRolId.toString()}
                    onValueChange={(value) => setNewRolId(parseInt(value))}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles &&
                        roles.map((rol) => (
                          <SelectItem
                            key={rol.rol_id.toString()}
                            value={rol.rol_id.toString()}
                          >
                            {rol.nombre_rol}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="activo" className="text-right">
                  Activo
                </Label>
                <Switch
                  id="activo"
                  checked={newActivo}
                  onCheckedChange={setNewActivo}
                  onChange={(e) =>
                    setNewActivo((e.target as HTMLInputElement).checked)
                  }
                ></Switch>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleCreate}>
                Crear Usuario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de edición */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
              <DialogDescription>
                Modifique los datos del usuario.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editNombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="editNombre"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editEmail" className="text-right">
                  Email
                </Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editPassword" className="text-right">
                  Nueva Contraseña
                </Label>
                <Input
                  id="editPassword"
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="col-span-3"
                  placeholder="Dejar vacío para no cambiar"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editRol" className="text-right">
                  Rol
                </Label>
                <div className="col-span-3">
                  <Select
                    value={editRolId.toString()}
                    onValueChange={(value) => setEditRolId(parseInt(value))}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles &&
                        roles.map((rol) => (
                          <SelectItem
                            key={rol.rol_id.toString()}
                            value={rol.rol_id.toString()}
                          >
                            {rol.nombre_rol}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editActivo" className="text-right">
                  Activo
                </Label>
                <Switch
                  id="editActivo"
                  checked={editActivo}
                  onCheckedChange={setEditActivo}
                ></Switch>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleUpdate}>
                Actualizar Usuario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
