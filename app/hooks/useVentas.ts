"use client";

import { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";

export interface Venta {
  id: number;
  ganado_id: number;
  fecha_venta: string;
  precio_venta: number;
  comprador: string;
  estado_trazabilidad?: string;
}

interface UseVentasResult {
  ventas: Venta[];
  venta: Venta | null;
  loading: boolean;
  getVentas: () => Promise<void>;
  getVentaById: (id: number) => Promise<void>;
  createVenta: (ventaData: Omit<Venta, "id">) => Promise<void>;
  deleteVenta: (id: number) => Promise<void>;
}

export const useVentas = (): UseVentasResult => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [venta, setVenta] = useState<Venta | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem("token");
    return token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : { "Content-Type": "application/json" };
  };

  const extractErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      return error.response.data.detail;
    }
    return "Ocurrió un error inesperado.";
  };

  const getVentas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/ventas`, {
        headers: getAuthHeaders(),
      });
      setVentas(response.data);
    } catch (error) {
      console.error("Error al obtener ventas:", extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const getVentaById = async (id: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/ventas/${id}`, {
        headers: getAuthHeaders(),
      });
      setVenta(response.data);
    } catch (error) {
      console.error("Error al obtener la venta:", extractErrorMessage(error));
      setVenta(null);
    } finally {
      setLoading(false);
    }
  };

  const createVenta = async (ventaData: Omit<Venta, "id">) => {
    try {
      await axios.post(`${API_BASE_URL}/ventas`, ventaData, {
        headers: getAuthHeaders(),
      });
      await getVentas();
    } catch (error) {
      console.error("Error al crear la venta:", extractErrorMessage(error));
      throw new Error(extractErrorMessage(error));
    }
  };

  const deleteVenta = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/ventas/${id}`, {
        headers: getAuthHeaders(),
      });
      setVentas((prevVentas) => prevVentas.filter((v) => v.id !== id));
    } catch (error) {
      console.error("Error al eliminar la venta:", extractErrorMessage(error));
      throw new Error(extractErrorMessage(error));
    }
  };

  useEffect(() => {
    getVentas();
  }, [getVentas]);

  return {
    ventas,
    venta,
    loading,
    getVentas,
    getVentaById,
    createVenta,
    deleteVenta,
  };
};
