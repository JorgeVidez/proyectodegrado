// hooks/useTratamientosSanitarios.ts
import useSWR from "swr";
import axios from "axios";
import {
  AnimalOutShort,
  UsuarioOut,
  ProveedorOut,
} from "./useMovimientosAnimal";

export interface MedicamentoOut {
  medicamento_id: number;
  nombre_comercial: string;
  principio_activo?: string | null;
}

export interface TratamientosSanitariosBase {
  animal_id: number;
  fecha_diagnostico: string; // date in Pydantic becomes string (YYYY-MM-DD)
  sintomas_observados?: string | null;
  diagnostico?: string | null;
  fecha_inicio_tratamiento?: string | null; // date types become string | null
  medicamento_id?: number | null;
  dosis_aplicada?: number | null;
  unidad_dosis?: string | null;
  via_administracion?: string | null;
  duracion_tratamiento_dias?: number | null;
  fecha_fin_tratamiento?: string | null; // date types become string | null
  proveedor_medicamento_id?: number | null;
  responsable_veterinario_id?: number | null;
  periodo_retiro_aplicable_dias?: number | null;
  fecha_fin_retiro?: string | null; // date types become string | null
  proxima_revision?: string | null; // date types become string | null
  resultado_tratamiento?: string | null;
  observaciones?: string | null;
}

export interface TratamientosSanitarios extends TratamientosSanitariosBase {
  tratamiento_id: number;
  animal: AnimalOutShort;
  medicamento?: MedicamentoOut | null;
  proveedor_medicamento?: ProveedorOut | null;
  responsable_veterinario?: UsuarioOut | null;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

// --- Hooks and API Functions ---
export const useTratamientosSanitarios = () => {
  const { data, error, mutate, isLoading } = useSWR<TratamientosSanitarios[]>(
    `${API_URL}/tratamientos_sanitarios/`,
    fetcher
  );

  return {
    tratamientos: data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
};

export const getTratamientoSanitarioById = async (
  id: number
): Promise<TratamientosSanitarios> => {
  const res = await axios.get(`${API_URL}/tratamientos_sanitarios/${id}`);
  return res.data;
};

export const createTratamientoSanitario = async (
  payload: TratamientosSanitariosBase
): Promise<TratamientosSanitarios> => {
  const res = await axios.post(`${API_URL}/tratamientos_sanitarios/`, payload);
  return res.data;
};

export const updateTratamientoSanitario = async (
  id: number,
  payload: Partial<TratamientosSanitariosBase>
): Promise<TratamientosSanitarios> => {
  const res = await axios.put(
    `${API_URL}/tratamientos_sanitarios/${id}`,
    payload
  );
  return res.data;
};

export const deleteTratamientoSanitario = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/tratamientos_sanitarios/${id}`);
};
