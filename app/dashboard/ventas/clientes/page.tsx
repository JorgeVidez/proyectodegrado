"use client";

import { useClientes } from "@/hooks/useClientes"; // Importa el hook de clientes
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
import { ClienteCreate, ClienteUpdate, ClienteOut } from "@/types/cliente"; // Importa los tipos de clientes

export default function ListaClientesPage() {
  // Renombrar el componente
  const { clientes, isLoading, error, create, update, remove } = useClientes();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newNombre, setNewNombre] = useState("");
  const [newIdentificacionFiscal, setNewIdentificacionFiscal] = useState("");
  const [newTelefono, setNewTelefono] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newDireccion, setNewDireccion] = useState("");
  const [editClienteId, setEditClienteId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editIdentificacionFiscal, setEditIdentificacionFiscal] = useState("");
  const [editTelefono, setEditTelefono] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editDireccion, setEditDireccion] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  const handleCreateCliente = async () => {
    const newCliente: ClienteCreate = {
      nombre: newNombre,
      identificacion_fiscal: newIdentificacionFiscal,
      telefono: newTelefono,
      email: newEmail,
      direccion: newDireccion,
    };
    const createdCliente = await create(newCliente);
    if (createdCliente) {
      setAlertMessage("Cliente creado con éxito.");
      setAlertType("success");
      setIsCreateDialogOpen(false);
      setNewNombre("");
      setNewIdentificacionFiscal("");
      setNewTelefono("");
      setNewEmail("");
      setNewDireccion("");
    } else {
      setAlertMessage("Error al crear el cliente.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const handleUpdateCliente = async () => {
    if (editClienteId) {
      const updatedCliente: ClienteUpdate = {
        nombre: editNombre,
        identificacion_fiscal: editIdentificacionFiscal,
        telefono: editTelefono,
        email: editEmail,
        direccion: editDireccion,
      };
      const updated = await update(editClienteId, updatedCliente);
      if (updated) {
        setAlertMessage("Cliente actualizado con éxito.");
        setAlertType("success");
        setIsEditDialogOpen(false);
        setEditClienteId(null);
        setEditNombre("");
        setEditIdentificacionFiscal("");
        setEditTelefono("");
        setEditEmail("");
        setEditDireccion("");
      } else {
        setAlertMessage("Error al actualizar el cliente.");
        setAlertType("error");
      }
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
    }
  };

  const handleDeleteCliente = async (id: number) => {
    const deleted = await remove(id);
    if (deleted) {
      setAlertMessage("Cliente eliminado con éxito.");
      setAlertType("success");
    } else {
      setAlertMessage("Error al eliminar el cliente.");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const filteredClientes = (clientes ?? []).filter((c) => {
    const searchMatch = c.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return searchMatch;
  });

  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);
  const paginatedClientes = filteredClientes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar clientes</div>;

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
                <BreadcrumbPage>Clientes</BreadcrumbPage>
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
            <h1 className="text-2xl font-bold">Lista de Clientes</h1>
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Crear Nuevo Cliente
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
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">
                  Dirección
                </TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedClientes.map((c) => (
                <TableRow key={c.cliente_id}>
                  <TableCell className="font-medium truncate">
                    {c.nombre}
                  </TableCell>
                  <TableCell className="">{c.identificacion_fiscal}</TableCell>
                  <TableCell className="">{c.telefono}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {c.email}
                  </TableCell>
                  <TableCell className=" hidden md:table-cell">
                    {c.direccion}
                  </TableCell>
                  <TableCell className="text-right flex flex-wrap justify-end gap-2">
                    <Button
                      className=""
                      onClick={() => {
                        setEditClienteId(c.cliente_id);
                        setEditNombre(c.nombre);
                        setEditIdentificacionFiscal(
                          c.identificacion_fiscal || ""
                        );
                        setEditTelefono(c.telefono || "");
                        setEditEmail(c.email || "");
                        setEditDireccion(c.direccion || "");
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil></Pencil>
                    </Button>
                    <Button
                      variant="destructive"
                      className=""
                      onClick={() => handleDeleteCliente(c.cliente_id)}
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
              <DialogTitle>Crear Nuevo Cliente</DialogTitle>
              <DialogDescription>
                Ingresa los detalles del nuevo cliente.
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
            </div>
            <DialogFooter>
              <Button onClick={handleCreateCliente}>Crear Cliente</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
              <DialogDescription>
                Actualiza los detalles del cliente.
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
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateCliente}>Actualizar Cliente</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
