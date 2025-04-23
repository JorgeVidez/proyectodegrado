// hooks/useTratamientosSanitarios.ts
import useSWR from "swr";
import axios from "axios";

export interface TratamientoSanitarioBase {
  animal_id: number;
  fecha_diagnostico: string;
  sintomas_observados?: string;
  diagnostico?: string;
  fecha_inicio_tratamiento?: string;
  medicamento_id?: number;
  dosis_aplicada?: number;
  unidad_dosis?: string;
  via_administracion?: string;
  duracion_tratamiento_dias?: number;
  fecha_fin_tratamiento?: string;
  proveedor_medicamento_id?: number;
  responsable_veterinario_id?: number;
  periodo_retiro_aplicable_dias?: number;
  fecha_fin_retiro?: string;
  proxima_revision?: string;
  resultado_tratamiento?: string;
  observaciones?: string;
}

export interface TratamientoSanitario extends TratamientoSanitarioBase {
  tratamiento_id: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useTratamientosSanitarios = () => {
  const { data, error, mutate, isLoading } = useSWR<TratamientoSanitario[]>(
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
): Promise<TratamientoSanitario> => {
  const res = await axios.get(`${API_URL}/tratamientos_sanitarios/${id}`);
  return res.data;
};

export const createTratamientoSanitario = async (
  payload: TratamientoSanitarioBase
): Promise<TratamientoSanitario> => {
  const res = await axios.post(`${API_URL}/tratamientos_sanitarios/`, payload);
  return res.data;
};

export const updateTratamientoSanitario = async (
  id: number,
  payload: Partial<TratamientoSanitarioBase>
): Promise<TratamientoSanitario> => {
  const res = await axios.put(
    `${API_URL}/tratamientos_sanitarios/${id}`,
    payload
  );
  return res.data;
};

export const deleteTratamientoSanitario = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/tratamientos_sanitarios/${id}`);
};
