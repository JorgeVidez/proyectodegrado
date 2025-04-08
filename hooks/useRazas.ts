// hooks/useRazas.ts
import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

interface Raza {
  raza_id: number;
  especie_id: number;
  nombre_raza: string;
  especie: {
    especie_id: number;
    nombre_comun: string;
    nombre_cientifico: string;
  };
}

interface RazaCreate {
  especie_id: number;
  nombre_raza: string;
}

interface RazaUpdate {
  especie_id?: number;
  nombre_raza?: string;
}

interface UseRazasResult {
  razas: Raza[] | undefined;
  isLoading: boolean;
  error: AxiosError | null;
  create: (data: RazaCreate) => Promise<Raza | null>;
  update: (raza_id: number, data: RazaUpdate) => Promise<Raza | null>;
  remove: (raza_id: number) => Promise<boolean>;
}

const API_URL = 'http://localhost:8000/api/razas'; // Reemplaza con la URL de tu API

export const useRazas = (): UseRazasResult => {
  const [razas, setRazas] = useState<Raza[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    const fetchRazas = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<Raza[]>(API_URL);
        setRazas(response.data);
        setError(null);
      } catch (err) {
        setError(err as AxiosError);
        setRazas(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRazas();
  }, []);

  const create = async (data: RazaCreate): Promise<Raza | null> => {
    try {
      const response = await axios.post<Raza>(API_URL, data);
      setRazas((prevRazas) => (prevRazas ? [...prevRazas, response.data] : [response.data]));
      return response.data;
    } catch (err) {
      setError(err as AxiosError);
      return null;
    }
  };

  const update = async (raza_id: number, data: RazaUpdate): Promise<Raza | null> => {
    try {
      const response = await axios.put<Raza>(`${API_URL}/${raza_id}`, data);
      setRazas((prevRazas) =>
        prevRazas?.map((raza) => (raza.raza_id === raza_id ? response.data : raza))
      );
      return response.data;
    } catch (err) {
      setError(err as AxiosError);
      return null;
    }
  };

  const remove = async (raza_id: number): Promise<boolean> => {
    try {
      await axios.delete(`${API_URL}/${raza_id}`);
      setRazas((prevRazas) => prevRazas?.filter((raza) => raza.raza_id !== raza_id));
      return true;
    } catch (err) {
      setError(err as AxiosError);
      return false;
    }
  };

  return { razas, isLoading, error, create, update, remove };
};