// hooks/useControlesSanitarios.ts
import useSWR from "swr";
import axios from "axios";
import {
  UbicacionOut,
  UsuarioOut,
  AnimalOutShort,
} from "./useMovimientosAnimal";

export interface ControlesSanitariosBase {
  animal_id: number;
  fecha_control?: string; // date in Pydantic becomes string (YYYY-MM-DD) in JSON. Optional because it has a default.
  peso_kg?: number | null; // Optional fields from Pydantic become `?` and `| null`
  condicion_corporal?: number | null;
  altura_cm?: number | null;
  responsable_id?: number | null;
  ubicacion_id?: number | null;
  observaciones?: string | null;
}

// --- Full Control Sanitario Interface (Matching ControlesSanitariosOut from FastAPI) ---
export interface ControlesSanitarios extends ControlesSanitariosBase {
  control_id: number;
  // Nested objects for related entities, reflecting ControlesSanitariosOut Pydantic model
  animal: AnimalOutShort; // Animal is not Optional in your Pydantic ControlesSanitariosOut
  responsable?: UsuarioOut | null; // Optional, as responsable_id is optional in base
  ubicacion?: UbicacionOut | null; // Optional, as ubicacion_id is optional in base
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useControlesSanitarios = () => {
  const { data, error, mutate, isLoading } = useSWR<ControlesSanitarios[]>(
    `${API_URL}/controles_sanitarios/`,
    fetcher
  );

  return {
    controles: data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
};

export const getControlSanitarioById = async (
  id: number
): Promise<ControlesSanitarios> => {
  const res = await axios.get(`${API_URL}/controles_sanitarios/${id}`);
  return res.data;
};

export const createControlSanitario = async (
  payload: ControlesSanitariosBase
): Promise<ControlesSanitarios> => {
  const res = await axios.post(`${API_URL}/controles_sanitarios/`, payload);
  return res.data;
};

export const updateControlSanitario = async (
  id: number,
  payload: Partial<ControlesSanitariosBase>
): Promise<ControlesSanitarios> => {
  const res = await axios.put(`${API_URL}/controles_sanitarios/${id}`, payload);
  return res.data;
};

export const deleteControlSanitario = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/controles_sanitarios/${id}`);
};
