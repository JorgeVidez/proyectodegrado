// hooks/useClientes.ts

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { ClienteOut, ClienteCreate, ClienteUpdate } from "@/types/cliente"; // Asegúrate de tener estas interfaces definidas

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const URL_CLIENTES = API_URL + "/cliente";

export const useClientes = () => {
  const [clientes, setClientes] = useState<ClienteOut[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientes = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<ClienteOut[]>(URL_CLIENTES);
        setClientes(response.data);
        setIsLoading(false);
        setError(null);
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError("Error desconocido al cargar los clientes.");
        }
        setIsLoading(false);
      }
    };

    fetchClientes();
  }, []);

  const create = async (
    clienteData: ClienteCreate
  ): Promise<ClienteOut | null> => {
    try {
      const response = await axios.post<ClienteOut>(
        URL_CLIENTES + "/",
        clienteData
      );
      setClientes((prevClientes) => [...(prevClientes || []), response.data]);
      setError(null);
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.detail?.error || err.message);
      } else {
        setError("Error desconocido al crear el cliente.");
      }
      return null;
    }
  };

  const update = async (
    id: number,
    clienteData: ClienteUpdate
  ): Promise<ClienteOut | null> => {
    try {
      const response = await axios.put<ClienteOut>(
        `${URL_CLIENTES}/${id}`,
        clienteData
      );
      setClientes(
        (prevClientes) =>
          prevClientes?.map((cliente) =>
            cliente.cliente_id === id ? response.data : cliente
          ) || null
      );
      setError(null);
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.detail?.error || err.message);
      } else {
        setError("Error desconocido al actualizar el cliente.");
      }
      return null;
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    try {
      await axios.delete(`${URL_CLIENTES}/${id}`);
      setClientes(
        (prevClientes) =>
          prevClientes?.filter((cliente) => cliente.cliente_id !== id) || null
      );
      setError(null);
      return true;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.detail?.error || err.message);
      } else {
        setError("Error desconocido al eliminar el cliente.");
      }
      return false;
    }
  };

  return {
    clientes,
    isLoading,
    error,
    create,
    update,
    remove,
  };
};
