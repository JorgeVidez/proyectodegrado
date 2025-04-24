// hooks/useVentas.ts
import useSWR, { mutate as swrMutate } from "swr";
import axios from "axios";

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

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useVentas = () => {
  const { data, error, mutate, isLoading } = useSWR<VentasOut[]>(
    `${API_URL}/ventas/`,
    fetcher
  );
  console.log("data", data);

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
  payload: VentasCreate
): Promise<VentasOut> => {
  const res = await axios.post<VentasOut>(`${API_URL}/ventas/`, payload);
  // Optimistically update the SWR cache
  swrMutate(
    `${API_URL}/ventas/`,
    (currentData: VentasOut[] | undefined) => {
      if (!currentData) return [res.data]; // Handle the case where there's no existing data
      return [...currentData, res.data];
    },
    { revalidate: false }
  ); // Prevent re-fetching, we've already updated
  return res.data;
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
