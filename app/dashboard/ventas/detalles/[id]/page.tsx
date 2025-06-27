"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getVentaById, VentasOut } from "@/hooks/useVentas";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DollarSign,
  Calendar,
  FileText,
  Banknote,
  Tag,
  User,
  Info,
  Package,
  PiggyBank as Pig,
  Warehouse,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Clock,
  Receipt,
  Building,
  Users,
  Weight,
  TrendingUp,
  Calculator,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventarioAnimal } from "@/hooks/useInventarioAnimal";
import { InventarioAnimalOut } from "@/types/inventarioAnimal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const VentaDetailsPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [venta, setVenta] = useState<VentasOut | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { fetchInventarioByLote, isLoading: loading } = useInventarioAnimal();
  const [inventario, setInventario] = useState<InventarioAnimalOut[] | null>(
    null
  );

  useEffect(() => {
    const fetchVentaDetails = async () => {
      if (!id) {
        setIsError(true);
        setIsLoading(false);
        return;
      }
      try {
        const ventaData = await getVentaById(parseInt(id, 10));
        setVenta(ventaData);
        if (ventaData.lote_origen) {
          const inventarioData = await fetchInventarioByLote(
            ventaData.lote_origen.lote_id
          );
          setInventario(inventarioData);
        }
      } catch (error) {
        console.error("Error fetching venta details:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVentaDetails();
  }, [id]);

  // Función auxiliar para obtener el estado de pago
  const getPaymentStatus = (condicion: string) => {
    const status = condicion?.toLowerCase() || "";
    if (status.includes("contado") || status.includes("efectivo")) {
      return {
        variant: "default" as const,
        icon: CheckCircle2,
        text: "Pagado",
        color: "text-green-600",
      };
    } else if (status.includes("credito") || status.includes("pendiente")) {
      return {
        variant: "secondary" as const,
        icon: Clock,
        text: "Crédito",
        color: "text-yellow-600",
      };
    }
    return {
      variant: "outline" as const,
      icon: Info,
      text: condicion || "No especificado",
      color: "text-gray-600",
    };
  };

  // Calcular estadísticas del inventario
  const inventarioStats = inventario
    ? {
        totalAnimales: inventario.length,
        valorTotal: inventario.reduce(
          (sum, item) => sum + (item.precio_compra || 0),
          0
        ),
        especies: [
          ...new Set(
            inventario
              .map((item) => item.animal.especie?.nombre_comun)
              .filter(Boolean)
          ),
        ],
        razas: [
          ...new Set(
            inventario
              .map((item) => item.animal.raza?.nombre_raza)
              .filter(Boolean)
          ),
        ],
      }
    : null;

  // Loading State
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/ventas/registro">
                    Ventas
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Cargando...</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>

          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/ventas/registro">
                    Ventas
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Error</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <Alert className="max-w-md" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mt-2">
              <strong>Error al cargar la venta</strong>
              <br />
              No se pudo recuperar la información. Verifique el ID y la conexión
              al servidor.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  // Not Found State
  if (!venta) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/ventas/registro">
                    Ventas
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>No encontrada</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <Alert className="max-w-md">
            <Info className="h-4 w-4" />
            <AlertDescription className="mt-2">
              <strong>Venta no encontrada</strong>
              <br />
              La venta con el ID especificado no existe en el sistema.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  const paymentStatus = getPaymentStatus(venta.condicion_pago || "");

  // Main Content
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/ventas/registro">
                  Ventas
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Venta #{venta.venta_id}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
        {/* Page Title */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Venta #{venta.venta_id}
              </h1>
              <p className="text-muted-foreground">
                Detalles completos de la transacción
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                <Receipt className="mr-1 h-3 w-3" />
                {venta.documento_venta_ref || "Sin documento"}
              </Badge>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total de Venta
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      $
                      {venta.precio_venta_total_general?.toLocaleString(
                        "es-MX",
                        {
                          minimumFractionDigits: 2,
                        }
                      ) || "0.00"}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Estado de Pago
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <paymentStatus.icon
                        className={`h-4 w-4 ${paymentStatus.color}`}
                      />
                      <span className="font-semibold">
                        {paymentStatus.text}
                      </span>
                    </div>
                  </div>
                  <Banknote className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Animales Vendidos
                    </p>
                    <p className="text-2xl font-bold">
                      {inventarioStats?.totalAnimales || 0}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Fecha de Venta
                    </p>
                    <p className="text-lg font-semibold">
                      {new Date(venta.fecha_venta).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="cliente" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Cliente
            </TabsTrigger>
            <TabsTrigger value="lote" className="flex items-center gap-2">
              <Warehouse className="h-4 w-4" />
              Lote
            </TabsTrigger>
            <TabsTrigger value="animales" className="flex items-center gap-2">
              <Pig className="h-4 w-4" />
              Animales
            </TabsTrigger>
          </TabsList>

          {/* Tab Content: General Information */}
          <TabsContent value="general" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-blue-600" />
                    Información de la Transacción
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <div className="flex justify-between items-center py-2 border-b border-dashed">
                      <span className="text-sm font-medium text-muted-foreground">
                        ID de Venta:
                      </span>
                      <span className="font-mono font-semibold">
                        #{venta.venta_id}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-dashed">
                      <span className="text-sm font-medium text-muted-foreground">
                        Documento de Referencia:
                      </span>
                      <span className="font-mono">
                        {venta.documento_venta_ref || "No especificado"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-dashed">
                      <span className="text-sm font-medium text-muted-foreground">
                        Fecha de Venta:
                      </span>
                      <span className="font-semibold">
                        {new Date(venta.fecha_venta).toLocaleDateString(
                          "es-MX",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-dashed">
                      <span className="text-sm font-medium text-muted-foreground">
                        Condición de Pago:
                      </span>
                      <Badge
                        variant={paymentStatus.variant}
                        className="flex items-center gap-1"
                      >
                        <paymentStatus.icon className="h-3 w-3" />
                        {paymentStatus.text}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Monto Total:
                      </span>
                      <span className="text-xl font-bold text-green-700">
                        $
                        {venta.precio_venta_total_general?.toLocaleString(
                          "es-MX",
                          {
                            minimumFractionDigits: 2,
                          }
                        ) || "0.00"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Información de Registro
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <div className="flex justify-between items-center py-2 border-b border-dashed">
                      <span className="text-sm font-medium text-muted-foreground">
                        Registrado por:
                      </span>
                      <span className="font-semibold">
                        {venta.usuario_registra?.nombre || "Sistema"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-dashed">
                      <span className="text-sm font-medium text-muted-foreground">
                        Fecha de Registro:
                      </span>
                      <span className="text-sm">
                        {new Date(venta.fecha_registro).toLocaleString("es-MX")}
                      </span>
                    </div>
                  </div>

                  {venta.observaciones && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Observaciones
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {venta.observaciones}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab Content: Cliente */}
          <TabsContent value="cliente" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Información del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                {venta.cliente ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {venta.cliente.nombre}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Cliente registrado
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Nombre Completo
                        </label>
                        <p className="font-semibold">{venta.cliente.nombre}</p>
                      </div>
                      {/* Aquí puedes agregar más campos del cliente si están disponibles */}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      Sin información de cliente
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      No se ha registrado información específica del cliente
                      para esta venta.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Content: Lote */}
          <TabsContent value="lote" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Warehouse className="h-5 w-5 text-purple-600" />
                  Información del Lote de Origen
                </CardTitle>
              </CardHeader>
              <CardContent>
                {venta.lote_origen ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <Warehouse className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold font-mono">
                          {venta.lote_origen.codigo_lote}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={
                              venta.lote_origen.activo
                                ? "default"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {venta.lote_origen.activo ? (
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                            ) : (
                              <XCircle className="mr-1 h-3 w-3" />
                            )}
                            {venta.lote_origen.activo ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Código del Lote
                          </label>
                          <p className="font-mono font-semibold text-lg">
                            {venta.lote_origen.codigo_lote}
                          </p>
                        </div>

                        {venta.lote_origen.proposito && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Propósito
                            </label>
                            <p className="font-semibold">
                              {venta.lote_origen.proposito}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Estado
                          </label>
                          <div className="flex items-center gap-2">
                            {venta.lote_origen.activo ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span
                              className={`font-semibold ${venta.lote_origen.activo ? "text-green-600" : "text-red-600"}`}
                            >
                              {venta.lote_origen.activo ? "Activo" : "Inactivo"}
                            </span>
                          </div>
                        </div>

                        {inventarioStats && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Animales en el Lote
                            </label>
                            <p className="font-semibold text-lg">
                              {inventarioStats.totalAnimales}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {venta.lote_origen.descripcion && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">
                          Descripción del Lote
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {venta.lote_origen.descripcion}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Warehouse className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      Sin lote de origen
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Esta venta no tiene un lote de origen asociado.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Content: Animales */}
          <TabsContent value="animales" className="space-y-4">
            {inventarioStats && (
              <div className="grid gap-4 md:grid-cols-4 mb-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Total de Animales
                        </p>
                        <p className="text-2xl font-bold">
                          {inventarioStats.totalAnimales}
                        </p>
                      </div>
                      <Package className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Valor de Inventario
                        </p>
                        <p className="text-xl font-bold text-green-700">
                          $
                          {inventarioStats.valorTotal.toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Especies
                        </p>
                        <p className="text-2xl font-bold">
                          {inventarioStats.especies.length}
                        </p>
                      </div>
                      <Pig className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Razas
                        </p>
                        <p className="text-2xl font-bold">
                          {inventarioStats.razas.length}
                        </p>
                      </div>
                      <Tag className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-orange-600" />
                  Detalle de Animales en el Lote
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {venta.lote_origen?.codigo_lote
                    ? `Lote: ${venta.lote_origen.codigo_lote}`
                    : "Sin lote especificado"}
                </p>
              </CardHeader>
              <CardContent>
                {inventario && inventario.length > 0 ? (
                  <div className="space-y-4">
                    {/* Resumen de especies y razas */}
                    {inventarioStats && (
                      <div className="grid gap-4 md:grid-cols-2 p-4 bg-muted/50 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Especies Presentes
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {inventarioStats.especies.map((especie, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {especie}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Razas Presentes
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {inventarioStats.razas.map((raza, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {raza}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tabla de animales */}
                    <div className="overflow-hidden rounded-lg border">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead className="min-w-[180px]">
                                <div className="flex items-center gap-2">
                                  <Tag className="h-4 w-4" />
                                  Identificador
                                </div>
                              </TableHead>
                              <TableHead className="min-w-[120px]">
                                <div className="flex items-center gap-2">
                                  <Pig className="h-4 w-4" />
                                  Especie
                                </div>
                              </TableHead>
                              <TableHead className="min-w-[120px]">
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4" />
                                  Raza
                                </div>
                              </TableHead>
                              <TableHead className="text-right min-w-[120px]">
                                <div className="flex items-center justify-end gap-2">
                                  <DollarSign className="h-4 w-4" />
                                  Precio de Compra
                                </div>
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {inventario.map((item, index) => (
                              <TableRow
                                key={item.inventario_id}
                                className="hover:bg-muted/50 transition-colors"
                              >
                                <TableCell className="font-mono">
                                  <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                      <span className="text-xs font-semibold text-blue-600">
                                        {index + 1}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="font-semibold">
                                        {item.animal.numero_trazabilidad}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        ID: {item.animal.animal_id}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    <span className="font-medium">
                                      {item.animal.especie?.nombre_comun ||
                                        "No especificada"}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="font-medium">
                                    {item.animal.raza?.nombre_raza ||
                                      "No especificada"}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="space-y-1">
                                    <p className="font-mono font-semibold text-green-700">
                                      $
                                      {item.precio_compra?.toLocaleString(
                                        "es-MX",
                                        {
                                          minimumFractionDigits: 2,
                                        }
                                      ) || "0.00"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Costo unitario
                                    </p>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Resumen total */}
                    <div className="flex justify-end">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Calculator className="h-4 w-4" />
                          Total del Inventario
                        </div>
                        <p className="text-2xl font-bold text-green-700">
                          $
                          {inventarioStats?.valorTotal.toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                          }) || "0.00"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                      <Package className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      Sin animales registrados
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      No se han encontrado animales asociados a esta venta o el
                      lote no contiene inventario disponible.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default VentaDetailsPage;
