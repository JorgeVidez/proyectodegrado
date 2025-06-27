"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useMemo } from "react";
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
import useRoles from "@/hooks/useRoles";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { UsuariosSkeleton } from "@/components/CrudSkeleton";
import { Eye, EyeOff, Check, X } from "lucide-react";

type PasswordValidation = {
  minLength: boolean;
  maxLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
};

const validatePassword = (password: string): PasswordValidation => {
  return {
    minLength: password.length >= 8,
    maxLength: password.length <= 20,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[^\da-zA-Z]/.test(password),
  };
};

const isPasswordValid = (password: string): boolean => {
  const validation = validatePassword(password);
  return Object.values(validation).every(Boolean);
};

const PasswordField = ({
  value,
  onChange,
  isEdit = false,
  required = true,
}: {
  value: string;
  onChange: (value: string) => void;
  isEdit?: boolean;
  required?: boolean;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const validation = validatePassword(value);
  const showValidation = !isEdit && value.length > 0;

  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label htmlFor="password" className="text-right pt-2">
        {isEdit ? "Nueva Contraseña" : "Contraseña"}
      </Label>
      <div className="col-span-3 space-y-2">
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            placeholder={isEdit ? "Dejar vacío para no cambiar" : ""}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </Button>
        </div>

        {showValidation && (
          <div className="space-y-1 text-sm">
            <ValidationItem
              isValid={validation.minLength && validation.maxLength}
              text="Entre 8 y 20 caracteres"
            />
            <ValidationItem
              isValid={validation.hasUppercase}
              text="Al menos una letra mayúscula"
            />
            <ValidationItem
              isValid={validation.hasLowercase}
              text="Al menos una letra minúscula"
            />
            <ValidationItem
              isValid={validation.hasNumber}
              text="Al menos un número"
            />
            <ValidationItem
              isValid={validation.hasSymbol}
              text="Al menos un símbolo (!@#$%^&*)"
            />
          </div>
        )}
      </div>
    </div>
  );
};

const ValidationItem = ({
  isValid,
  text,
}: {
  isValid: boolean;
  text: string;
}) => (
  <div className="flex items-center gap-2">
    {isValid ? (
      <Check className="h-3 w-3 text-green-500" />
    ) : (
      <X className="h-3 w-3 text-red-500" />
    )}
    <span className={isValid ? "text-green-600" : "text-red-600"}>{text}</span>
  </div>
);

// Componente UsuarioForm actualizado
const UsuarioForm = ({
  formData,
  onFormChange,
  roles,
  isEdit = false,
}: {
  formData: UsuarioFormData;
  onFormChange: (field: keyof UsuarioFormData, value: any) => void;
  roles: any[];
  isEdit?: boolean;
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nombre" className="text-right">
          Nombre
        </Label>
        <Input
          id="nombre"
          value={formData.nombre}
          onChange={(e) => onFormChange("nombre", e.target.value)}
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
          value={formData.email}
          onChange={(e) => onFormChange("email", e.target.value)}
          className="col-span-3"
          required
        />
      </div>

      <PasswordField
        value={formData.password}
        onChange={(value) => onFormChange("password", value)}
        isEdit={isEdit}
        required={!isEdit}
      />

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="rol" className="text-right">
          Rol
        </Label>
        <div className="col-span-3">
          <Select
            value={formData.rol_id.toString()}
            onValueChange={(value) => onFormChange("rol_id", parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar rol" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((rol) => (
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
          checked={formData.activo}
          onCheckedChange={(checked) => onFormChange("activo", checked)}
        />
      </div>
    </div>
  );
};

// Constantes para paginación
const ITEMS_PER_PAGE = 10;

type UsuarioFormData = {
  id?: number;
  nombre: string;
  email: string;
  password: string;
  rol_id: number;
  activo: boolean;
};

type FilterValues = {
  nombre: string;
  email: string;
  rol_id: string;
  activo: string;
};

const initialFormData: UsuarioFormData = {
  nombre: "",
  email: "",
  password: "",
  rol_id: 1,
  activo: true,
};

const initialFilters: FilterValues = {
  nombre: "",
  email: "",
  rol_id: "all",
  activo: "all",
};

const useAlert = () => {
  const [alert, setAlert] = useState<{
    message: string | null;
    type: "success" | "error" | null;
  }>({ message: null, type: null });

  const showAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: null, type: null }), 3000);
  };

  return { alert, showAlert };
};

const Filters = ({
  filters,
  onFilterChange,
  roles,
}: {
  filters: FilterValues;
  onFilterChange: (field: keyof FilterValues, value: string) => void;
  roles: any[];
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <div>
        <Label htmlFor="filter-nombre">Nombre</Label>
        <Input
          id="filter-nombre"
          value={filters.nombre}
          onChange={(e) => onFilterChange("nombre", e.target.value)}
          placeholder="Filtrar por nombre"
        />
      </div>
      <div>
        <Label htmlFor="filter-email">Email</Label>
        <Input
          id="filter-email"
          value={filters.email}
          onChange={(e) => onFilterChange("email", e.target.value)}
          placeholder="Filtrar por email"
        />
      </div>
      <div>
        <Label htmlFor="filter-rol">Rol</Label>
        <Select
          value={filters.rol_id}
          onValueChange={(value) => onFilterChange("rol_id", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos los roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los roles</SelectItem>
            {roles.map((rol) => (
              <SelectItem key={rol.rol_id} value={rol.rol_id.toString()}>
                {rol.nombre_rol}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="filter-activo">Estado</Label>
        <Select
          value={filters.activo}
          onValueChange={(value) => onFilterChange("activo", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="true">Activo</SelectItem>
            <SelectItem value="false">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        Página {currentPage} de {totalPages}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};

export default function UsuariosPage() {
  const router = useRouter();
  const {
    user: currentUser,
    loading: authLoading,
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    hasPermission,
  } = useAuth();
  const { roles, loading: rolesLoading, fetchRoles } = useRoles();
  const { alert, showAlert } = useAlert();

  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState<"create" | "edit" | null>(
    null
  );
  const [formData, setFormData] = useState<UsuarioFormData>(initialFormData);
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleFormChange = (field: keyof UsuarioFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilterChange = (field: keyof FilterValues, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1); // Resetear a primera página al cambiar filtros
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const usuariosData = await getUsuarios();
      if (usuariosData) setUsuarios(usuariosData);
    } catch (err) {
      showAlert("Error al cargar usuarios", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar usuarios según los filtros aplicados
  const filteredUsuarios = useMemo(() => {
    return usuarios.filter((usuario) => {
      // Filtro por nombre
      if (
        filters.nombre &&
        !usuario.nombre.toLowerCase().includes(filters.nombre.toLowerCase())
      ) {
        return false;
      }

      // Filtro por email
      if (
        filters.email &&
        !usuario.email.toLowerCase().includes(filters.email.toLowerCase())
      ) {
        return false;
      }

      // Filtro por rol
      if (
        filters.rol_id !== "all" &&
        usuario.rol.rol_id !== parseInt(filters.rol_id)
      ) {
        return false;
      }

      // Filtro por estado
      if (filters.activo !== "all") {
        const filterActivo = filters.activo === "true";
        if (usuario.activo !== filterActivo) {
          return false;
        }
      }

      return true;
    });
  }, [usuarios, filters]);

  // Paginación
  const paginatedUsuarios = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsuarios.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsuarios, currentPage]);

  const totalPages = Math.ceil(filteredUsuarios.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (!authLoading) loadUsuarios();
  }, [authLoading]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSubmit = async () => {
    if (!isDialogOpen) return;

    const shouldValidatePassword =
      isDialogOpen === "create" || formData.password.length > 0;

    if (shouldValidatePassword && !isPasswordValid(formData.password)) {
      setPasswordError(
        "La contraseña debe tener entre 8 y 20 caracteres, con al menos una mayúscula, una minúscula, un número y un símbolo."
      );
      return;
    }

    setPasswordError(null); // limpia errores previos

    try {
      let success = false;
      if (isDialogOpen === "create") {
        const nuevoUsuario = await crearUsuario(formData);
        success = !!nuevoUsuario;
      } else if (isDialogOpen === "edit" && formData.id) {
        const usuarioActualizado = await actualizarUsuario(formData.id, {
          ...formData,
          password: formData.password || undefined,
        });
        success = !!usuarioActualizado;
      }

      if (success) {
        showAlert(
          `Usuario ${isDialogOpen === "create" ? "creado" : "actualizado"} con éxito`,
          "success"
        );
        setIsDialogOpen(null);
        resetForm();
        await loadUsuarios();
      }
    } catch (err: any) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.detail || err.message
        : "Error inesperado";
      showAlert(message, "error");
      console.error(err);
    }
  };

  const handleEdit = (usuario: any) => {
    setFormData({
      id: usuario.usuario_id,
      nombre: usuario.nombre,
      email: usuario.email,
      password: "",
      rol_id: usuario.rol.rol_id,
      activo: usuario.activo,
    });
    setIsDialogOpen("edit");
  };

  const handleDelete = async (id: number) => {
    try {
      await eliminarUsuario(id);
      setUsuarios(usuarios.filter((u) => u.usuario_id !== id));
      showAlert("Usuario eliminado con éxito", "success");
    } catch (err) {
      showAlert("Error al eliminar usuario", "error");
      console.error(err);
    }
  };

  const handleNewUser = () => {
    resetForm();
    setIsDialogOpen("create");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (authLoading || rolesLoading || loading) {
    return <UsuariosSkeleton />;
  }
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
        {alert.message && alert.type && (
          <Alert variant={alert.type === "success" ? "default" : "destructive"}>
            <AlertTitle>
              {alert.type === "success" ? "Éxito" : "Error"}
            </AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <div>
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Lista de Usuarios</h1>
            <Button onClick={() => handleNewUser()}>Crear Nuevo Usuario</Button>
          </header>
          <Separator className="my-4" />

          {/* Filtros */}
          <Filters
            filters={filters}
            onFilterChange={handleFilterChange}
            roles={roles || []}
          />
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {paginatedUsuarios.length} de {filteredUsuarios.length}{" "}
              usuarios
            </div>
            <Button variant="outline" onClick={resetFilters}>
              Limpiar filtros
            </Button>
          </div>

          {loading ? (
            <div>Cargando usuarios...</div>
          ) : (
            <>
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
                  {paginatedUsuarios.length > 0 ? (
                    paginatedUsuarios.map((usuario) => (
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
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No se encontraron usuarios
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Paginación */}
              {filteredUsuarios.length > ITEMS_PER_PAGE && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>

        {/* Diálogos */}
        <Dialog
          open={isDialogOpen !== null}
          onOpenChange={(open) => setIsDialogOpen(open ? isDialogOpen : null)}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isDialogOpen === "create" ? "Crear" : "Editar"} Usuario
              </DialogTitle>
              <DialogDescription>
                {isDialogOpen === "create"
                  ? "Complete los datos del nuevo usuario."
                  : "Modifique los datos del usuario."}
              </DialogDescription>
            </DialogHeader>
            <UsuarioForm
              formData={formData}
              onFormChange={handleFormChange}
              roles={roles || []}
              isEdit={isDialogOpen === "edit"}
            />
            <DialogFooter>
              <Button type="button" onClick={handleSubmit}>
                {isDialogOpen === "create" ? "Crear" : "Actualizar"} Usuario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
