"use client";

import { useState, useMemo, SetStateAction } from "react";
import {
  Typography,
  CircularProgress,
  Box,
  MenuItem,
  Paper,
  Divider,
  Grid as MuiGrid,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { useInventarioAnimal } from "@/hooks/useInventarioAnimal";
import { useAnimales } from "@/hooks/useAnimales";
import { useControlesSanitarios } from "@/hooks/useControlesSanitarios";
import { useVacunaciones } from "@/hooks/useVacunaciones";
import { useAlimentaciones } from "@/hooks/useAlimentaciones";
import { useVentas } from "@/hooks/useVentas";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Download,
  Printer,
  RefreshCcw,
  Filter,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  Maximize2,
  User,
  Calendar,
  Activity,
  Users,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  DollarSign,
  ShoppingCart,
  Clipboard,
} from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#a4de6c",
  "#1f77b4",
  "#ff7300",
  "#d62728",
];
const DEFAULT_DATE_RANGE = {
  from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
  to: addDays(new Date(), 20),
};

const DashboardPage = () => {
  // Estado para filtros
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    DEFAULT_DATE_RANGE
  );
  const [especieFilter, setEspecieFilter] = useState("todas");
  const [ubicacionFilter, setUbicacionFilter] = useState("todas");
  const [activeTab, setActiveTab] = useState("general");
  const [expandedSection, setExpandedSection] = useState(null);

  // Carga de datos
  const {
    inventarios,
    isLoading: loadingInventario,
    fetchInventario,
  } = useInventarioAnimal();
  const { animales, isLoading: loadingAnimales } = useAnimales();
  const { controles, isLoading: loadingControles } = useControlesSanitarios();
  const { vacunaciones, isLoading: loadingVacunas } = useVacunaciones();
  const { alimentaciones, isLoading: loadingAlimentos } = useAlimentaciones();
  const { ventas, isLoading: loadingVentas } = useVentas();

  const isLoading =
    loadingInventario ||
    loadingAnimales ||
    loadingControles ||
    loadingVacunas ||
    loadingAlimentos ||
    loadingVentas;

  // Función para actualizar todos los datos
  const handleRefreshData = () => {
    if (inventarios && inventarios.length > 0) {
      // Pasamos un ID válido, usando el primero del inventario como ejemplo
      fetchInventario(inventarios[0].animal_id);
    } else {
      console.warn("No hay inventarios para refrescar");
    }
    // Añadir el resto de refetch de otras consultas aquí
  };

  // Filtrar datos según los filtros activos
  const filteredData = useMemo(() => {
    if (isLoading || !inventarios || !animales) return { activos: [] };

    let filteredInventarios = inventarios.filter((inv) => inv.activo_en_finca);

    // Filtrar por fecha
    if (dateRange?.from && dateRange?.to) {
      const from = new Date(dateRange.from);
      const to = new Date(dateRange.to);
      filteredInventarios = filteredInventarios.filter((inv) => {
        const invDate = new Date(inv.fecha_ingreso);
        return invDate >= from && invDate <= to;
      });
    }

    // Filtrar por especie
    if (especieFilter !== "todas") {
      filteredInventarios = filteredInventarios.filter((inv) => {
        const animal = animales.find((a) => a.animal_id === inv.animal_id);
        return animal && animal.especie.nombre_comun === especieFilter;
      });
    }

    // Filtrar por ubicación
    if (ubicacionFilter !== "todas") {
      filteredInventarios = filteredInventarios.filter(
        (inv) =>
          inv.ubicacion_actual_id !== null &&
          inv.ubicacion_actual_id !== undefined &&
          inv.ubicacion_actual_id.toString() === ubicacionFilter
      );
    }

    return { activos: filteredInventarios };
  }, [
    inventarios,
    animales,
    dateRange,
    especieFilter,
    ubicacionFilter,
    isLoading,
  ]);

  // Calculamos los datos para los gráficos basados en los filtros
  const dashboardData = useMemo(() => {
    if (isLoading || !filteredData.activos.length || !animales) return {};

    const activos = filteredData.activos;

    // KPIs principales
    const totalActivos = activos.length;
    const totalEspecies = new Set(
      activos
        .map((inv) => {
          const animal = animales.find((a) => a.animal_id === inv.animal_id);
          return animal?.especie.nombre_comun;
        })
        .filter(Boolean)
    ).size;

    const animalesPorUbicacion = activos.reduce(
      (acc, inv) => {
        const key = inv.ubicacion_actual_id ?? "Sin ubicación";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const animalesPorLote = activos.reduce(
      (acc, inv) => {
        const key = inv.lote_actual_id ?? "Sin lote";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const inventarioPorFecha = activos.reduce(
      (acc, inv) => {
        const fecha = inv.fecha_ingreso.slice(0, 10); // YYYY-MM-DD
        acc[fecha] = (acc[fecha] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Distribución por especie
    const especieCount = activos.reduce(
      (acc, inv) => {
        const animal = animales.find((a) => a.animal_id === inv.animal_id);
        if (animal) {
          const key = animal.especie.nombre_comun;
          acc[key] = (acc[key] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    // Distribución por raza agrupada por especie
    const especieRaza = activos.reduce(
      (acc, inv) => {
        const animal = animales.find((a) => a.animal_id === inv.animal_id);
        if (animal) {
          const especie = animal.especie.nombre_comun;
          const raza = animal.raza.nombre_raza;
          if (!acc[especie]) acc[especie] = {};
          acc[especie][raza] = (acc[especie][raza] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, Record<string, number>>
    );

    // Peso promedio por especie en el tiempo
    const especiePesoPorFecha: Record<string, Record<string, number[]>> = {};
    if (controles) {
      controles.forEach((control) => {
        const fecha = control.fecha_control?.slice(0, 10);
        if (!fecha || !control.peso_kg) return;

        const animal = animales.find((a) => a.animal_id === control.animal_id);
        if (!animal) return;

        // Verificar si está en el filtro activo
        const inventario = activos.find(
          (inv) => inv.animal_id === animal.animal_id
        );
        if (!inventario) return;

        const especie = animal.especie.nombre_comun || "Desconocida";

        if (!especiePesoPorFecha[fecha]) especiePesoPorFecha[fecha] = {};
        if (!especiePesoPorFecha[fecha][especie])
          especiePesoPorFecha[fecha][especie] = [];

        especiePesoPorFecha[fecha][especie].push(control.peso_kg);
      });
    }

    const pesoPromedioData = Object.entries(especiePesoPorFecha)
      .map(([fecha, especies]) => {
        const row: Record<string, any> = { fecha };
        Object.entries(especies).forEach(([especie, pesos]) => {
          const avg = pesos.reduce((acc, peso) => acc + peso, 0) / pesos.length;
          row[especie] = parseFloat(avg.toFixed(2));
        });
        return row;
      })
      .sort((a, b) => a.fecha.localeCompare(b.fecha));

    // Vacunas relacionadas con los animales filtrados
    const vacunasFiltradas = vacunaciones?.filter((vac) => {
      const animal = activos.find((inv) => inv.animal_id === vac.animal_id);
      return !!animal;
    });

    const vacunasPorTipo = vacunasFiltradas?.reduce(
      (acc, vac) => {
        const tipo = vac.tipo_vacuna_id.toString();
        acc[tipo] = (acc[tipo] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Alimentaciones por tipo para los animales filtrados
    const alimentacionesFiltradas = alimentaciones?.filter((ali) => {
      const animal = activos.find((inv) => inv.animal_id === ali.animal_id);
      return !!animal;
    });

    const alimentosPorTipo = alimentacionesFiltradas?.reduce(
      (acc, ali) => {
        const tipo = ali.tipo_alimento_id.toString();
        acc[tipo] = (acc[tipo] || 0) + ali.cantidad_suministrada;
        return acc;
      },
      {} as Record<string, number>
    );

    // Ventas relacionadas con los animales filtrados
    const ventasFiltradas = ventas?.filter((venta) => {
      // Asumiendo que la venta tiene alguna relación con el animal_id
      const animal = activos.find(
        (inv) => inv.lote_actual_id === venta.lote_origen_id
      );
      return !!animal;
    });

    // Ventas por fecha
    const ventasPorFecha: Record<string, { total: number; count: number }> = {};
    ventasFiltradas?.forEach((v) => {
      const fecha = v.fecha_venta;
      if (!ventasPorFecha[fecha])
        ventasPorFecha[fecha] = { total: 0, count: 0 };
      ventasPorFecha[fecha].total += v.precio_venta_total_general ?? 0;
      ventasPorFecha[fecha].count += 1;
    });

    const ventasData = Object.entries(ventasPorFecha)
      .map(([fecha, { total, count }]) => ({
        fecha,
        ingresos: total,
        ventas: count,
      }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));

    // Alertas y eventos importantes
    const proximasVacunaciones =
      vacunaciones?.filter((vac) => {
        const fechaProxima = new Date(vac.fecha_aplicacion);
        // Convert to number and provide default value if undefined
        const diasProxima = vac.proxima_vacunacion_sugerida
          ? Number(vac.proxima_vacunacion_sugerida)
          : 0;
        fechaProxima.setDate(fechaProxima.getDate() + diasProxima);
        const hoy = new Date();
        const diasRestantes = Math.floor(
          (fechaProxima.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
        );
        return diasRestantes >= 0 && diasRestantes <= 15; // Próximas en 15 días
      }) || [];

    // Formato de datos para gráficos
    const formatBarData = (data: Record<string, number>) =>
      Object.entries(data).map(([key, value]) => ({
        name: key.toString(),
        value,
      }));

    const formatLineData = (data: Record<string, number>) =>
      Object.entries(data)
        .map(([fecha, value]) => ({
          fecha,
          cantidad: value,
        }))
        .sort((a, b) => a.fecha.localeCompare(b.fecha));

    const stackedBarData = Object.keys(especieRaza).map((especie) => {
      const entry: any = { especie };
      Object.entries(especieRaza[especie]).forEach(([raza, count]) => {
        entry[raza] = count;
      });
      return entry;
    });

    const razas = Array.from(new Set(animales?.map((a) => a.raza.nombre_raza)));

    const especiesNombres = [
      ...new Set(animales?.map((a) => a.especie.nombre_comun)),
    ];

    // Calcular tasa de crecimiento (comparación con período anterior)
    const totalAnterior = inventarios.filter((inv) => {
      const invDate = new Date(inv.fecha_ingreso);
      if (!dateRange?.from) return false;
      const from = new Date(dateRange.from);
      const monthBefore = new Date(from);
      monthBefore.setMonth(monthBefore.getMonth() - 1);
      return invDate >= monthBefore && invDate < from && inv.activo_en_finca;
    }).length;

    const tasaCrecimiento =
      totalAnterior > 0
        ? ((totalActivos - totalAnterior) / totalAnterior) * 100
        : 0;

    return {
      totalActivos,
      totalEspecies,
      tasaCrecimiento,
      proximasVacunaciones,
      animalesPorUbicacion,
      animalesPorLote,
      inventarioPorFecha,
      especieCount,
      especieRaza,
      pesoPromedioData,
      vacunasPorTipo,
      alimentosPorTipo,
      ventasData,
      formatBarData,
      formatLineData,
      stackedBarData,
      razas,
      especiesNombres,
      especiePesoPorFecha,
    };
  }, [
    filteredData,
    animales,
    controles,
    vacunaciones,
    alimentaciones,
    ventas,
    isLoading,
    dateRange?.from,
  ]);

  // Lista de especies y ubicaciones para filtros
  const especiesOptions = useMemo(() => {
    if (!animales) return [];
    const especies = [...new Set(animales.map((a) => a.especie.nombre_comun))];
    return ["todas", ...especies];
  }, [animales]);

  const ubicacionesOptions = useMemo(() => {
    if (!inventarios) return [];
    const ubicaciones = [
      ...new Set(
        inventarios.map((inv) => inv.ubicacion_actual_id).filter(Boolean)
      ),
    ].map(String); // Convert all values to string
    return ["todas", ...ubicaciones];
  }, [inventarios]);

  // Renderizado condicional para carga
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando datos del inventario...
        </Typography>
      </Box>
    );
  }

  // Toggle para expandir/colapsar secciones
  const toggleSection = (section: SetStateAction<null>) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Función para exportar datos (simulada)
  const handleExportData = () => {
    alert("Exportando datos del dashboard. Función a implementar.");
  };

  // Función para imprimir dashboard
  const handlePrintDashboard = () => {
    window.print();
  };

  return (
    <div className="dashboard-container">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Reportes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard de Inventario Animal</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefreshData}>
            <RefreshCcw className="mr-1 h-4 w-4" />
            Actualizar
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="mr-1 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrintDashboard}>
            <Printer className="mr-1 h-4 w-4" />
            Imprimir
          </Button>
        </div>
      </header>

      {/* Panel de filtros */}
      <div className="p-4 mb-4 mx-4 mt-4 ">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            <Typography variant="h6">Filtros</Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-auto">
            <div>
              <Typography variant="subtitle2" className="mb-1">
                Rango de fechas
              </Typography>
              <DateRangePicker value={dateRange} onSelect={setDateRange} />
            </div>

            <div>
              <Typography variant="subtitle2" className="mb-1">
                Especie
              </Typography>
              <Select value={especieFilter} onValueChange={setEspecieFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las especies" />
                </SelectTrigger>
                <SelectContent>
                  {especiesOptions.map((especie) => (
                    <SelectItem key={especie} value={especie}>
                      {especie === "todas" ? "Todas las especies" : especie}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Typography variant="subtitle2" className="mb-1">
                Ubicación
              </Typography>
              <Select
                value={ubicacionFilter}
                onValueChange={setUbicacionFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las ubicaciones" />
                </SelectTrigger>
                <SelectContent>
                  {ubicacionesOptions.map((ubicacion) => (
                    <SelectItem key={ubicacion} value={ubicacion.toString()}>
                      {ubicacion === "todas"
                        ? "Todas las ubicaciones"
                        : ubicacion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-4 pb-8">
        {/* Tarjetas KPI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border rounded-lg shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                <Typography variant="h6">Animales Activos</Typography>
              </div>
              <Typography variant="h3" className="mb-1">
                {dashboardData.totalActivos || 0}
              </Typography>
              <div className="flex items-center text-sm">
                <span
                  className={
                    (dashboardData.tasaCrecimiento ?? 0) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {(dashboardData.tasaCrecimiento ?? 0) >= 0 ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  {Math.abs(dashboardData.tasaCrecimiento || 0).toFixed(1)}%
                </span>
                <span className="text-gray-500 ml-1">vs período anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border rounded-lg shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <PieChartIcon className="h-5 w-5 mr-2 text-purple-500" />
                <Typography variant="h6">Diversidad de Especies</Typography>
              </div>
              <Typography variant="h3" className="mb-1">
                {dashboardData.totalEspecies || 0}
              </Typography>
              <Typography variant="body2" className="text-gray-500 text-sm">
                Especies bajo monitoreo
              </Typography>
            </CardContent>
          </Card>

          <Card className="border rounded-lg shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <Activity className="h-5 w-5 mr-2 text-green-500" />
                <Typography variant="h6">Próximas Vacunaciones</Typography>
              </div>
              <Typography variant="h3" className="mb-1">
                {dashboardData.proximasVacunaciones?.length || 0}
              </Typography>
              <Typography variant="body2" className="text-gray-500 text-sm">
                En los próximos 15 días
              </Typography>
            </CardContent>
          </Card>

          <Card className="border rounded-lg shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <DollarSign className="h-5 w-5 mr-2 text-yellow-500" />
                <Typography variant="h6">Ingresos por Ventas</Typography>
              </div>
              <Typography variant="h3" className="mb-1">
                {dashboardData.ventasData && dashboardData.ventasData.length > 0
                  ? `$${dashboardData.ventasData.reduce((sum, item) => sum + item.ingresos, 0).toLocaleString()}`
                  : "$0"}
              </Typography>
              <Typography variant="body2" className="text-gray-500 text-sm">
                {dashboardData.ventasData?.length || 0} transacciones
              </Typography>
            </CardContent>
          </Card>
        </div>

        {/* Alertas */}
        {(dashboardData.proximasVacunaciones?.length ?? 0) > 0 && (
          <Paper className="mb-6 p-4 border-l-4 border-l-yellow-500 bg-yellow-50">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500 mt-0.5" />
              <div>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  className="mb-1"
                >
                  Atención: {dashboardData.proximasVacunaciones?.length || 0}{" "}
                  vacunaciones programadas pronto
                </Typography>
                <Typography variant="body2">
                  Hay animales que requieren vacunación en los próximos 15 días.
                  <Button variant="link" className="p-0 h-auto ml-1">
                    Ver detalles
                  </Button>
                </Typography>
              </div>
            </div>
          </Paper>
        )}

        {/* Pestañas para organizar secciones */}
        <Tabs
          defaultValue="general"
          className="mb-6"
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="distribucion">Distribución</TabsTrigger>
            <TabsTrigger value="salud">Salud y Alimentación</TabsTrigger>
            <TabsTrigger value="financiero">Financiero</TabsTrigger>
          </TabsList>

          {/* Pestaña General */}
          <TabsContent value="general" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Tendencia del Inventario */}
              <Card className="border rounded-lg shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
                  <div className="flex items-center">
                    <LineChartIcon className="h-5 w-5 mr-2 text-blue-500" />
                    <Typography variant="h6">
                      Tendencia del Inventario Activo
                    </Typography>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={dashboardData.formatLineData?.(
                        dashboardData.inventarioPorFecha || {}
                      )}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fecha" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="cantidad"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Distribución por Especie (Pie Chart) */}
              <Card className="border rounded-lg shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
                  <div className="flex items-center">
                    <PieChartIcon className="h-5 w-5 mr-2 text-purple-500" />
                    <Typography variant="h6">
                      Distribución por Especie
                    </Typography>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData.formatBarData?.(
                          dashboardData.especieCount || {}
                        )}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                      >
                        {Object.keys(dashboardData.especieCount || {}).map(
                          (_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Peso promedio por Especie (línea) */}
            <Card className="border rounded-lg shadow-sm mb-6">
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
                <div className="flex items-center">
                  <LineChartIcon className="h-5 w-5 mr-2 text-green-500" />
                  <Typography variant="h6">
                    Peso Promedio por Especie (Tendencia)
                  </Typography>
                </div>
                <Button variant="ghost" size="sm">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.pesoPromedioData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {(dashboardData.especiesNombres || []).map(
                      (especie, idx) => (
                        <Line
                          key={especie}
                          type="monotone"
                          dataKey={especie}
                          stroke={COLORS[idx % COLORS.length]}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      )
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña Distribución */}
          <TabsContent value="distribucion" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Distribución por Ubicación */}
              {/* Distribución por Ubicación */}
              <Card className="border rounded-lg shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
                  <div className="flex items-center">
                    <BarChartIcon className="h-5 w-5 mr-2 text-indigo-500" />
                    <Typography variant="h6">
                      Distribución por Ubicación
                    </Typography>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      layout="vertical"
                      data={dashboardData.formatBarData?.(
                        dashboardData.animalesPorUbicacion || {}
                      )}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={120} />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#8884d8"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Distribución por Lote */}
              <Card className="border rounded-lg shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
                  <div className="flex items-center">
                    <BarChartIcon className="h-5 w-5 mr-2 text-blue-500" />
                    <Typography variant="h6">Distribución por Lote</Typography>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={dashboardData.formatBarData?.(
                        dashboardData.animalesPorLote || {}
                      )}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#82ca9d"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Distribución por Raza dentro de Especie */}
            <Card className="border rounded-lg shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
                <div className="flex items-center">
                  <BarChartIcon className="h-5 w-5 mr-2 text-orange-500" />
                  <Typography variant="h6">
                    Distribución por Raza dentro de Especie
                  </Typography>
                </div>
                <Button variant="ghost" size="sm">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={dashboardData.stackedBarData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="especie" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {(dashboardData.razas || []).map((raza, index) => (
                      <Bar
                        key={raza}
                        dataKey={raza}
                        stackId="a"
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña Salud y Alimentación */}
          <TabsContent value="salud" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Vacunaciones por Tipo */}
              <Card className="border rounded-lg shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-red-500" />
                    <Typography variant="h6">Vacunaciones por Tipo</Typography>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={dashboardData.formatBarData?.(
                        dashboardData.vacunasPorTipo || {}
                      )}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#ff7f50"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Suministro de Alimentos por Tipo */}
              <Card className="border rounded-lg shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
                  <div className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2 text-green-500" />
                    <Typography variant="h6">
                      Suministro de Alimentos por Tipo
                    </Typography>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      layout="vertical"
                      data={dashboardData.formatBarData?.(
                        dashboardData.alimentosPorTipo || {}
                      )}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={120} />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#a4de6c"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Calendario de próximas vacunaciones */}
            <Card className="border rounded-lg shadow-sm mb-6">
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                  <Typography variant="h6">
                    Programación de Vacunaciones
                  </Typography>
                </div>
                <Button variant="outline" size="sm">
                  <Clipboard className="h-4 w-4 mr-1" />
                  Ver completo
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                {(dashboardData.proximasVacunaciones?.length ?? 0) > 0 ? (
                  <div className="divide-y">
                    {(dashboardData.proximasVacunaciones || [])
                      .slice(0, 5)
                      .map((vacuna, idx) => (
                        <div
                          key={idx}
                          className="py-2 flex justify-between items-center"
                        >
                          <div>
                            <Typography variant="subtitle2">
                              Animal ID: {vacuna.animal_id}
                            </Typography>
                            <Typography
                              variant="body2"
                              className="text-gray-500"
                            >
                              Tipo: {vacuna.tipo_vacuna_id.toString()}
                            </Typography>
                          </div>
                          <div>
                            <Typography
                              variant="subtitle2"
                              className="text-right"
                            >
                              {new Date(
                                vacuna.fecha_aplicacion
                              ).toLocaleDateString()}
                            </Typography>
                            <Typography
                              variant="body2"
                              className="text-gray-500 text-right"
                            >
                              {vacuna.proxima_vacunacion_sugerida} días para
                              revacunación
                            </Typography>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <Typography
                    variant="body2"
                    className="text-center py-6 text-gray-500"
                  >
                    No hay vacunaciones programadas en el período seleccionado
                  </Typography>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña Financiero */}
          <TabsContent value="financiero" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Ingresos por Ventas (Tendencia) */}
              <Card className="border rounded-lg shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
                  <div className="flex items-center">
                    <LineChartIcon className="h-5 w-5 mr-2 text-blue-500" />
                    <Typography variant="h6">
                      Ingresos por Ventas (Tendencia)
                    </Typography>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData.ventasData || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fecha" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [
                          `$${value.toLocaleString()}`,
                          "Ingresos",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="ingresos"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Cantidad de Ventas por Periodo */}
              <Card className="border rounded-lg shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
                  <div className="flex items-center">
                    <BarChartIcon className="h-5 w-5 mr-2 text-green-500" />
                    <Typography variant="h6">
                      Cantidad de Ventas por Periodo
                    </Typography>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardData.ventasData || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fecha" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="ventas"
                        fill="#82ca9d"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Resumen financiero */}
            <Card className="border rounded-lg shadow-sm mb-6">
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-yellow-500" />
                  <Typography variant="h6">Resumen Financiero</Typography>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Exportar
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <Typography variant="subtitle2" className="text-gray-500">
                      Total Ingresos
                    </Typography>
                    <Typography variant="h5">
                      $
                      {dashboardData.ventasData
                        ?.reduce((sum, item) => sum + item.ingresos, 0)
                        .toLocaleString() || "0"}
                    </Typography>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <Typography variant="subtitle2" className="text-gray-500">
                      Transacciones
                    </Typography>
                    <Typography variant="h5">
                      {dashboardData.ventasData?.reduce(
                        (sum, item) => sum + item.ventas,
                        0
                      ) || "0"}
                    </Typography>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <Typography variant="subtitle2" className="text-gray-500">
                      Promedio por Venta
                    </Typography>
                    <Typography variant="h5">
                      {dashboardData.ventasData &&
                      dashboardData.ventasData.length > 0
                        ? `$${(
                            dashboardData.ventasData.reduce(
                              (sum, item) => sum + item.ingresos,
                              0
                            ) /
                            dashboardData.ventasData.reduce(
                              (sum, item) => sum + item.ventas,
                              0
                            )
                          ).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}`
                        : "$0"}
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer con información adicional */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <Typography variant="body2">
            Última actualización: {new Date().toLocaleDateString()}{" "}
            {new Date().toLocaleTimeString()}
          </Typography>
          <Typography variant="body2">
            Sistema de Gestión de Inventario Animal — v1.2.0
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
