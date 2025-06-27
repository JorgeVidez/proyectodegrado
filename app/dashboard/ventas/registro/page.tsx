"use client";

import {
  createVenta,
  deleteVenta,
  updateVenta,
  useVentas,
  VentasBase,
  VentasOut,
} from "@/hooks/useVentas";
import { useEffect, useState } from "react";
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
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ClienteCombobox } from "@/components/ClienteCombobox";
import { DatePicker } from "@/components/DatePicker";
import { LoteCombobox } from "@/components/LoteCombobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLotes } from "@/hooks/useLotes";
import { useInventarioAnimal } from "@/hooks/useInventarioAnimal";

import { useAuth } from "@/context/AuthContext";

import Link from "next/link";

export default function VentasPage() {
  const { ventas, isLoading, isError, refresh } = useVentas();
  const { lotes, getLoteById } = useLotes();
  const { fetchInventarioByLote, updateInventario } = useInventarioAnimal();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState<VentasOut | null>(null);

  const { user } = useAuth();

  const [formData, setFormData] = useState<VentasBase>({
    cliente_id: 0,
    fecha_venta: "",
    documento_venta_ref: "",
    precio_venta_total_general: undefined,
    condicion_pago: "",
    lote_origen_id: undefined,
    usuario_registra_id: user?.usuario_id,
    observaciones: "Sin observaciones",
  });

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (isError) console.error(isError);
  }, [isError]);

  const handleInputChange = (field: keyof VentasBase, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const resetForm = () => {
    setFormData({
      cliente_id: 0,
      fecha_venta: "",
      documento_venta_ref: "",
      precio_venta_total_general: undefined,
      condicion_pago: "",
      lote_origen_id: undefined,
      usuario_registra_id: undefined,
      observaciones: "",
    });
  };

  const handleCreate = async () => {
    try {
      setAlert(null);

      await createVenta(formData, { fetchInventarioByLote, updateInventario });

      refresh();
      setIsCreateDialogOpen(false);
      setAlert({
        type: "success",
        message: "Venta creada con éxito y animales marcados como vendidos.",
      });
      resetForm();
    } catch (e: any) {
      setAlert({
        type: "error",
        message: e.response?.data?.detail || "Error al crear la venta.",
      });
    } finally {
      setIsCreateDialogOpen(false);
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleEdit = (venta: VentasOut) => {
    setSelectedVenta(venta);
    setFormData({ ...venta });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedVenta) return;
    try {
      await updateVenta(selectedVenta.venta_id, formData);
      refresh();
      setIsEditDialogOpen(false);
      setAlert({ type: "success", message: "Venta actualizada con éxito." });
    } catch (e) {
      setAlert({ type: "error", message: "Error al actualizar la venta." });
    }
    setTimeout(() => setAlert(null), 3000);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteVenta(id);
      refresh();
      setAlert({ type: "success", message: "Venta eliminada con éxito." });
    } catch (e) {
      setAlert({ type: "error", message: "Error al eliminar la venta." });
    }
    setTimeout(() => setAlert(null), 3000);
  };
  const getTotalPriceByLote = async (loteId: number) => {
    if (!lotes) return 0;

    const lote = await getLoteById(loteId);
    if (!lote) return 0;

    const total = lote.inventarios.reduce((sum, inventario) => {
      return sum + (inventario.precio_compra || 0);
    }, 0);

    return total;
  };

  if (isLoading) return <div>Cargando ventas...</div>;
  if (isError) return <div>Error al cargar ventas.</div>;

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Ventas</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Registro</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Gestión de Ventas</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Nueva Venta
          </Button>
        </div>
        {alert && (
          <Alert variant={alert.type === "error" ? "destructive" : "default"}>
            <AlertTitle>
              {alert.type === "error" ? "Error" : "Éxito"}
            </AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}
        <Separator className="my-4" />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="hidden md:table-cell">Doc Ref</TableHead>
              <TableHead className="hidden sm:table-cell">
                Precio Total
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Condición Pago
              </TableHead>
              <TableHead>Lote Origen</TableHead>
              <TableHead className="hidden sm:table-cell">
                Usuario Registra
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Observaciones
              </TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ventas?.map((v) => (
              <TableRow key={v.venta_id}>
                <TableCell>{v.cliente?.nombre}</TableCell>
                <TableCell>{v.fecha_venta}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {v.documento_venta_ref}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {v.precio_venta_total_general}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {v.condicion_pago}
                </TableCell>
                <TableCell>{v.lote_origen?.codigo_lote}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {v.usuario_registra?.nombre}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {v.observaciones}
                </TableCell>
                <TableCell className="flex gap-2">
                  {/* Botón para ver detalles */}
                  <Link href={`/dashboard/ventas/detalles/${v.venta_id}`}>
                    <Button size="icon" variant="outline">
                      <Eye /> {/* Icono de ojo para ver detalles */}
                    </Button>
                  </Link>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleEdit(v)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(v.venta_id)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog
          open={isCreateDialogOpen || isEditDialogOpen}
          onOpenChange={(open) => {
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
          }}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {isEditDialogOpen ? "Editar Venta" : "Nueva Venta"}
              </DialogTitle>
              <DialogDescription>
                {isEditDialogOpen
                  ? "Edita los campos para modificar la venta."
                  : "Completa los campos para registrar una nueva venta."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Cliente ID */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cliente_id" className="text-right">
                  Cliente
                </Label>
                <div className="col-span-3">
                  <ClienteCombobox
                    label="Cliente"
                    value={formData.cliente_id}
                    onChange={(clienteId) =>
                      handleInputChange("cliente_id", clienteId)
                    }
                  />
                </div>
              </div>

              {/* Fecha Venta */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fecha_venta" className="text-right">
                  Fecha Venta
                </Label>
                <div className="col-span-3">
                  <DatePicker
                    value={formData.fecha_venta}
                    onChange={(date) => {
                      const safeDate = date || ""; // Ensure fecha_venta is always a string
                      handleInputChange("fecha_venta", safeDate);
                      setFormData((prev) => ({
                        ...prev,
                        fecha_venta: safeDate,
                      }));
                    }}
                  ></DatePicker>
                </div>

                {/* Aquí puedes reemplazar por un DatePicker personalizado si lo prefieres */}
              </div>

              {/* Documento Venta Ref */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="documento_venta_ref" className="text-right">
                  Documento Ref
                </Label>
                <Select
                  value={formData.documento_venta_ref ?? ""}
                  onValueChange={(value) =>
                    handleInputChange("documento_venta_ref", value)
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Factura">Factura</SelectItem>
                    <SelectItem value="Boleta">Boleta</SelectItem>
                    <SelectItem value="Recibo">Recibo</SelectItem>
                    {/* Aquí puedes agregar más opciones de documentos */}
                  </SelectContent>
                </Select>
              </div>

              {/* Condición de Pago */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="condicion_pago" className="text-right">
                  Condición Pago
                </Label>
                <Select
                  value={formData.condicion_pago ?? ""}
                  onValueChange={(value) =>
                    handleInputChange("condicion_pago", value)
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona una condición" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Contado">Contado</SelectItem>
                    <SelectItem value="Crédito">Crédito</SelectItem>
                    <SelectItem value="30 días">Crédito a 30 días</SelectItem>
                    <SelectItem value="60 días">Crédito a 60 días</SelectItem>
                    {/* Aquí puedes agregar más opciones de condiciones de pago */}
                  </SelectContent>
                </Select>

                {/* Aquí podrías colocar un Combobox para condiciones de pago */}
              </div>

              {/* Lote Origen ID */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lote_origen_id" className="text-right">
                  Lote Origen ID
                </Label>
                <div className="col-span-3">
                  <LoteCombobox
                    label="Lote Origen"
                    value={formData.lote_origen_id ?? null}
                    onChange={(loteId) =>
                      handleInputChange("lote_origen_id", loteId)
                    }
                  />
                </div>

                {/* Aquí podrías colocar un Combobox para selección de lotes */}
              </div>
              {/* Precio Venta Total General */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="precio_venta_total_general"
                  className="text-right"
                >
                  Precio Total
                </Label>
                <Input
                  id="precio_venta_total_general"
                  className="col-span-2"
                  type="number"
                  value={formData.precio_venta_total_general ?? ""}
                  onChange={(e) =>
                    handleInputChange(
                      "precio_venta_total_general",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />

                <Button
                  className="col-span-1"
                  onClick={async () => {
                    if (formData.lote_origen_id) {
                      const total = await getTotalPriceByLote(
                        formData.lote_origen_id
                      );
                      handleInputChange("precio_venta_total_general", total);
                    }
                  }}
                >
                  Calcular
                </Button>
              </div>

              {/* Usuario Registra ID */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="usuario_registra_id" className="text-right">
                  Usuario Registra ID
                </Label>
                <Input
                  id="usuario_registra_id"
                  className="col-span-3"
                  type="text"
                  value={user?.nombre ?? ""}
                  disabled
                />
                {/* Aquí podrías colocar un Combobox para usuarios */}
              </div>

              {/* Observaciones */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="observaciones" className="text-right">
                  Observaciones
                </Label>
                <Input
                  id="observaciones"
                  className="col-span-3"
                  value={formData.observaciones ?? ""}
                  onChange={(e) =>
                    handleInputChange("observaciones", e.target.value)
                  }
                />
                {/* También podrías usar un Textarea aquí si es mucho texto */}
              </div>
            </div>

            <DialogFooter>
              <Button onClick={isEditDialogOpen ? handleUpdate : handleCreate}>
                {isEditDialogOpen ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
