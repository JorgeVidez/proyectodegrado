// hooks/useVacunaciones.ts
import useSWR from "swr";
import axios from "axios";

export interface Especie {
  nombre_comun: string;
  nombre_cientifico: string;
  especie_id: number;
}

export interface TipoVacuna {
  nombre_vacuna: string;
  enfermedad_prevenida: string;
  laboratorio: string;
  especie_destino_id: number;
  tipo_vacuna_id: number;
  especie_destino: Especie;
}

export interface Proveedor {
  nombre: string;
  identificacion_fiscal: string;
  telefono: string;
  email: string;
  direccion: string;
  persona_contacto: string;
  tipo_proveedor: string;
  proveedor_id: number;
  fecha_creacion: string;
  fecha_actualizacion: string | null;
}

export interface Rol {
  rol_id: number;
  nombre_rol: string;
  descripcion: string;
}

export interface Usuario {
  nombre: string;
  email: string;
  activo: boolean;
  usuario_id: number;
  fecha_creacion: string;
  fecha_actualizacion: string | null;
  rol: Rol;
}

export interface AnimalSimple {
  animal_id: number;
  numero_trazabilidad: string;
  nombre_identificatorio: string | null;
}

export interface VacunacionBase {
  animal_id: number;
  fecha_aplicacion: string; // ISO format (YYYY-MM-DD)
  tipo_vacuna_id: number;
  dosis_aplicada?: number;
  unidad_dosis?: string;
  lote_vacuna?: string;
  fecha_vencimiento_lote?: string;
  proveedor_vacuna_id?: number;
  responsable_aplicacion_id?: number;
  proxima_vacunacion_sugerida?: string;
  observaciones?: string;
}

export interface Vacunacion extends VacunacionBase {
  vacunacion_id: number;
  animal: AnimalSimple;
  tipo_vacuna: TipoVacuna;
  proveedor?: Proveedor;
  responsable?: Usuario;
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useVacunaciones = () => {
  const { data, error, mutate, isLoading } = useSWR<Vacunacion[]>(
    `${API_URL}/vacunaciones/`,
    fetcher
  );

  return {
    vacunaciones: data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
};

export const getVacunacionById = async (id: number): Promise<Vacunacion> => {
  const res = await axios.get(`${API_URL}/vacunaciones/${id}`);
  return res.data;
};

export const createVacunacion = async (
  payload: VacunacionBase
): Promise<Vacunacion> => {
  const res = await axios.post(`${API_URL}/vacunaciones/`, payload);
  return res.data;
};

export const updateVacunacion = async (
  id: number,
  payload: Partial<VacunacionBase>
): Promise<Vacunacion> => {
  console.log("Updating vacunacion with ID:", id);
  //log the payload like json
  console.log("Payload for update:", JSON.stringify(payload, null, 2));
  const res = await axios.put(`${API_URL}/vacunaciones/${id}`, payload);
  console.log("Response from update:", res.data);
  return res.data;
};

export const deleteVacunacion = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/vacunaciones/${id}`);
};
