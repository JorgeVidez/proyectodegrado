"use client"; // Add this line at the top

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Settings,
  Star,
  TrendingUp,
  Sparkles,
  Vegan,
  LayoutDashboard,
  MapPinHouse,
  Badge,
  UserRoundCog,
  PieChart,
  ChevronRight,
} from "lucide-react";

export default function Welcome() {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentTime = new Date().toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const quickActions = [
    {
      title: "Resumen General",
      description: "Vista general del sistema",
      icon: LayoutDashboard,
      link: "/dashboard/resumen/general",
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      hoverColor: "hover:bg-blue-100",
    },
    {
      title: "Registro de Animales",
      description: "Registrar nuevos animales",
      icon: Vegan,
      link: "/dashboard/animales/registro",
      color: "bg-green-50",
      iconColor: "text-green-600",
      hoverColor: "hover:bg-green-100",
    },
    {
      title: "Inventario",
      description: "Ver inventario de animales",
      icon: Star,
      link: "/dashboard/animales/inventario",
      color: "bg-purple-50",
      iconColor: "text-purple-600",
      hoverColor: "hover:bg-purple-100",
    },
    {
      title: "Reportes",
      description: "Generar reportes del sistema",
      icon: TrendingUp,
      link: "/dashboard/administracion/reportes",
      color: "bg-orange-50",
      iconColor: "text-orange-600",
      hoverColor: "hover:bg-orange-100",
    },
  ];

  const mainSections = [
    {
      title: "Gestión de Animales",
      description: "Registro, inventario y control sanitario",
      icon: Vegan,
      links: [
        { name: "Registro", url: "/dashboard/animales/registro" },
        { name: "Inventario", url: "/dashboard/animales/inventario" },
        { name: "Controles Sanitarios", url: "/dashboard/animales/controles" },
      ],
    },
    {
      title: "Lotes y Ubicaciones",
      description: "Gestión de espacios y asignaciones",
      icon: MapPinHouse,
      links: [
        { name: "Lotes", url: "/dashboard/lotes-ubicaciones/lotes" },
        {
          name: "Ubicaciones",
          url: "/dashboard/lotes-ubicaciones/ubicaciones",
        },
        { name: "Asignación", url: "/dashboard/lotes-ubicaciones/asignacion" },
      ],
    },
    {
      title: "Ventas y Clientes",
      description: "Registro de ventas y gestión de clientes",
      icon: Badge,
      links: [
        { name: "Registro de Ventas", url: "/dashboard/ventas/registro" },
        { name: "Clientes", url: "/dashboard/ventas/clientes" },
      ],
    },
    {
      title: "Administración",
      description: "Configuración y gestión del sistema",
      icon: UserRoundCog,
      links: [
        { name: "Usuarios", url: "/dashboard/administracion/usuarios" },
        { name: "Proveedores", url: "/dashboard/administracion/proveedores" },
      ],
    },
  ];

  const handleNavigation = (url: any) => {
    // Aquí puedes usar tu router preferido (React Router, Next.js Router, etc.)
    console.log("Navegando a:", url);
    // Ejemplo: history.push(url) o router.push(url)
  };

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Inicio</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col p-6">
        <div className="max-w-7xl mx-auto w-full space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              ¡Bienvenido de vuelta!
            </h1>
            <div className="space-y-1">
              <p className="text-lg text-muted-foreground capitalize">
                {currentDate}
              </p>
              <p className="text-base text-muted-foreground/80">
                {currentTime}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Acciones Rápidas</CardTitle>
              <CardDescription>
                Accede directamente a las funciones más utilizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      className="h-auto p-6 flex-col gap-4 hover:shadow-md transition-all duration-200"
                      onClick={() => handleNavigation(action.link)}
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${action.color} ${action.iconColor} ${action.hoverColor}`}
                      >
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="font-semibold">{action.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Main Sections */}
          <div className="grid gap-6 md:grid-cols-2">
            {mainSections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5 text-primary" />
                      {section.title}
                    </CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {section.links.map((link, linkIndex) => (
                      <Button
                        key={linkIndex}
                        variant="ghost"
                        className="w-full justify-between h-auto p-3"
                        onClick={() => handleNavigation(link.url)}
                      >
                        <span className="text-left">{link.name}</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Analytics Section */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <PieChart className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">
                      Predicción de Ventas
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Analiza tendencias y proyecciones de ventas
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => handleNavigation("/dashboard/predicciones")}
                >
                  Ver Predicciones
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/60">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-black">
                    ¿Necesitas ayuda?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Consulta la documentación o contacta con soporte técnico
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Documentación</Button>
                  <Button>Contactar Soporte</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
