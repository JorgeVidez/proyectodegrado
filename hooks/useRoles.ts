import { useState, useEffect } from 'react';

interface RolUsuario {
  rol_id: number;
  nombre_rol: string;
  descripcion: string | null;
}

interface UseRolesResult {
  roles: RolUsuario[] | null;
  loading: boolean;
  error: Error | null;
  getRol: (rolId: number) => Promise<RolUsuario | null>;
  createRol: (rolData: Omit<RolUsuario, 'rol_id'>) => Promise<RolUsuario | null>;
  updateRol: (rolId: number, rolData: Partial<Omit<RolUsuario, 'rol_id'>>) => Promise<RolUsuario | null>;
  deleteRol: (rolId: number) => Promise<boolean>;
}

const useRoles = (baseUrl: string = 'http://localhost:8000/api'): UseRolesResult => {
  const [roles, setRoles] = useState<RolUsuario[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${baseUrl}/roles`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: RolUsuario[] = await response.json();
        setRoles(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('An unknown error occurred'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [baseUrl]);

  const getRol = async (rolId: number): Promise<RolUsuario | null> => {
    try {
      const response = await fetch(`${baseUrl}/roles/${rolId}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      return null;
    }
  };

  const createRol = async (rolData: Omit<RolUsuario, 'rol_id'>): Promise<RolUsuario | null> => {
    try {
      const response = await fetch(`${baseUrl}/roles/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rolData),
      });
      if (!response.ok) {
        if (response.status === 400) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      return null;
    }
  };

  const updateRol = async (rolId: number, rolData: Partial<Omit<RolUsuario, 'rol_id'>>): Promise<RolUsuario | null> => {
    try {
      const response = await fetch(`${baseUrl}/roles/${rolId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rolData),
      });
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      return null;
    }
  };

  const deleteRol = async (rolId: number): Promise<boolean> => {
    try {
      const response = await fetch(`${baseUrl}/roles/${rolId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        if (response.status === 404) return false;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      return false;
    }
  };

  return { roles, loading, error, getRol, createRol, updateRol, deleteRol };
};

export default useRoles;