import { useState, useEffect } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
const URL_TIPOS_VACUNA = API_URL + "/tipos_vacuna";



interface TipoVacuna {
  tipo_vacuna_id: number;
  nombre_vacuna: string;
  enfermedad_prevenida?: string;
  laboratorio?: string;
  especie_destino_id?: number;
  especie_destino?: {
    nombre_comun: string;
    nombre_cientifico?: string;
    especie_id: number;
  };
}

interface TipoVacunaCreate {
  nombre_vacuna: string;
  enfermedad_prevenida?: string;
  laboratorio?: string;
  especie_destino_id?: number;
}

interface TipoVacunaUpdate {
  nombre_vacuna?: string;
  enfermedad_prevenida?: string;
  laboratorio?: string;
  especie_destino_id?: number;
}

interface UseTipoVacunas {
  tiposVacuna: TipoVacuna[] | null;
  isLoading: boolean;
  error: string | null;
  create: (data: TipoVacunaCreate) => Promise<TipoVacuna | null>;
  update: (id: number, data: TipoVacunaUpdate) => Promise<TipoVacuna | null>;
  remove: (id: number) => Promise<boolean>;
}

export const useTipoVacunas = (): UseTipoVacunas => {
  const [tiposVacuna, setTiposVacuna] = useState<TipoVacuna[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTiposVacuna = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(URL_TIPOS_VACUNA);
      if (!response.ok) {
        throw new Error("Error al cargar los tipos de vacuna");
      }
      const data: TipoVacuna[] = await response.json();
      setTiposVacuna(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposVacuna();
  }, []);

  const create = async (data: TipoVacunaCreate): Promise<TipoVacuna | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(URL_TIPOS_VACUNA, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail?.error || "Error al crear el tipo de vacuna"
        );
      }
      const createdTipoVacuna: TipoVacuna = await response.json();
      fetchTiposVacuna(); // Recargar la lista después de crear
      return createdTipoVacuna;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (
    id: number,
    data: TipoVacunaUpdate
  ): Promise<TipoVacuna | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${URL_TIPOS_VACUNA}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail?.error || "Error al actualizar el tipo de vacuna"
        );
      }
      const updatedTipoVacuna: TipoVacuna = await response.json();
      fetchTiposVacuna(); // Recargar la lista después de actualizar
      return updatedTipoVacuna;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${URL_TIPOS_VACUNA}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail?.error || "Error al eliminar el tipo de vacuna"
        );
      }
      fetchTiposVacuna(); // Recargar la lista después de eliminar
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { tiposVacuna, isLoading, error, create, update, remove };
};
