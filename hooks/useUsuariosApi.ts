'use client'

import { useState } from 'react'
import axios, { AxiosRequestConfig } from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

type RolUsuario = {
  rol_id: number
  nombre_rol: string
  descripcion?: string
}

type UsuarioOut = {
  usuario_id: number
  nombre: string
  email: string
  activo: boolean
  fecha_creacion: string
  fecha_actualizacion: string | null
  rol: RolUsuario
}

type UsuarioCreate = {
  nombre: string
  email: string
  password: string
  rol_id: number
  activo?: boolean
}

type UsuarioUpdate = Partial<Omit<UsuarioCreate, 'password'>> & {
  password?: string
}

type LoginData = {
  email: string
  password: string
}

type LoginResponse = {
  access_token: string
  token_type: string
}

export function useUsuariosApi(initialToken?: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState(initialToken);

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  // Interceptor para actualizar el token en cada request
  axiosInstance.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  });

  // Método para actualizar el token
  const updateToken = (newToken: string | null) => {
    setToken(newToken || undefined);
  };

  const handleRequest = async <T>(
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
    updateToken,
    loading,
    error,

    getUsuarioActual: () =>
      handleRequest<UsuarioOut>("/usuarios/me", {
        method: "GET",
      }),

    getUsuarios: () =>
      handleRequest<UsuarioOut[]>("/usuarios/", {
        method: "GET",
      }),

    getUsuarioPorId: (id: number) =>
      handleRequest<UsuarioOut>(`/usuarios/${id}`, {
        method: "GET",
      }),

    crearUsuario: (data: UsuarioCreate) =>
      handleRequest<UsuarioOut>("/usuarios/", {
        method: "POST",
        data,
      }),

    actualizarUsuario: (id: number, data: UsuarioUpdate) =>
      handleRequest<UsuarioOut>(`/usuarios/${id}`, {
        method: "PUT",
        data,
      }),

    eliminarUsuario: (id: number) =>
      handleRequest<{ message: string }>(`/usuarios/${id}`, {
        method: "DELETE",
      }),

    login: (data: LoginData) =>
      handleRequest<LoginResponse>("/login", {
        method: "POST",
        data,
      }),
  };
}
