"use client";

import * as React from "react";
import {
  AudioWaveform,
  CalendarCheck,
  Command,
  DollarSign,
  GalleryVerticalEnd,
  PieChart,
  SquareStack,
  Users,
  Vegan,
  MapPinHouse,
  Wheat,
  Badge,
  Handshake,
  UserRoundCog,
  LayoutDashboard,
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
import { title } from "process";
import { Item } from "@radix-ui/react-dropdown-menu";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { user, hasPermission } = useAuth(); // Obtiene el usuario y hasPermission del AuthContext


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
        title: "Resumen",
        url: "/resumen",
        icon: LayoutDashboard, // Reemplaza con tu icono
        isActive: false,
        items: [
          { title: "General", url: "/dashboard/resumen/general" },
          { title: "Reportes", url: "/dashboard/resumen/reportes" },
        ],
      },
      {
        title: "Animales",
        url: "/animales",
        icon: Vegan, // Reemplaza con tu icono
        isActive: false,
        items: [
          { title: "Registro", url: "/dashboard/animales/registro" },
          { title: "Inventario", url: "/dashboard/animales/inventario" },
          { title: "Movimientos", url: "/dashboard/animales/movimientos" },
          {
            title: "Controles Sanitarios",
            url: "/dashboard/animales/controles",
          },
          { title: "Vacunaciones", url: "/dashboard/animales/vacunaciones" },
          { title: "Tratamientos", url: "/dashboard/animales/tratamientos" },
          { title: "Alimentación", url: "/dashboard/animales/alimentacion" },
        ],
      },
      {
        title: "Lotes y Ubicaciones",
        url: "/lotes-ubicaciones",
        icon: MapPinHouse, // Reemplaza con tu icono
        isActive: false,
        items: [
          { title: "Lotes", url: "/dashboard/lotes-ubicaciones/lotes" },
          {
            title: "Ubicaciones",
            url: "/dashboard/lotes-ubicaciones/ubicaciones",
          },
          {
            title: "Asignación",
            url: "/dashboard/lotes-ubicaciones/asignacion",
          },
        ],
      },
      {
        title: "Ventas",
        url: "/ventas",
        icon: Badge, // Reemplaza con tu icono
        isActive: false,
        items: [
          { title: "Registro", url: "/dashboard/ventas/registro" },
          { title: "Clientes", url: "/dashboard/ventas/clientes" },
        ],
      },
      {
        title: "Proviciones",
        url: "/proviciones",
        icon: Handshake, // Reemplaza con tu icono
        isActive: false,
        items: [
          { title: "Alimentos", url: "/dashboard/proviciones/alimentos" },
          { title: "Vacunas", url: "/dashboard/proviciones/vacunas" },
          { title: "Medicamentos", url: "/dashboard/proviciones/medicamentos" },
        ],
      },
      {
        title: "Administración",
        url: "/administracion",
        icon: UserRoundCog, // Reemplaza con tu icono
        isActive: false,
        items: [
          { title: "Usuarios", url: "/dashboard/administracion/usuarios" },
          { title: "Roles", url: "/dashboard/administracion/roles" },
          { title: "Especies", url: "/dashboard/administracion/especies" },
          { title: "Razas", url: "/dashboard/administracion/razas" },
          {
            title: "Proveedores",
            url: "/dashboard/administracion/proveedores",
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
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
