"use client";

import { useProveedores } from "@/hooks/useProveedores"; // Importa el hook de proveedores
import { useEffect, useState } from "react";
import React from "react";
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
  TableFooter,
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
import {
  ProveedorCreate,
  ProveedorUpdate,
  ProveedorOut,
} from "@/types/proveedor"; // Importa los tipos de proveedores

export default function ListaProveedoresPage() {
  // Renombrar el componente
  const { proveedores, isLoading, error, create, update, remove } =
    useProveedores();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newNombre, setNewNombre] = useState("");
  const [newIdentificacionFiscal, setNewIdentificacionFiscal] = useState("");
  const [newTelefono, setNewTelefono] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newDireccion, setNewDireccion] = useState("");
  const [newPersonaContacto, setNewPersonaContacto] = useState("");
  const [newTipoProveedor, setNewTipoProveedor] = useState("");
  const [editProveedorId, setEditProveedorId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editIdentificacionFiscal, setEditIdentificacionFiscal] = useState("");
  const [editTelefono, setEditTelefono] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editDireccion, setEditDireccion] = useState("");
  const [editPersonaContacto, setEditPersonaContacto] = useState("");
  const [editTipoProveedor, setEditTipoProveedor] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  const handleCreateProveedor = async () => {
    const newProveedor: ProveedorCreate = {
      nombre: newNombre,
      identificacion_fiscal: newIdentificacionFiscal,
      telefono: newTelefono,
      email: newEmail,
      direccion: newDireccion,
      persona_contacto: newPersonaContacto,
      tipo_proveedor: newTipoProveedor,
    };
    console.log("Creating new proveedor:", newProveedor);
    const createdProveedor = await create(newProveedor);
    if (createdProveedor) {
      setAlertMessage("Proveedor creado con éxito.");
      setAlertType("success");
      setIsCreateDialogOpen(false);
      setNewNombre("");
      setNewIdentificacionFiscal("");
      setNewTelefono("");
      setNewEmail("");
      setNewDireccion("");
      setNewPersonaContacto("");
      setNewTipoProveedor("");
    } else {
      setAlertMessage("Error al crear el proveedor.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const handleUpdateProveedor = async () => {
    if (editProveedorId) {
      const updatedProveedor: ProveedorUpdate = {
        nombre: editNombre,
        identificacion_fiscal: editIdentificacionFiscal,
        telefono: editTelefono,
        email: editEmail,
        direccion: editDireccion,
        persona_contacto: editPersonaContacto,
        tipo_proveedor: editTipoProveedor,
      };
      const updated = await update(editProveedorId, updatedProveedor);
      if (updated) {
        setAlertMessage("Proveedor actualizado con éxito.");
        setAlertType("success");
        setIsEditDialogOpen(false);
        setEditProveedorId(null);
        setEditNombre("");
        setEditIdentificacionFiscal("");
        setEditTelefono("");
        setEditEmail("");
        setEditDireccion("");
        setEditPersonaContacto("");
        setEditTipoProveedor("");
      } else {
        setAlertMessage("Error al actualizar el proveedor.");
        setAlertType("error");
      }
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
    }
  };

  const handleDeleteProveedor = async (id: number) => {
    const deleted = await remove(id);
    if (deleted) {
      setAlertMessage("Proveedor eliminado con éxito.");
      setAlertType("success");
    } else {
      setAlertMessage("Error al eliminar el proveedor.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const filteredProveedores = (proveedores ?? []).filter((p) => {
    const searchMatch = p.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return searchMatch;
  });

  const totalPages = Math.ceil(filteredProveedores.length / itemsPerPage);
  const paginatedProveedores = filteredProveedores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar proveedores</div>;

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Administración </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Proveedores</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {alertMessage && alertType && (
          <Alert variant={alertType === "success" ? "default" : "destructive"}>
            {alertType === "error" && <div className="h-4 w-4" />}
            <AlertTitle>
              {alertType === "success" ? "Éxito" : "Error"}
            </AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}
        <div>
          <header className="flex flex-wrap items-center justify-between p-2">
            <h1 className="text-2xl font-bold">Lista de Proveedores</h1>
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Crear Nuevo Proveedor
              </Button>
            </div>
          </header>
          <Separator className="my-4" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Nombre</TableHead>
                <TableHead>Identificación Fiscal</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Persona Contacto</TableHead>
                <TableHead>Tipo Proveedor</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProveedores.map((p) => (
                <TableRow key={p.proveedor_id}>
                  <TableCell className="font-medium truncate">
                    {p.nombre}
                  </TableCell>
                  <TableCell className="">{p.identificacion_fiscal}</TableCell>
                  <TableCell className="">{p.telefono}</TableCell>
                  <TableCell className="">{p.email}</TableCell>
                  <TableCell className="">{p.direccion}</TableCell>
                  <TableCell className="">{p.persona_contacto}</TableCell>
                  <TableCell className="">{p.tipo_proveedor}</TableCell>
                  <TableCell className="text-right flex flex-wrap justify-end gap-2">
                    <Button
                      className=""
                      onClick={() => {
                        setEditProveedorId(p.proveedor_id);
                        setEditNombre(p.nombre);
                        setEditIdentificacionFiscal(
                          p.identificacion_fiscal || ""
                        );
                        setEditTelefono(p.telefono || "");
                        setEditEmail(p.email || "");
                        setEditDireccion(p.direccion || "");
                        setEditPersonaContacto(p.persona_contacto || "");
                        setEditTipoProveedor(p.tipo_proveedor || "");
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil></Pencil>
                    </Button>
                    <Button
                      variant="destructive"
                      className=""
                      onClick={() => handleDeleteProveedor(p.proveedor_id)}
                    >
                      <Trash2> </Trash2>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-center items-center gap-2 mt-4">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Anterior
            </Button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              Siguiente
            </Button>
          </div>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Proveedor</DialogTitle>
              <DialogDescription>
                Ingresa los detalles del nuevo proveedor.
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
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="identificacionFiscal" className="text-right">
                  Identificación Fiscal
                </Label>
                <Input
                  id="identificacionFiscal"
                  value={newIdentificacionFiscal}
                  onChange={(e) => setNewIdentificacionFiscal(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="telefono" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="telefono"
                  value={newTelefono}
                  onChange={(e) => setNewTelefono(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="direccion" className="text-right">
                  Dirección
                </Label>
                <Input
                  id="direccion"
                  value={newDireccion}
                  onChange={(e) => setNewDireccion(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="personaContacto" className="text-right">
                  Persona Contacto
                </Label>
                <Input
                  id="personaContacto"
                  value={newPersonaContacto}
                  onChange={(e) => setNewPersonaContacto(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tipoProveedor" className="text-right">
                  Tipo Proveedor
                </Label>
                <Input
                  id="tipoProveedor"
                  value={newTipoProveedor}
                  onChange={(e) => setNewTipoProveedor(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateProveedor}>Crear Proveedor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Proveedor</DialogTitle>
              <DialogDescription>
                Actualiza los detalles del proveedor.
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
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="editIdentificacionFiscal"
                  className="text-right"
                >
                  Identificación Fiscal
                </Label>
                <Input
                  id="editIdentificacionFiscal"
                  value={editIdentificacionFiscal}
                  onChange={(e) => setEditIdentificacionFiscal(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editTelefono" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="editTelefono"
                  value={editTelefono}
                  onChange={(e) => setEditTelefono(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editEmail" className="text-right">
                  Email
                </Label>
                <Input
                  id="editEmail"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editDireccion" className="text-right">
                  Dirección
                </Label>
                <Input
                  id="editDireccion"
                  value={editDireccion}
                  onChange={(e) => setEditDireccion(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editPersonaContacto" className="text-right">
                  Persona Contacto
                </Label>
                <Input
                  id="editPersonaContacto"
                  value={editPersonaContacto}
                  onChange={(e) => setEditPersonaContacto(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editTipoProveedor" className="text-right">
                  Tipo Proveedor
                </Label>
                <Input
                  id="editTipoProveedor"
                  value={editTipoProveedor}
                  onChange={(e) => setEditTipoProveedor(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateProveedor}>
                Actualizar Proveedor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
