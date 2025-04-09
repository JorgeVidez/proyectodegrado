// hooks/useUbicaciones.ts
// types/ubicacion.ts

export interface UbicacionBase {
  nombre: string;
  tipo?: string;
  area_hectareas?: number;
  capacidad_maxima_animales?: number;
  descripcion?: string;
}

export interface UbicacionCreate extends UbicacionBase {}

export interface UbicacionUpdate {
  nombre?: string;
  tipo?: string;
  area_hectareas?: number;
  capacidad_maxima_animales?: number;
  descripcion?: string;
}

export interface UbicacionOut extends UbicacionBase {
  ubicacion_id: number;
}

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
 // Asegúrate de tener estas interfaces definidas

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const URL_UBICACIONES = API_URL + "/ubicaciones";

export const useUbicaciones = () => {
  const [ubicaciones, setUbicaciones] = useState<UbicacionOut[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUbicaciones = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<UbicacionOut[]>(URL_UBICACIONES);
        setUbicaciones(response.data);
        setIsLoading(false);
        setError(null);
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError("Error desconocido al cargar las ubicaciones.");
        }
        setIsLoading(false);
      }
    };

    fetchUbicaciones();
  }, []);

  const create = async (
    ubicacionData: UbicacionCreate
  ): Promise<UbicacionOut | null> => {
    try {
      const response = await axios.post<UbicacionOut>(
        URL_UBICACIONES,
        ubicacionData
      );
      setUbicaciones((prevUbicaciones) => [
        ...(prevUbicaciones || []),
        response.data,
      ]);
      setError(null);
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.detail?.error || err.message);
      } else {
        setError("Error desconocido al crear la ubicación.");
      }
      return null;
    }
  };

  const update = async (
    id: number,
    ubicacionData: UbicacionUpdate
  ): Promise<UbicacionOut | null> => {
    try {
      const response = await axios.put<UbicacionOut>(
        `${URL_UBICACIONES}/${id}`,
        ubicacionData
      );
      setUbicaciones(
        (prevUbicaciones) =>
          prevUbicaciones?.map((ubicacion) =>
            ubicacion.ubicacion_id === id ? response.data : ubicacion
          ) || null
      );
      setError(null);
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.detail?.error || err.message);
      } else {
        setError("Error desconocido al actualizar la ubicación.");
      }
      return null;
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    try {
      await axios.delete(`${URL_UBICACIONES}/${id}`);
      setUbicaciones(
        (prevUbicaciones) =>
          prevUbicaciones?.filter(
            (ubicacion) => ubicacion.ubicacion_id !== id
          ) || null
      );
      setError(null);
      return true;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.detail?.error || err.message);
      } else {
        setError("Error desconocido al eliminar la ubicación.");
      }
      return false;
    }
  };

  return {
    ubicaciones,
    isLoading,
    error,
    create,
    update,
    remove,
  };
};
