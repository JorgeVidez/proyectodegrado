// hooks/useLotes.ts
// types/lote.ts

export interface LoteBase {
  codigo_lote: string;
  proposito?: string;
  descripcion?: string;
  activo?: boolean;
}

export interface LoteCreate extends LoteBase {}

export interface LoteUpdate {
  codigo_lote?: string;
  proposito?: string;
  descripcion?: string;
  activo?: boolean;
}

export interface LoteOut extends LoteBase {
  lote_id: number;
  fecha_creacion: string; // Fecha en formato string (ISO 8601)
}

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const URL_LOTES = API_URL + "/lotes";

export const useLotes = () => {
  const [lotes, setLotes] = useState<LoteOut[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLotes = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<LoteOut[]>(URL_LOTES);
        setLotes(response.data);
        setIsLoading(false);
        setError(null);
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError("Error desconocido al cargar los lotes.");
        }
        setIsLoading(false);
      }
    };

    fetchLotes();
  }, []);

  const create = async (loteData: LoteCreate): Promise<LoteOut | null> => {
    try {
      const response = await axios.post<LoteOut>(URL_LOTES, loteData);
      setLotes((prevLotes) => [...(prevLotes || []), response.data]);
      setError(null);
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.detail?.error || err.message);
      } else {
        setError("Error desconocido al crear el lote.");
      }
      return null;
    }
  };

  const update = async (
    id: number,
    loteData: LoteUpdate
  ): Promise<LoteOut | null> => {
    try {
      const response = await axios.put<LoteOut>(`${URL_LOTES}/${id}`, loteData);
      setLotes(
        (prevLotes) =>
          prevLotes?.map((lote) =>
            lote.lote_id === id ? response.data : lote
          ) || null
      );
      setError(null);
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.detail?.error || err.message);
      } else {
        setError("Error desconocido al actualizar el lote.");
      }
      return null;
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    try {
      await axios.delete(`${URL_LOTES}/${id}`);
      setLotes(
        (prevLotes) => prevLotes?.filter((lote) => lote.lote_id !== id) || null
      );
      setError(null);
      return true;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.detail?.error || err.message);
      } else {
        setError("Error desconocido al eliminar el lote.");
      }
      return false;
    }
  };

  return {
    lotes,
    isLoading,
    error,
    create,
    update,
    remove,
  };
};
