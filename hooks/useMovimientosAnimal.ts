// hooks/useMovimientosAnimal.ts
import useSWR from "swr";
import axios from "axios";

export enum TipoMovimiento {
  IngresoCompra = "IngresoCompra",
  IngresoNacimiento = "IngresoNacimiento",
  EgresoVenta = "EgresoVenta",
  EgresoMuerte = "EgresoMuerte",
  EgresoDescarte = "EgresoDescarte",
  TrasladoInterno = "TrasladoInterno",
  CambioLote = "CambioLote",
}

export interface MovimientoAnimalBase {
  animal_id: number;
  tipo_movimiento: TipoMovimiento;
  origen_ubicacion_id?: number;
  destino_ubicacion_id?: number;
  origen_lote_id?: number;
  destino_lote_id?: number;
  proveedor_id?: number;
  cliente_id?: number;
  documento_referencia?: string;
  usuario_id?: number;
  observaciones?: string;
}

export interface MovimientoAnimal extends MovimientoAnimalBase {
  movimiento_id: number;
  fecha_movimiento: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

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
