// hooks/useMovimientosAnimal.ts
import useSWR from "swr";
import axios from "axios";

// --- Enums ---
export enum TipoMovimiento {
  IngresoCompra = "IngresoCompra",
  IngresoNacimiento = "IngresoNacimiento",
  EgresoVenta = "EgresoVenta",
  EgresoMuerte = "EgresoMuerte",
  EgresoDescarte = "EgresoDescarte",
  TrasladoInterno = "TrasladoInterno",
  CambioLote = "CambioLote",
}
 
export interface UbicacionOut {
  ubicacion_id: number;
  nombre: string;
}

export interface LoteOut {
  lote_id: number;
  fecha_creacion: string;  
  codigo_lote: string;
  proposito?: string | null;  
  descripcion?: string | null;
}

export interface ProveedorOut {
  proveedor_id: number;
  fecha_creacion: string;  
  nombre: string;
}

export interface ClienteOut {
  cliente_id: number;
  fecha_creacion: string;  
  nombre: string;
  identificacion_fiscal?: string | null;
  telefono?: string | null;
}

export interface UsuarioOut {
  usuario_id: number;
  fecha_creacion: string;  
  nombre: string;
  email: string;  
}

export interface AnimalOutShort {
  animal_id: number;
  numero_trazabilidad: string;
  nombre_identificatorio?: string | null;  
} 
export interface MovimientoAnimalBase {
  animal_id: number;
  tipo_movimiento: TipoMovimiento;
  origen_ubicacion_id?: number | null;
  destino_ubicacion_id?: number | null;
  origen_lote_id?: number | null;
  destino_lote_id?: number | null;
  proveedor_id?: number | null;
  cliente_id?: number | null;
  documento_referencia?: string | null;
  usuario_id?: number | null;
  observaciones?: string | null;
} 
export interface MovimientoAnimal extends MovimientoAnimalBase {
  movimiento_id: number;
  fecha_movimiento: string; 
  animal: AnimalOutShort;  
  origen_ubicacion?: UbicacionOut | null;
  destino_ubicacion?: UbicacionOut | null;
  origen_lote?: LoteOut | null;
  destino_lote?: LoteOut | null;
  proveedor?: ProveedorOut | null;
  cliente?: ClienteOut | null;
  usuario?: UsuarioOut | null; 
}

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useMovimientosAnimal = () => {
  const { data, error, mutate, isLoading } = useSWR<MovimientoAnimal[]>(
    `${API_URL}/movimiento_animal/`,
    fetcher
  );

  return {
    movimientos: data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
};

export const getMovimientoAnimalById = async (
  id: number
): Promise<MovimientoAnimal> => {
  const res = await axios.get(`${API_URL}/movimiento_animal/${id}`);
  return res.data;
};

export const createMovimientoAnimal = async (
  payload: MovimientoAnimalBase
): Promise<MovimientoAnimal> => {
  const res = await axios.post(`${API_URL}/movimiento_animal/`, payload);
  return res.data;
};

export const updateMovimientoAnimal = async (
  id: number,
  payload: Partial<MovimientoAnimalBase>
): Promise<MovimientoAnimal> => {
  const res = await axios.put(`${API_URL}/movimiento_animal/${id}`, payload);
  return res.data;
};

export const deleteMovimientoAnimal = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/movimiento_animal/${id}`);
};
