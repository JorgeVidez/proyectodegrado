// hooks/useMedicamentos.ts
import { useState, useEffect } from "react";

interface Medicamento {
  medicamento_id: number;
  nombre_comercial: string;
  principio_activo?: string;
  laboratorio?: string;
  presentacion?: string;
  periodo_retiro_carne_dias?: number;
  periodo_retiro_leche_dias?: number;
}

interface MedicamentoCreate {
  nombre_comercial: string;
  principio_activo?: string;
  laboratorio?: string;
  presentacion?: string;
  periodo_retiro_carne_dias?: number;
  periodo_retiro_leche_dias?: number;
}

interface MedicamentoUpdate {
  nombre_comercial?: string;
  principio_activo?: string;
  laboratorio?: string;
  presentacion?: string;
  periodo_retiro_carne_dias?: number;
  periodo_retiro_leche_dias?: number;
}

interface UseMedicamentos {
  medicamentos: Medicamento[] | null;
  isLoading: boolean;
  error: string | null;
  create: (medicamento: MedicamentoCreate) => Promise<Medicamento | null>;
  update: (
    id: number,
    medicamento: MedicamentoUpdate
  ) => Promise<Medicamento | null>;
  remove: (id: number) => Promise<boolean>;
}

export const useMedicamentos = (): UseMedicamentos => {
  const [medicamentos, setMedicamentos] = useState<Medicamento[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

     
  const URL_MEDICAMENTOS = API_URL + "/medicamentos";

  const fetchMedicamentos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(URL_MEDICAMENTOS); // Asegúrate de que la ruta sea correcta
      if (!response.ok) {
        throw new Error("Error al cargar medicamentos");
      }
      const data = await response.json();
      setMedicamentos(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicamentos();
  }, []);

  const create = async (
    medicamento: MedicamentoCreate
  ): Promise<Medicamento | null> => {
    try {
      const response = await fetch(URL_MEDICAMENTOS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(medicamento),
      });
      if (!response.ok) {
        throw new Error("Error al crear medicamento");
      }
      const data = await response.json();
      fetchMedicamentos(); // Recargar la lista después de crear
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const update = async (
    id: number,
    medicamento: MedicamentoUpdate
  ): Promise<Medicamento | null> => {
    try {
        const response = await fetch(URL_MEDICAMENTOS + `/${id}`, {
       
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(medicamento),
      });
      if (!response.ok) {
        throw new Error("Error al actualizar medicamento");
      }
      const data = await response.json();
      fetchMedicamentos(); // Recargar la lista después de actualizar
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(URL_MEDICAMENTOS + `/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar medicamento");
      }
      fetchMedicamentos(); // Recargar la lista después de eliminar
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return { medicamentos, isLoading, error, create, update, remove };
};
