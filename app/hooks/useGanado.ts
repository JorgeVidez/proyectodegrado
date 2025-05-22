// hooks/useGanado.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { format } from "date-fns";

interface Ganado {
  id: number;
  tipo: string;
  raza: string;
  edad: number;
  peso: number;
  estado_salud: string;
  fecha_ingreso: string; // Cambiado a string para manejar la fecha
  proveedor_id: number;
}

interface UseGanadoResult {
  ganadoList: Ganado[];
  loading: boolean;
  error: string | null;
  createGanado: (ganado: Omit<Ganado, "id">) => Promise<Ganado | null>;
  getGanado: () => Promise<Ganado[]>;
  getGanadoById: (id: number) => Promise<Ganado | null>;
  updateGanado: (id: number, ganado: Partial<Ganado>) => Promise<Ganado | null>;
  deleteGanado: (id: number) => Promise<void>;
}

export const useGanado = (): UseGanadoResult => {
  const [ganadoList, setGanadoList] = useState<Ganado[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const createGanado = async (
    ganado: Omit<Ganado, "id">
  ): Promise<Ganado | null> => {
    try {
      const response = await axios.post<Ganado>(`${API_BASE_URL}/ganado/`, {
        ...ganado,
        fecha_ingreso: format(new Date(ganado.fecha_ingreso), "yyyy-MM-dd"), // Formatear la fecha
      });
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Error al crear ganado: ${err.message} ${err.response?.data}`);
        console.error(
          "Error al crear ganado (Axios):",
          err.message,
          err.response?.data
        );
      } else {
        setError(`Error al crear ganado: ${err}`);
        console.error("Error al crear ganado:", err);
      }
      return null;
    }
  };

  const getGanado = useCallback(async (): Promise<Ganado[]> => {
    try {
      const response = await axios.get<Ganado[]>(`${API_BASE_URL}/ganado/`);
      setGanadoList(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          `Error al obtener ganado: ${err.message} ${err.response?.data}`
        );
        console.error(
          "Error al obtener ganado (Axios):",
          err.message,
          err.response?.data
        );
      } else {
        setError(`Error al obtener ganado: ${err}`);
        console.error("Error al obtener ganado:", err);
      }
      setGanadoList([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]); // Dependencias de getGanado

  const getGanadoById = async (id: number): Promise<Ganado | null> => {
    try {
      const response = await axios.get<Ganado>(`${API_BASE_URL}/ganado/${id}`);
      setError(null);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          `Error al obtener ganado por ID: ${err.message} ${err.response?.data}`
        );
        console.error(
          "Error al obtener ganado por ID (Axios):",
          err.message,
          err.response?.data
        );
      } else {
        setError(`Error al obtener ganado por ID: ${err}`);
        console.error("Error al obtener ganado por ID:", err);
      }
      return null;
    }
  };

  const updateGanado = async (
    id: number,
    ganado: Partial<Ganado>
  ): Promise<Ganado | null> => {
    try {
      const response = await axios.put<Ganado>(`${API_BASE_URL}/ganado/${id}`, {
        ...ganado,
        fecha_ingreso: ganado.fecha_ingreso
          ? format(new Date(ganado.fecha_ingreso), "yyyy-MM-dd")
          : undefined,
      });
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          `Error al actualizar ganado: ${err.message} ${err.response?.data}`
        );
        console.error(
          "Error al actualizar ganado (Axios):",
          err.message,
          err.response?.data
        );
      } else {
        setError(`Error al actualizar ganado: ${err}`);
        console.error("Error al actualizar ganado:", err);
      }
      return null;
    }
  };

  const deleteGanado = async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/ganado/${id}`);
      await getGanado(); // Actualizar la lista después de eliminar
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          `Error al eliminar ganado: ${err.message} ${err.response?.data}`
        );
        console.error(
          "Error al eliminar ganado (Axios):",
          err.message,
          err.response?.data
        );
      } else {
        setError(`Error al eliminar ganado: ${err}`);
        console.error("Error al eliminar ganado:", err);
      }
    }
  };

  useEffect(() => {
    getGanado();
  }, [getGanado]);

  return {
    ganadoList,
    loading,
    error,
    createGanado,
    getGanado,
    getGanadoById,
    updateGanado,
    deleteGanado,
  };
};
