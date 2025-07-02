// hooks/useAlimentaciones.ts
import useSWR from "swr";
import axios from "axios";

// --------- Subtipos de relaciones ----------
export interface Animal {
  animal_id: number;
  numero_trazabilidad: string;
  nombre_identificatorio?: string;
}

export interface Lote {
  lote_id: number;
  fecha_creacion: string; // ISO format
  codigo_lote: string;
  proposito?: string;
  descripcion?: string;
  activo?: boolean;
}

export interface Ubicacion {
  ubicacion_id: number;
  nombre: string;
  tipo?: string;
  capacidad_maxima_animales?: number;
  descripcion?: string;
}

export interface TipoAlimento {
  tipo_alimento_id: number;
  nombre: string;
  descripcion?: string;
  unidad_medida?: string;
}

// --------- Interfaces base ----------
export interface AlimentacionBase {
  animal_id?: number;
  lote_id?: number;
  ubicacion_id?: number;
  fecha_suministro: string; // YYYY-MM-DD
  tipo_alimento_id: number;
  cantidad_suministrada: number;
  proveedor_alimento_id?: number;
  costo_total_alimento?: number;
  responsable_id?: number;
  observaciones?: string;
}

// --------- Respuesta enriquecida ----------
export interface Alimentacion extends AlimentacionBase {
  alimentacion_id: number;

  animal?: Animal;
  lote?: Lote;
  ubicacion?: Ubicacion;
  tipo_alimento: TipoAlimento;
}

// --------- API hooks ----------
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useAlimentaciones = () => {
  const { data, error, mutate, isLoading } = useSWR<Alimentacion[]>(
    `${API_URL}/alimentaciones/`,
    fetcher
  );

  return {
    alimentaciones: data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
};

export const getAlimentacionById = async (
  id: number
): Promise<Alimentacion> => {
  const res = await axios.get(`${API_URL}/alimentaciones/${id}`);
  return res.data;
};

export const createAlimentacion = async (
  payload: AlimentacionBase
): Promise<Alimentacion> => {
  const res = await axios.post(`${API_URL}/alimentaciones/`, payload);
  return res.data;
};

export const updateAlimentacion = async (
  id: number,
  payload: Partial<AlimentacionBase>
): Promise<Alimentacion> => {
  const res = await axios.put(`${API_URL}/alimentaciones/${id}`, payload);
  return res.data;
};

export const deleteAlimentacion = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/alimentaciones/${id}`);
};
