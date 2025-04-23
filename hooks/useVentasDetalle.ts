// hooks/useVentasDetalle.ts
import useSWR from "swr";
import axios from "axios";

export interface VentaDetalleBase {
  venta_id: number;
  animal_id: number;
  peso_venta_kg?: number;
  precio_individual?: number;
  precio_por_kg?: number;
  observaciones?: string;
}

export interface VentaDetalle extends VentaDetalleBase {
  venta_detalle_id: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useVentasDetalle = () => {
  const { data, error, mutate, isLoading } = useSWR<VentaDetalle[]>(
    `${API_URL}/ventas_detalles/`,
    fetcher
  );

  return {
    ventasDetalle: data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
};

export const getVentaDetalleById = async (
  id: number
): Promise<VentaDetalle> => {
  const res = await axios.get(`${API_URL}/ventas_detalles/${id}`);
  return res.data;
};

export const createVentaDetalle = async (
  payload: VentaDetalleBase
): Promise<VentaDetalle> => {
  const res = await axios.post(`${API_URL}/ventas_detalles/`, payload);
  return res.data;
};

export const updateVentaDetalle = async (
  id: number,
  payload: Partial<VentaDetalleBase>
): Promise<VentaDetalle> => {
  const res = await axios.put(`${API_URL}/ventas_detalles/${id}`, payload);
  return res.data;
};

export const deleteVentaDetalle = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/ventas_detalles/${id}`);
};
