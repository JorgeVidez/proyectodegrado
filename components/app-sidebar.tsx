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

// Datos para el dashboard del inventario
const data = {
  user: {
    name: "Raúl Herrera",
    email: "raulherreracruz18@gmail.com",
    avatar: "/images/userdefault.webp",
  },
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
          url: "/ganado/agregar",
        },
        {
          title: "Historial",
          url: "/ganado/historial",
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
          url: "/controles/registro",
        },
        {
          title: "Reportes",
          url: "/controles/reportes",
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
          url: "/ventas/historial",
        },
        {
          title: "Nueva venta",
          url: "/ventas/nueva",
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
          url: "/usuarios/listado",
        },
        {
          title: "Agregar",
          url: "/usuarios/agregar",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Monitoreo de Salud",
      url: "/proyectos/salud",
      icon: Frame,
    },
    {
      name: "Optimización de Ventas",
      url: "/proyectos/ventas",
      icon: PieChart,
    },
    {
      name: "Gestión de Alimentación",
      url: "/proyectos/alimentacion",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
