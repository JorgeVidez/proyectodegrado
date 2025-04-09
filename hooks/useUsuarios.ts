"use client";

import { useEffect, useMemo, useState } from "react";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const API_BASE_URL = "http://localhost:8000/api";
const TOKEN_KEY = "authToken";

// TYPES
type RolUsuario = {
  rol_id: number;
  nombre_rol: string;
  descripcion?: string;
};

type UsuarioOut = {
  usuario_id: number;
  nombre: string;
  email: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string | null;
  rol: RolUsuario;
};

type UsuarioCreate = {
  nombre: string;
  email: string;
  password: string;
  rol_id: number;
  activo?: boolean;
};

type UsuarioUpdate = Partial<Omit<UsuarioCreate, "password">> & {
  password?: string;
};

type LoginData = {
  email: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
  token_type: string;
};

export function useUsuariosApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  });

  // Axios para llamadas con autenticación
  const authAxios = useMemo(() => {
    return axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }, []);

  // Interceptor que añade el token a cada request
  useEffect(() => {
    const interceptor = authAxios.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Interceptor usando token:", token);
      } else {
        delete config.headers.Authorization;
      }
      return config;
    });

    return () => {
      authAxios.interceptors.request.eject(interceptor);
    };
  }, [token, authAxios]);

  // Axios sin token para login
  const noAuthAxios = useMemo(() => {
    return axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }, []);

  // ✅ Token updater sin asumir que setToken es síncrono
  const updateToken = (newToken: string | null) => {
    // Caso 1: Nuevo token es diferente del actual
    if (newToken !== token) {
      if (newToken) {
        console.log("Actualizando token:", newToken);
        localStorage.setItem(TOKEN_KEY, newToken);
      } else {
        console.log("Eliminando token");
        localStorage.removeItem(TOKEN_KEY);
      }
      setToken(newToken);
      return;
    }

    // Caso 2: Ambos son null (no hay cambio)
    if (newToken === null && token === null) {
      console.log("No hay token, no se requiere acción");
      return;
    }

    // Caso 3: Mismo token (no hay cambio)
    console.log("Token no ha cambiado, no se requiere actualización");
  };


  // Log de confirmación cuando el token cambie (asíncrono)
  useEffect(() => {
    console.log("Token actualizado (desde efecto):", token);
  }, [token]);

  // Request handler
  const handleRequest = async <T>(
    axiosInstance: AxiosInstance,
    path: string,
    config: AxiosRequestConfig
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.request<T>({
        url: path,
        ...config,
      });
      return response.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.detail?.error ||
        err?.response?.data?.error ||
        err?.message ||
        "Error inesperado";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    token,
    updateToken,

    // LOGIN sin token
    login: async (data: LoginData) => {
      const response = await handleRequest<LoginResponse>(
        noAuthAxios,
        "/login",
        {
          method: "POST",
          data,
        }
      );

      if (response?.access_token) {
        updateToken(response.access_token);
      }

      return response;
    },

    // USUARIOS con token
    getUsuarioActual: () =>
      handleRequest<UsuarioOut>(authAxios, "/usuarios/me", {
        method: "GET",
      }),

    getUsuarios: () =>
      handleRequest<UsuarioOut[]>(authAxios, "/usuarios/", {
        method: "GET",
      }),

    getUsuarioPorId: (id: number) =>
      handleRequest<UsuarioOut>(authAxios, `/usuarios/${id}`, {
        method: "GET",
      }),

    crearUsuario: (data: UsuarioCreate) =>
      handleRequest<UsuarioOut>(authAxios, "/usuarios/", {
        method: "POST",
        data,
      }),

    actualizarUsuario: (id: number, data: UsuarioUpdate) =>
      handleRequest<UsuarioOut>(authAxios, `/usuarios/${id}`, {
        method: "PUT",
        data,
      }),

    eliminarUsuario: (id: number) =>
      handleRequest<{ message: string }>(authAxios, `/usuarios/${id}`, {
        method: "DELETE",
      }),
  };
}
