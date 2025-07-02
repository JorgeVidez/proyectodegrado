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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  React.useEffect(() => {
    console.log("Usuario autenticado:", user?.rol.nombre_rol);
  }, [user]);

  // Si el usuario no está autenticado, usa valores por defecto
  const userData = user
    ? {
        name: user.nombre,
        email: user.email,
        avatar: "/images/userdefault.webp",
      }
    : {
        name: "Invitado",
        email: "No autenticado",
        avatar: "/images/userdefault.webp",
      };

  // Función para filtrar elementos según el rol
  const filterByRole = (items: any[], userRole: string | undefined) => {
    if (!userRole) return []; // Si no hay rol, no mostrar nada

    return items
      .filter((item) => {
        // Verificar si el item tiene permisos definidos
        if (!item.roles || item.roles.length === 0) {
          return true; // Si no tiene roles definidos, mostrar a todos
        }

        // Verificar si el rol del usuario está en los roles permitidos
        return item.roles.includes(userRole);
      })
      .map((item) => {
        // Si el item tiene subitems, también filtrarlos
        if (item.items && item.items.length > 0) {
          const filteredSubItems = item.items.filter(
            (subItem: { roles: string | string[] }) => {
              if (!subItem.roles || subItem.roles.length === 0) {
                return true;
              }
              return subItem.roles.includes(userRole);
            }
          );

          return {
            ...item,
            items: filteredSubItems,
          };
        }

        return item;
      });
  };

  // Datos para el dashboard del inventario con roles definidos
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
        icon: LayoutDashboard,
        isActive: false,
        roles: ["Administrador", "Operador", "Veterinario"], // Todos pueden ver
        items: [
          {
            title: "General",
            url: "/dashboard/resumen/general",
            roles: ["Administrador", "Operador", "Veterinario"],
          },
          {
            title: "Reportes",
            url: "/dashboard/resumen/reportes",
            roles: ["Administrador", "Operador"],
          },
        ],
      },
      {
        title: "Animales",
        url: "/animales",
        icon: Vegan,
        isActive: false,
        roles: ["Administrador", "Operador", "Veterinario"],
        items: [
          {
            title: "Registro",
            url: "/dashboard/animales/registro",
            roles: ["Administrador", "Operador"],
          },
          {
            title: "Inventario",
            url: "/dashboard/animales/inventario",
            roles: ["Administrador", "Operador", "Veterinario"],
          },
          {
            title: "Movimientos",
            url: "/dashboard/animales/movimientos",
            roles: ["Administrador", "Operador"],
          },
          {
            title: "Controles Sanitarios",
            url: "/dashboard/animales/controles",
            roles: ["Administrador", "Veterinario"],
          },
          {
            title: "Vacunaciones",
            url: "/dashboard/animales/vacunaciones",
            roles: ["Administrador", "Veterinario"],
          },
          {
            title: "Tratamientos",
            url: "/dashboard/animales/tratamientos",
            roles: ["Administrador", "Veterinario"],
          },
          {
            title: "Alimentación",
            url: "/dashboard/animales/alimentacion",
            roles: ["Administrador", "Operador", "Veterinario"],
          },
        ],
      },
      {
        title: "Lotes y Ubicaciones",
        url: "/lotes-ubicaciones",
        icon: MapPinHouse,
        isActive: false,
        roles: ["Administrador", "Operador"],
        items: [
          {
            title: "Lotes",
            url: "/dashboard/lotes-ubicaciones/lotes",
            roles: ["Administrador", "Operador"],
          },
          {
            title: "Ubicaciones",
            url: "/dashboard/lotes-ubicaciones/ubicaciones",
            roles: ["Administrador", "Operador"],
          },
          {
            title: "Asignación",
            url: "/dashboard/lotes-ubicaciones/asignacion",
            roles: ["Administrador", "Operador"],
          },
        ],
      },
      {
        title: "Ventas",
        url: "/ventas",
        icon: Badge,
        isActive: false,
        roles: ["Administrador", "Operador"],
        items: [
          {
            title: "Registro",
            url: "/dashboard/ventas/registro",
            roles: ["Administrador", "Operador"],
          },
          {
            title: "Clientes",
            url: "/dashboard/ventas/clientes",
            roles: ["Administrador", "Operador"],
          },
        ],
      },
      {
        title: "Proviciones",
        url: "/proviciones",
        icon: Handshake,
        isActive: false,
        roles: ["Administrador", "Operador", "Veterinario"],
        items: [
          {
            title: "Alimentos",
            url: "/dashboard/proviciones/alimentos",
            roles: ["Administrador", "Operador"],
          },
          {
            title: "Vacunas",
            url: "/dashboard/proviciones/vacunas",
            roles: ["Administrador", "Veterinario"],
          },
          {
            title: "Medicamentos",
            url: "/dashboard/proviciones/medicamentos",
            roles: ["Administrador", "Veterinario"],
          },
        ],
      },
      {
        title: "Administración",
        url: "/administracion",
        icon: UserRoundCog,
        isActive: false,
        roles: ["Administrador"], // Solo administradores
        items: [
          {
            title: "Usuarios",
            url: "/dashboard/administracion/usuarios",
            roles: ["Administrador"],
          },
          {
            title: "Roles",
            url: "/dashboard/administracion/roles",
            roles: ["Administrador"],
          },
          {
            title: "Especies",
            url: "/dashboard/administracion/especies",
            roles: ["Administrador"],
          },
          {
            title: "Razas",
            url: "/dashboard/administracion/razas",
            roles: ["Administrador"],
          },
          {
            title: "Proveedores",
            url: "/dashboard/administracion/proveedores",
            roles: ["Administrador"],
          },
        ],
      },
    ],
    projects: [
      {
        name: "Prediccion de Ventas",
        url: "/dashboard/predicciones",
        icon: PieChart,
        roles: ["Administrador"], // Solo administradores pueden ver predicciones
      },
    ],
  };

  // Obtener el rol del usuario actual
  const userRole = user?.rol?.nombre_rol;

  // Filtrar los elementos de navegación según el rol
  const filteredNavMain = filterByRole(data.navMain, userRole);
  const filteredProjects = filterByRole(data.projects, userRole);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        <NavProjects projects={filteredProjects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
