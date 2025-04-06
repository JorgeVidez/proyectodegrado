"use client";

import * as React from "react";
import {
  AudioWaveform,
  CalendarCheck,
  Command,
  DollarSign,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  SquareStack,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth(); // Obtiene el usuario autenticado

  // Si el usuario no está autenticado, usa valores por defecto
  const userData = user
    ? {
        name: user.nombre,
        email: user.email,
        avatar: "/images/userdefault.webp", // Puedes actualizar esto si el usuario tiene una imagen
      }
    : {
        name: "Invitado",
        email: "No autenticado",
        avatar: "/images/userdefault.webp",
      };
  // Datos para el dashboard del inventario
  const data = {
    user: userData,
    teams: [
      {
        name: "Estancia Nazario",
        logo: GalleryVerticalEnd,
        plan: "Inventario",
      },
      {
        name: "Ganadería Santa Cruz",
        logo: AudioWaveform,
        plan: "Básico",
      },
      {
        name: "Finca Los Andes",
        logo: Command,
        plan: "Estándar",
      },
    ],
    navMain: [
      {
        title: "Ganado",
        url: "/ganado",
        icon: SquareStack,
        isActive: true,
        items: [
          {
            title: "Listado",
            url: "/dashboard/ganado/listado",
          },
          {
            title: "Agregar",
            url: "/dashboard/ganado/agregar",
          },
          {
            title: "Proveedores",
            url: "/dashboard/ganado/proveedores",
          },
        ],
      },
      {
        title: "Controles",
        url: "/controles",
        icon: CalendarCheck,
        items: [
          {
            title: "Registro de controles",
            url: "/dashboard/controles/registro",
          },
          {
            title: "Reportes",
            url: "/dashboard/controles/reportes",
          },
        ],
      },
      {
        title: "Ventas",
        url: "/ventas",
        icon: DollarSign,
        items: [
          {
            title: "Historial de ventas",
            url: "/dashboard/ventas/historial",
          },
          {
            title: "Nueva venta",
            url: "/dashboard/ventas/nueva",
          },
        ],
      },
      {
        title: "Usuarios",
        url: "/usuarios",
        icon: Users,
        items: [
          {
            title: "Listado",
            url: "/dashboard/usuarios/listado",
          },
          {
            title: "Agregar",
            url: "/dashboard/usuarios/agregar",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Prediccion de Ventas",
        url: "/dashboard/predicciones",
        icon: PieChart,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
