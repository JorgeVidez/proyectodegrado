// hooks/useProveedores.ts
"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Proveedor {
  id: number;
  nombre: string;
  telefono?: string;
  direccion?: string;
}

interface UseProveedoresResult {
  proveedores: Proveedor[];
  loading: boolean;
  error: string | null;
  createProveedor: (
    proveedor: Omit<Proveedor, "id">
  ) => Promise<Proveedor | null>;
  getProveedores: () => Promise<Proveedor[]>;
  getProveedorById: (id: number) => Promise<Proveedor | null>;
}

export const useProveedores = (): UseProveedoresResult => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const createProveedor = async (
    proveedor: Omit<Proveedor, "id">
  ): Promise<Proveedor | null> => {
    try {
      const response = await axios.post<Proveedor>(
        `${API_BASE_URL}/proveedores/`,
        proveedor
      );
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          `Error al crear proveedor: ${err.message} ${err.response?.data}`
        );
        console.error(
          "Error al crear proveedor (Axios):",
          err.message,
          err.response?.data
        );
      } else {
        setError(`Error al crear proveedor: ${err}`);
        console.error("Error al crear proveedor:", err);
      }
      return null;
    }
  };

  const getProveedores = async (): Promise<Proveedor[]> => {
    try {
      const response = await axios.get<Proveedor[]>(
        `${API_BASE_URL}/proveedores/`
      );
      setProveedores(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          `Error al obtener proveedores: ${err.message} ${err.response?.data}`
        );
        console.error(
          "Error al obtener proveedores (Axios):",
          err.message,
          err.response?.data
        );
      } else {
        setError(`Error al obtener proveedores: ${err}`);
        console.error("Error al obtener proveedores:", err);
      }
      setProveedores([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getProveedorById = async (id: number): Promise<Proveedor | null> => {
    try {
      const response = await axios.get<Proveedor>(
        `${API_BASE_URL}/proveedores/${id}`
      );
      setError(null);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          `Error al obtener proveedor por ID: ${err.message} ${err.response?.data}`
        );
        console.error(
          "Error al obtener proveedor por ID (Axios):",
          err.message,
          err.response?.data
        );
      } else {
        setError(`Error al obtener proveedor por ID: ${err}`);
        console.error("Error al obtener proveedor por ID:", err);
      }
      return null;
    }
  };

  useEffect(() => {
    getProveedores();
  }, []);

  return {
    proveedores,
    loading,
    error,
    createProveedor,
    getProveedores,
    getProveedorById,
  };
};
