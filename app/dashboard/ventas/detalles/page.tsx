"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getVentaById, VentasOut } from "@/hooks/useVentas"; // Adjust the path if needed
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

const VentaDetailsPage = () => {
  const { id } = useParams<{ id: string }>(); // Get the venta ID from the route
  const [venta, setVenta] = useState<VentasOut | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchVentaDetails = async () => {
      if (!id) {
        setIsError(true);
        setIsLoading(false);
        return;
      }
      try {
        const ventaData = await getVentaById(parseInt(id, 10)); // Convert id to number
        setVenta(ventaData);
        setIsLoading(false);
      } catch (error) {
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchVentaDetails();
  }, [id]);

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar detalles de venta</div>;
  if (!venta) return <div>Venta no encontrada</div>; // Handle the case where venta is null

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Ventas</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Detalles de Venta</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">
          Detalles de la Venta #{venta.venta_id}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Información General</h2>
            <p>
              <strong>Cliente ID:</strong> {venta.cliente_id}
            </p>
            <p>
              <strong>Fecha de Venta:</strong> {venta.fecha_venta}
            </p>
            <p>
              <strong>Documento de Venta:</strong>{" "}
              {venta.documento_venta_ref || "N/A"}
            </p>
            <p>
              <strong>Precio Total:</strong>{" "}
              {venta.precio_venta_total_general || "N/A"}
            </p>
            <p>
              <strong>Condición de Pago:</strong>{" "}
              {venta.condicion_pago || "N/A"}
            </p>
            <p>
              <strong>Lote de Origen ID:</strong>{" "}
              {venta.lote_origen_id || "N/A"}
            </p>
            <p>
              <strong>Usuario Registra ID:</strong>{" "}
              {venta.usuario_registra_id || "N/A"}
            </p>
            <p>
              <strong>Observaciones:</strong> {venta.observaciones || "N/A"}
            </p>
            <p>
              <strong>Fecha de Registro:</strong> {venta.fecha_registro}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Detalles del Cliente</h2>
            {venta.cliente ? (
              <>
                <p>
                  <strong>Nombre:</strong> {venta.cliente.nombre}
                </p>
                <p>
                  <strong>Identificación Fiscal:</strong>{" "}
                  {venta.cliente.identificacion_fiscal}
                </p>
                <p>
                  <strong>Teléfono:</strong> {venta.cliente.telefono}
                </p>
                <p>
                  <strong>Email:</strong> {venta.cliente.email}
                </p>
                <p>
                  <strong>Dirección:</strong> {venta.cliente.direccion}
                </p>
              </>
            ) : (
              <p>No se proporcionó información del cliente.</p>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">
              Detalles del Lote de Origen
            </h2>
            {venta.lote_origen ? (
              <>
                <p>
                  <strong>Código de Lote:</strong>{" "}
                  {venta.lote_origen.codigo_lote}
                </p>
                <p>
                  <strong>Propósito:</strong> {venta.lote_origen.proposito}
                </p>
                <p>
                  <strong>Descripción:</strong> {venta.lote_origen.descripcion}
                </p>
                <p>
                  <strong>Activo:</strong>{" "}
                  {venta.lote_origen.activo ? "Sí" : "No"}
                </p>
                <p>
                  <strong>Fecha de Creación:</strong>{" "}
                  {venta.lote_origen.fecha_creacion}
                </p>
              </>
            ) : (
              <p>No se proporcionó información del lote de origen.</p>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">
              Detalles del Usuario que Registró
            </h2>
            {venta.usuario_registra ? (
              <>
                <p>
                  <strong>Nombre:</strong> {venta.usuario_registra.nombre}
                </p>
                <p>
                  <strong>Email:</strong> {venta.usuario_registra.email}
                </p>
                <p>
                  <strong>Activo:</strong>{" "}
                  {venta.usuario_registra.activo ? "Sí" : "No"}
                </p>
                <p>
                  <strong>Rol:</strong>{" "}
                  {venta.usuario_registra.rol?.nombre_rol || "N/A"}
                </p>
              </>
            ) : (
              <p>No se proporcionó información del usuario.</p>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Detalles de Animales Vendidos
          </h2>
          {venta.detalles && venta.detalles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Animal ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Número de Trazabilidad
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Nombre
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Peso (kg)
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Precio Individual
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Precio por kg
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Observaciones
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Especie
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Raza
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Sexo
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Fecha Nacimiento
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {venta.detalles.map(
                    (detalle: {
                      venta_detalle_id: React.Key | null | undefined;
                      animal_id:
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | React.ReactPortal
                            | React.ReactElement<
                                unknown,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                      animal: {
                        numero_trazabilidad:
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactElement<
                              unknown,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | React.ReactPortal
                              | React.ReactElement<
                                  unknown,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                        nombre_identificatorio:
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactElement<
                              unknown,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | React.ReactPortal
                              | React.ReactElement<
                                  unknown,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                        especie: {
                          nombre_comun:
                            | string
                            | number
                            | bigint
                            | boolean
                            | React.ReactElement<
                                unknown,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | Promise<
                                | string
                                | number
                                | bigint
                                | boolean
                                | React.ReactPortal
                                | React.ReactElement<
                                    unknown,
                                    string | React.JSXElementConstructor<any>
                                  >
                                | Iterable<React.ReactNode>
                                | null
                                | undefined
                              >
                            | null
                            | undefined;
                        };
                        raza: {
                          nombre_raza:
                            | string
                            | number
                            | bigint
                            | boolean
                            | React.ReactElement<
                                unknown,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | Promise<
                                | string
                                | number
                                | bigint
                                | boolean
                                | React.ReactPortal
                                | React.ReactElement<
                                    unknown,
                                    string | React.JSXElementConstructor<any>
                                  >
                                | Iterable<React.ReactNode>
                                | null
                                | undefined
                              >
                            | null
                            | undefined;
                        };
                        sexo:
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactElement<
                              unknown,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | React.ReactPortal
                              | React.ReactElement<
                                  unknown,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                        fecha_nacimiento:
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactElement<
                              unknown,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | React.ReactPortal
                              | React.ReactElement<
                                  unknown,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                      };
                      peso_venta_kg:
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | React.ReactPortal
                            | React.ReactElement<
                                unknown,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                      precio_individual:
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | React.ReactPortal
                            | React.ReactElement<
                                unknown,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                      precio_por_kg:
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | React.ReactPortal
                            | React.ReactElement<
                                unknown,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                      observaciones:
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | React.ReactPortal
                            | React.ReactElement<
                                unknown,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                    }) => (
                      <tr key={detalle.venta_detalle_id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {detalle.animal_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {detalle.animal.numero_trazabilidad}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {detalle.animal.nombre_identificatorio}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {detalle.peso_venta_kg}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {detalle.precio_individual}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {detalle.precio_por_kg}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {detalle.observaciones}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {detalle.animal.especie.nombre_comun}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {detalle.animal.raza.nombre_raza}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {detalle.animal.sexo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {detalle.animal.fecha_nacimiento}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No hay animales vendidos en esta venta.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VentaDetailsPage;
