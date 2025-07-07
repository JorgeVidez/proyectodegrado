// hooks/useVentas.ts
import useSWR, { mutate as swrMutate } from "swr";
import axios from "axios";
import {
  InventarioAnimalOut,
  InventarioAnimalUpdate,
  MotivoEgreso,
} from "@/types/inventarioAnimal";
import { useInventarioAnimal } from "@/hooks/useInventarioAnimal";

import { MotivoIngreso } from "../types/inventarioAnimal";
import { act } from "react";

// Pydantic Schemas (converted to TypeScript interfaces)
export interface VentasBase {
  cliente_id: number;
  fecha_venta: string; // date (YYYY-MM-DD)
  documento_venta_ref?: string | null;
  precio_venta_total_general?: number | null;
  condicion_pago?: string | null;
  lote_origen_id?: number | null;
  usuario_registra_id?: number | null;
  observaciones?: string | null;
}

export interface VentasCreate extends VentasBase {}

export interface VentasUpdate extends VentasBase {}

// Interfaces para los objetos anidados
export interface Especie {
  especie_id: number;
  nombre_comun: string;
}

export interface Raza {
  raza_id: number;
  nombre_raza: string;
}

export interface Animal {
  animal_id: number;
  numero_trazabilidad: string;
  nombre_identificatorio: string;
  especie: Especie;
  raza: Raza;
  sexo: string;
  fecha_nacimiento: string;
  madre: any | null; // Puedes refinar esto si tienes la interfaz para Madre
  padre: any | null; // Puedes refinar esto si tienes la interfaz para Padre
  estado_actual: string;
  fecha_registro: string;
  observaciones_generales: string;
}

export interface VentasDetalleOut {
  venta_id: number;
  animal_id: number;
  peso_venta_kg: number;
  precio_individual: number;
  precio_por_kg: number;
  observaciones: string;
  venta_detalle_id: number;
  animal: Animal;
}

export interface ClienteOut {
  nombre: string;
  identificacion_fiscal: string;
  telefono: string;
  email: string;
  direccion: string;
  cliente_id: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface LoteOut {
  codigo_lote: string;
  proposito: string;
  descripcion: string;
  activo: boolean;
  lote_id: number;
  fecha_creacion: string;
}

export interface Rol {
  rol_id: number;
  nombre_rol: string;
  descripcion: string;
}

export interface UsuarioOut {
  nombre: string;
  email: string;
  activo: boolean;
  usuario_id: number;
  fecha_creacion: string;
  fecha_actualizacion: string | null;
  rol: Rol;
}
export interface VentasOut extends VentasBase {
  venta_id: number;
  fecha_registro: string;
  detalles?: VentasDetalleOut[];
  cliente?: ClienteOut | null;
  lote_origen?: LoteOut | null;
  usuario_registra?: UsuarioOut | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useVentas = () => {
  const { data, error, mutate, isLoading } = useSWR<VentasOut[]>(
    `${API_URL}/ventas/`,
    fetcher
  );

  return {
    ventas: data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
};

export const getVentaById = async (id: number): Promise<VentasOut> => {
  const res = await axios.get<VentasOut>(`${API_URL}/ventas/${id}`);
  return res.data;
};

export const createVenta = async (
  payload: VentasCreate,
  // Añade estos argumentos:
  inventarioActions: {
    fetchInventarioByLote: (loteId: number) => Promise<any[]>;
    updateInventario: (
      inventarioId: number,
      inventarioData: any // InventarioAnimalUpdate
    ) => Promise<any>; // InventarioAnimalOut | undefined
  }
): Promise<VentasOut> => {
  if (!payload || (payload.lote_origen_id && payload.lote_origen_id <= 0)) {
    throw new Error("Datos de venta inválidos");
  }

  try {
    console.log("Creando venta con payload:", payload);
    const res = await axios.post<VentasOut>(`${API_URL}/ventas/`, payload);

    // Validar respuesta
    if (!res.data || !res.data.venta_id) {
      throw new Error("Respuesta inválida del servidor");
    }

    // Si la venta tiene un lote_origen_id, actualizar los animales
    if (payload.lote_origen_id) {
      try {
        // Usa las funciones pasadas como argumento
        const inventarios = await inventarioActions.fetchInventarioByLote(
          payload.lote_origen_id
        );

        const inventariosActivos = inventarios.filter(
          (inv) => inv.activo_en_finca
        );

        if (inventariosActivos.length === 0) {
          console.warn(
            `No hay animales activos en el lote ${payload.lote_origen_id}`
          );
        } else {
          await Promise.all(
            inventariosActivos.map((inventario) => {
              const updateData = {
                animal_id: inventario.animal_id,
                fecha_ingreso: inventario.fecha_ingreso,
                motivo_ingreso: inventario.motivo_ingreso,
                proveedor_compra_id: inventario.proveedor_compra_id,
                precio_compra: inventario.precio_compra,
                ubicacion_actual_id: inventario.ubicacion_actual_id, // Mantiene la ubicación actual
                lote_actual_id: inventario.lote_actual_id, // Mantiene el lote actual
                fecha_egreso: new Date().toISOString().split("T")[0],
                motivo_egreso: "Venta", // Asume MotivoEgreso es un string o literal
                activo_en_finca: false, // Actualiza a false si es vendido
              };
              console.log("Actualizando inventario:", updateData);
              return inventarioActions.updateInventario(
                inventario.inventario_id,
                updateData
              );
            })
          );
          console.log(`${inventariosActivos.length} animales actualizados`);
        }
      } catch (updateError) {
        console.error("Error al actualizar animales:", updateError);
        throw new Error(
          "Venta creada pero falló la actualización de los animales"
        );
      }
    }

    // Optimistic update del cache SWR (si usas SWR para ventas)
    // swrMutate(`${API_URL}/ventas/`, (currentData: VentasOut[] | undefined) => {
    //   if (!currentData) return [res.data];
    //   return [...currentData, res.data];
    // }, { revalidate: false });

    return res.data;
  } catch (error) {
    console.error("Error al crear venta:", error);
    throw error;
  }
};

export const updateVenta = async (
  id: number,
  payload: VentasUpdate
): Promise<VentasOut> => {
  const res = await axios.put<VentasOut>(`${API_URL}/ventas/${id}`, payload);

  // Optimistically update the SWR cache
  swrMutate(
    `${API_URL}/ventas/`,
    (currentData: VentasOut[] | undefined) => {
      if (!currentData) return; //if no current data do nothing.
      const updatedData = currentData.map((venta) =>
        venta.venta_id === id ? { ...venta, ...res.data } : venta
      );
      return updatedData;
    },
    { revalidate: false }
  );
  return res.data;
};

export const deleteVenta = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/ventas/${id}`);
  // Optimistically update the SWR cache
  swrMutate(
    `${API_URL}/ventas/`,
    (currentData: VentasOut[] | undefined) => {
      if (!currentData) return;
      const updatedData = currentData.filter((venta) => venta.venta_id !== id);
      return updatedData;
    },
    { revalidate: false }
  );
};

// Versión mejorada con hook modificado
export const updateAnimalesToVendidos = async (
  loteId: number,
  ventaId: number
): Promise<void> => {
  const { fetchInventarioByLote, updateInventario } = useInventarioAnimal();

  try {
    const inventarios = await fetchInventarioByLote(loteId);

    const inventariosActivos = inventarios.filter(
      (inv) => inv.activo_en_finca && inv.motivo_egreso === null
    );

    if (inventariosActivos.length === 0) {
      console.warn(`No hay animales activos en el lote ${loteId}`);
      return;
    }

    await Promise.all(
      inventariosActivos.map((inventario) => {
        const updateData: InventarioAnimalUpdate = {
          animal_id: inventario.animal_id,
          fecha_ingreso: inventario.fecha_ingreso,
          motivo_ingreso: inventario.motivo_ingreso,
          proveedor_compra_id: inventario.proveedor_compra_id,
          precio_compra: inventario.precio_compra,
          ubicacion_actual_id: null,
          lote_actual_id: null,
          fecha_egreso: new Date().toISOString().split("T")[0],
          motivo_egreso: MotivoEgreso.Venta,
        };
        return updateInventario(inventario.inventario_id, updateData);
      })
    );

    console.log(`${inventariosActivos.length} animales actualizados`);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};