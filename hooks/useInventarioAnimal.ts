"use client";

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import {
  InventarioAnimalOut,
  InventarioAnimalCreate,
  InventarioAnimalUpdate,
} from "@/types/inventarioAnimal";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_URL_INVENTARIO = API_URL + "/inventario_animal";

export const useInventarioAnimal = () => {
  const [inventarios, setInventarios] = useState<InventarioAnimalOut[]>([]);
  const [inventario, setInventario] = useState<InventarioAnimalOut | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInventarios = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response =
        await axios.get<InventarioAnimalOut[]>(API_URL_INVENTARIO);
      setInventarios(response.data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail?.error || err.message);
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInventario = async (inventarioId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<InventarioAnimalOut>(
        `${API_URL_INVENTARIO}/${inventarioId}`
      );
      setInventario(response.data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail?.error || err.message);
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createInventario = async (inventarioData: InventarioAnimalCreate) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post<InventarioAnimalOut>(
        API_URL_INVENTARIO,
        inventarioData
      );
      setInventarios((prevInventarios) => [...prevInventarios, response.data]);
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail?.error || err.message);
      } else {
        setError(err.message);
      }
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  const updateInventario = async (
    inventarioId: number,
    inventarioData: InventarioAnimalUpdate
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.put<InventarioAnimalOut>(
        `${API_URL_INVENTARIO}/${inventarioId}`,
        inventarioData
      );
      setInventarios((prevInventarios) =>
        prevInventarios.map((inv) =>
          inv.inventario_id === inventarioId ? response.data : inv
        )
      );
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail?.error || err.message);
      } else {
        setError(err.message);
      }
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInventario = async (inventarioId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.delete<InventarioAnimalOut>(
        `${API_URL_INVENTARIO}/${inventarioId}`
      );
      setInventarios((prevInventarios) =>
        prevInventarios.filter((inv) => inv.inventario_id !== inventarioId)
      );
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail?.error || err.message);
      } else {
        setError(err.message);
      }
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventarios();
  }, []);

  return {
    inventarios,
    inventario,
    isLoading,
    error,
    fetchInventario,
    createInventario,
    updateInventario,
    deleteInventario,
  };
};
