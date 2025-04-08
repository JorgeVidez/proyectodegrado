import { useState, useEffect } from 'react';

interface TipoAlimento {
  tipo_alimento_id: number;
  nombre: string;
  descripcion?: string;
  unidad_medida?: string;
}

interface TipoAlimentoCreate {
  nombre: string;
  descripcion?: string;
  unidad_medida?: string;
}

interface TipoAlimentoUpdate {
  nombre?: string;
  descripcion?: string;
  unidad_medida?: string;
}

interface UseTipoAlimentos {
  tiposAlimento: TipoAlimento[] | null;
  isLoading: boolean;
  error: string | null;
  create: (data: TipoAlimentoCreate) => Promise<TipoAlimento | null>;
  update: (id: number, data: TipoAlimentoUpdate) => Promise<TipoAlimento | null>;
  remove: (id: number) => Promise<boolean>;
}

export const useTipoAlimentos = (): UseTipoAlimentos => {
  const [tiposAlimento, setTiposAlimento] = useState<TipoAlimento[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'http://localhost:8000/api/tipos_alimento'


  const fetchTiposAlimento = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/`); // Asegúrate de que la ruta sea correcta
      if (!response.ok) {
        throw new Error('Error al cargar los tipos de alimento');
      }
      const data: TipoAlimento[] = await response.json();
      setTiposAlimento(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposAlimento();
  }, []);

  const create = async (data: TipoAlimentoCreate): Promise<TipoAlimento | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.error || 'Error al crear el tipo de alimento');
      }
      const createdTipoAlimento: TipoAlimento = await response.json();
      fetchTiposAlimento(); // Recargar la lista después de crear
      return createdTipoAlimento;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (id: number, data: TipoAlimentoUpdate): Promise<TipoAlimento | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.error || 'Error al actualizar el tipo de alimento');
      }
      const updatedTipoAlimento: TipoAlimento = await response.json();
      fetchTiposAlimento(); // Recargar la lista después de actualizar
      return updatedTipoAlimento;
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
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.error || 'Error al eliminar el tipo de alimento');
      }
      fetchTiposAlimento(); // Recargar la lista después de eliminar
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { tiposAlimento, isLoading, error, create, update, remove };
};