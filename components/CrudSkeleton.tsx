import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CrudSkeletonProps {
  breadcrumbItems?: Array<{
    label: string;
    href?: string;
    isActive?: boolean;
  }>;
  title?: string;
  showCreateButton?: boolean;
  tableHeaders?: string[];
  tableRows?: number;
  showActions?: boolean;
}

export default function CrudSkeleton({
  breadcrumbItems = [
    { label: "Administración", href: "#" },
    { label: "Módulo", isActive: true },
  ],
  title = "Lista de Elementos",
  showCreateButton = true,
  tableHeaders = ["Columna 1", "Columna 2", "Columna 3", "Estado", "Acciones"],
  tableRows = 5,
  showActions = true,
}: CrudSkeletonProps) {
  return (
    <div>
      {/* Header con breadcrumb */}
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => (
                <div key={index} className="flex items-center">
                  <BreadcrumbItem className="hidden md:block">
                    {item.isActive ? (
                      <BreadcrumbPage>
                        <Skeleton className="h-4 w-16" />
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href || "#"}>
                        <Skeleton className="h-4 w-20" />
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbItems.length - 1 && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Header de la página */}
        <div>
          <header className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" /> {/* Título */}
            {showCreateButton && (
              <Skeleton className="h-10 w-40" /> /* Botón crear */
            )}
          </header>
          <Separator className="my-4" />

          {/* Tabla skeleton */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {tableHeaders.map((_, index) => (
                    <TableHead
                      key={index}
                      className={
                        index === tableHeaders.length - 1 && showActions
                          ? "text-right"
                          : ""
                      }
                    >
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: tableRows }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {tableHeaders.map((_, colIndex) => (
                      <TableCell
                        key={colIndex}
                        className={
                          colIndex === tableHeaders.length - 1 && showActions
                            ? "text-right"
                            : ""
                        }
                      >
                        {colIndex === tableHeaders.length - 1 && showActions ? (
                          // Columna de acciones
                          <div className="flex justify-end gap-2">
                            <Skeleton className="h-8 w-8" />{" "}
                            {/* Botón editar */}
                            <Skeleton className="h-8 w-8" />{" "}
                            {/* Botón eliminar */}
                          </div>
                        ) : colIndex === tableHeaders.length - 2 ? (
                          // Columna de estado (badge)
                          <Skeleton className="h-6 w-16 rounded-full" />
                        ) : (
                          // Columnas normales
                          <Skeleton className="h-4 w-24" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Variantes específicas para diferentes módulos
export const UsuariosSkeleton = () => (
  <CrudSkeleton
    breadcrumbItems={[
      { label: "Administración", href: "#" },
      { label: "Usuarios", isActive: true },
    ]}
    title="Lista de Usuarios"
    tableHeaders={["Nombre", "Email", "Rol", "Estado", "Acciones"]}
    tableRows={6}
  />
);

export const RolesSkeleton = () => (
  <CrudSkeleton
    breadcrumbItems={[
      { label: "Administración", href: "#" },
      { label: "Roles", isActive: true },
    ]}
    title="Lista de Roles"
    tableHeaders={["Nombre", "Descripción", "Permisos", "Estado", "Acciones"]}
    tableRows={4}
  />
);

export const ProductosSkeleton = () => (
  <CrudSkeleton
    breadcrumbItems={[
      { label: "Inventario", href: "#" },
      { label: "Productos", isActive: true },
    ]}
    title="Lista de Productos"
    tableHeaders={[
      "Código",
      "Nombre",
      "Categoría",
      "Precio",
      "Stock",
      "Estado",
      "Acciones",
    ]}
    tableRows={8}
  />
);
