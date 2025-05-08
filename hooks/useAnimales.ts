// hooks/useAnimales.ts

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { AnimalOut, AnimalCreate, AnimalUpdate } from "@/types/animal"; // Asegúrate de tener estas interfaces definidas

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const URL_ANIMALES = API_URL + "/animal";

export const useAnimales = () => {
  const [animales, setAnimales] = useState<AnimalOut[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimales = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<AnimalOut[]>(URL_ANIMALES);
        setAnimales(response.data);
        setIsLoading(false);
        setError(null);
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError("Error desconocido al cargar los animales.");
        }
        setIsLoading(false);
      }
    };

    fetchAnimales();
  }, []);

  const create = async (
    animalData: AnimalCreate
  ): Promise<AnimalOut | null> => {
    try {
      const response = await axios.post<AnimalOut>(
        URL_ANIMALES + "/",
        animalData
      );
      setAnimales((prevAnimales) => [...(prevAnimales || []), response.data]);
      setError(null);
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.detail?.error || err.message);
      } else {
        setError("Error desconocido al crear el animal.");
      }
      return null;
    }
  };

  const update = async (
    id: number,
    animalData: AnimalUpdate
  ): Promise<AnimalOut | null> => {
    try {
      const response = await axios.put<AnimalOut>(
        `${URL_ANIMALES}/${id}`,
        animalData
      );
      setAnimales(
        (prevAnimales) =>
          prevAnimales?.map((animal) =>
            animal.animal_id === id ? response.data : animal
          ) || null
      );
      setError(null);
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.detail?.error || err.message);
      } else {
        setError("Error desconocido al actualizar el animal.");
      }
      return null;
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    try {
      await axios.delete(`${URL_ANIMALES}/${id}`);
      setAnimales(
        (prevAnimales) =>
          prevAnimales?.filter((animal) => animal.animal_id !== id) || null
      );
      setError(null);
      return true;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.detail?.error || err.message);
      } else {
        setError("Error desconocido al eliminar el animal.");
      }
      return false;
    }
  };

  return {
    animales,
    isLoading,
    error,
    create,
    update,
    remove,
  };
};
