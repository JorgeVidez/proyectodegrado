// hooks/useControlesSanitarios.ts
import useSWR from "swr";
import axios from "axios";

export interface ControlSanitarioBase {
  animal_id: number;
  fecha_control?: string; // ISO Date
  peso_kg?: number;
  condicion_corporal?: number;
  altura_cm?: number;
  responsable_id?: number;
  ubicacion_id?: number;
  observaciones?: string;
}

export interface ControlSanitario extends ControlSanitarioBase {
  control_id: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useControlesSanitarios = () => {
  const { data, error, mutate, isLoading } = useSWR<ControlSanitario[]>(
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
): Promise<ControlSanitario> => {
  const res = await axios.get(`${API_URL}/controles_sanitarios/${id}`);
  return res.data;
};

export const createControlSanitario = async (
  payload: ControlSanitarioBase
): Promise<ControlSanitario> => {
  const res = await axios.post(`${API_URL}/controles_sanitarios/`, payload);
  return res.data;
};

export const updateControlSanitario = async (
  id: number,
  payload: Partial<ControlSanitarioBase>
): Promise<ControlSanitario> => {
  const res = await axios.put(`${API_URL}/controles_sanitarios/${id}`, payload);
  return res.data;
};

export const deleteControlSanitario = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/controles_sanitarios/${id}`);
};
