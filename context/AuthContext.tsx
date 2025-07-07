"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import axios, { AxiosInstance } from "axios";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const TOKEN_KEY = "authToken";

interface RolUsuario {
  rol_id: number;
  nombre_rol: string;
  descripcion: string | null;
}

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
  activo?: boolean; // 'activo' es opcional
};

type AuthContextType = {
  user: UsuarioOut | null;
  role: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<true | string>;
  logout: () => void;
  hasPermission: (path: string) => boolean;
  // Operaciones CRUD
  getUsuarios: () => Promise<UsuarioOut[] | null>;
  getUsuarioPorId: (id: number) => Promise<UsuarioOut | null>;
  crearUsuario: (data: any) => Promise<UsuarioOut | null>;
  actualizarUsuario: (id: number, data: any) => Promise<UsuarioOut | null>;
  eliminarUsuario: (id: number) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UsuarioOut | null>(null);
  const [loading, setLoading] = useState(true);
  const initialLoad = useRef(true);
  const router = useRouter();

  // Instancia de axios con interceptor
  const api = useRef<AxiosInstance>(
    axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).current;

  // Actualizar token en axios y localStorage
  const updateToken = useCallback(
    (newToken: string | null) => {
      if (newToken) {
        localStorage.setItem(TOKEN_KEY, newToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      } else {
        localStorage.removeItem(TOKEN_KEY);
        delete api.defaults.headers.common["Authorization"];
      }
    },
    [api]
  );

  const logout = useCallback(() => {
    setUser(null);
    updateToken(null);
    router.push("/login");
  }, [router, updateToken]);

  // Configurar interceptores
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Guardar la URL actual para redireccionar de vuelta después del login
          if (typeof window !== "undefined") {
            const currentPath = window.location.pathname;
            if (currentPath !== "/login") {
              sessionStorage.setItem("redirectAfterLogin", currentPath);
            }
          }

          // Mostrar mensaje al usuario (opcional)
          // Puedes usar un sistema de notificaciones o un estado global

          logout();
          router.push("/login?expired=true"); // Agregamos un parámetro para indicar sesión expirada
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [api, logout, router]);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<UsuarioOut>("/usuarios/me");
      setUser(response.data);
      return response.data;
    } catch (error) {
      logout();
      return null;
    } finally {
      setLoading(false);
    }
  }, [api, logout]);

  const login = async (
    email: string,
    password: string
  ): Promise<true | string> => {
    try {
      setLoading(true);
      const response = await api.post<{ access_token: string }>("/login", {
        email,
        password,
      });

      updateToken(response.data.access_token);
      await fetchUser();
      return true;
    } catch (error: any) {
      console.error("Login failed:", error);

      // Captura mensaje personalizado de FastAPI
      if (error.response) {
        const detail = error.response.data?.detail;
        const rateLimitRemaining =
          error.response.headers?.["x-ratelimit-remaining"];

        // Devolvé el mensaje de error para mostrarlo al usuario
        return detail || "Error desconocido al intentar iniciar sesión.";
      }

      return "No se pudo conectar con el servidor.";
    } finally {
      setLoading(false);
    }
  };

  // Operaciones CRUD
  const getUsuarios = async () => {
    try {
      const response = await api.get<UsuarioOut[]>("/usuarios");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return null;
    }
  };

  const getUsuarioPorId = async (id: number) => {
    try {
      const response = await api.get<UsuarioOut>(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  const crearUsuario = async (data: UsuarioCreate) => {
    try {
      const response = await api.post<UsuarioOut>("/usuarios", data);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error creating user:",
          error.response?.data || error.message
        );
        return null;
      } else {
        console.error("An unexpected error occurred:", error);
        return null;
      }
    }
  };

  const actualizarUsuario = async (id: number, data: any) => {
    try {
      const response = await api.put<UsuarioOut>(`/usuarios/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  };

  const eliminarUsuario = async (id: number) => {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      if (response.status === 204) {
        console.log("User deleted successfully");
      }
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Inicialización
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        updateToken(token);
        await fetchUser();
      }
      setLoading(false);
    };

    if (initialLoad.current) {
      initialLoad.current = false;
      initializeAuth();
    }
  }, [fetchUser, updateToken]);

  const role = user?.rol?.nombre_rol || null;

  const hasPermission = (path: string): boolean => {
    if (!role) return false;
    const permisosPorRol: Record<string, string[]> = {
      Administrador: [
        "/admin",
        "/operador",
        "/veterinario",
        "/dashboard",
        "/admin/usuarios",
      ],
      Operador: ["/operador", "/dashboard"],
      Veterinario: ["/veterinario", "/dashboard"],
    };
    return permisosPorRol[role]?.includes(path) ?? false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        login,
        logout,
        hasPermission,
        // Operaciones CRUD
        getUsuarios,
        getUsuarioPorId,
        crearUsuario,
        actualizarUsuario,
        eliminarUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return context;
};
