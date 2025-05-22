"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: string;
}

interface UseUsuariosResult {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    nombre: string,
    email: string,
    rol: string,
    password: string
  ) => Promise<void>;
  getUsers: () => Promise<User[]>;
  getUserById: (id: string) => Promise<User>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  refreshAuthToken: () => Promise<boolean>;
  logout: () => void;
}

export const useUsuarios = (): UseUsuariosResult => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const getToken = (): string | null => localStorage.getItem("token");

  const getAuthHeaders = (): Record<string, string> => {
    const token = getToken();
    return token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : { "Content-Type": "application/json" };
  };

  const extractErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
      if (error.response?.data?.detail?.error) {
        try {
          const match =
            error.response.data.detail.error.match(/'error':\s*'([^']+)'/);
          return match ? match[1] : error.response.data.detail.error;
        } catch (parseError) {
          console.error("Error al procesar el mensaje de error:", parseError);
        }
      }
    }
    return "Ocurrió un error inesperado.";
  };

  const fetchUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/usuarios/me`, {
        headers: getAuthHeaders(),
      });
      setUser(res.data);
    } catch (error) {
      console.error("Error al obtener usuario:", extractErrorMessage(error));
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });
      const token = res.data.access_token;
      if (token) {
        localStorage.setItem("token", token);
        await fetchUser();
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", extractErrorMessage(error));
      throw new Error(extractErrorMessage(error));
    }
  };

  const register = async (
    nombre: string,
    email: string,
    rol: string,
    password: string
  ) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/usuarios/`, {
        nombre,
        email,
        rol,
        password,
      });
      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);
        await fetchUser();
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error al registrar usuario:", extractErrorMessage(error));
      throw new Error(extractErrorMessage(error));
    }
  };

  const getUsers = async (): Promise<User[]> => {
    try {
      const res = await axios.get(`${API_BASE_URL}/usuarios/`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", extractErrorMessage(error));
      throw new Error(extractErrorMessage(error));
    }
  };

  const getUserById = async (id: string): Promise<User> => {
    try {
      const res = await axios.get(`${API_BASE_URL}/usuarios/${id}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error(
        "Error al obtener usuario por ID:",
        extractErrorMessage(error)
      );
      throw new Error(extractErrorMessage(error));
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/usuarios/${id}`, userData, {
        headers: getAuthHeaders(),
      });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        await fetchUser();
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", extractErrorMessage(error));
      throw new Error(extractErrorMessage(error));
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/usuarios/${id}`, {
        headers: getAuthHeaders(),
      });
      logout();
    } catch (error) {
      console.error("Error al eliminar usuario:", extractErrorMessage(error));
      throw new Error(extractErrorMessage(error));
    }
  };

  const refreshAuthToken = async (): Promise<boolean> => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/refresh`,
        {},
        { headers: getAuthHeaders() }
      );
      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);
        return true;
      }
    } catch (error) {
      console.error("Error al refrescar token:", extractErrorMessage(error));
      logout();
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return {
    user,
    login,
    logout,
    register,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    refreshAuthToken,
    loading,
  };
};
