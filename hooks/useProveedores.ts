// hooks/useProveedores.ts

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import {
  ProveedorOut,
  ProveedorCreate,
  ProveedorUpdate,
} from "@/types/proveedor"; // Asegúrate de tener estas interfaces definidas

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const URL_PROVEEDORES = API_URL + "/proveedor";

export const useProveedores = () => {
  const [proveedores, setProveedores] = useState<ProveedorOut[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProveedores = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<ProveedorOut[]>(URL_PROVEEDORES);
        setProveedores(response.data);
        setIsLoading(false);
        setError(null);
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError("Error desconocido al cargar los proveedores.");
        }
        setIsLoading(false);
      }
    };

    fetchProveedores();
  }, []);

  const create = async (
    proveedorData: ProveedorCreate
  ): Promise<ProveedorOut | null> => {
    try {
      const response = await axios.post<ProveedorOut>(
        URL_PROVEEDORES + "/",
        proveedorData
      );
      setProveedores((prevProveedores) => [
        ...(prevProveedores || []),
        response.data,
      ]);
      setError(null);
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.detail?.error || err.message);
      } else {
        setError("Error desconocido al crear el proveedor.");
      }
      return null;
    }
  };

  const update = async (
    id: number,
    proveedorData: ProveedorUpdate
  ): Promise<ProveedorOut | null> => {
    try {
      const response = await axios.put<ProveedorOut>(
        `${URL_PROVEEDORES}/${id}`,
        proveedorData
      );
      setProveedores(
        (prevProveedores) =>
          prevProveedores?.map((proveedor) =>
            proveedor.proveedor_id === id ? response.data : proveedor
          ) || null
      );
      setError(null);
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.detail?.error || err.message);
      } else {
        setError("Error desconocido al actualizar el proveedor.");
      }
      return null;
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    try {
      await axios.delete(`${URL_PROVEEDORES}/${id}`);
      setProveedores(
        (prevProveedores) =>
          prevProveedores?.filter(
            (proveedor) => proveedor.proveedor_id !== id
          ) || null
      );
      setError(null);
      return true;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.detail?.error || err.message);
      } else {
        setError("Error desconocido al eliminar el proveedor.");
      }
      return false;
    }
  };

  return {
    proveedores,
    isLoading,
    error,
    create,
    update,
    remove,
  };
};
