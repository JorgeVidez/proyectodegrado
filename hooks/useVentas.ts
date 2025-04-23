// hooks/useVentas.ts
import useSWR from "swr";
import axios from "axios";

export interface VentaBase {
  cliente_id: number;
  fecha_venta: string; // ISO string: 'YYYY-MM-DD'
  documento_venta_ref?: string;
  precio_venta_total_general?: number;
  condicion_pago?: string;
  lote_origen_id?: number;
  usuario_registra_id?: number;
  observaciones?: string;
}

export interface Venta extends VentaBase {
  venta_id: number;
  fecha_registro: string; // ISO datetime
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useVentas = () => {
  const { data, error, mutate, isLoading } = useSWR<Venta[]>(
    `${API_URL}/ventas/`,
    fetcher
  );

  return {
    ventas: data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
};

export const getVentaById = async (id: number): Promise<Venta> => {
  const res = await axios.get(`${API_URL}/ventas/${id}`);
  return res.data;
};

export const createVenta = async (payload: VentaBase): Promise<Venta> => {
  const res = await axios.post(`${API_URL}/ventas/`, payload);
  return res.data;
};

export const updateVenta = async (
  id: number,
  payload: Partial<VentaBase>
): Promise<Venta> => {
  const res = await axios.put(`${API_URL}/ventas/${id}`, payload);
  return res.data;
};

export const deleteVenta = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/ventas/${id}`);
};
