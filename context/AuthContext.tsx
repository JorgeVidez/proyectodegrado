"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useUsuariosApi } from "../hooks/useUsuariosApi";
import { useRouter } from "next/navigation";

type Rol = "Administrador" | "Operador" | "Veterinario" | string;

type UsuarioOut = {
  usuario_id: number;
  nombre: string;
  email: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string | null;
  rol: {
    rol_id: number;
    nombre_rol: Rol;
    descripcion?: string;
  };
};

type AuthContextType = {
  user: UsuarioOut | null;
  token: string | null;
  role: Rol | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (path: string) => boolean;
  fetchUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UsuarioOut | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const usuariosApi = useUsuariosApi(); // Inicializamos sin token

  // Función para actualizar el token en la instancia de axios
  const updateApiToken = useCallback(
    (newToken: string | null) => {
      usuariosApi.updateToken(newToken || null);
    },
    [usuariosApi]
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    updateApiToken(null);
    localStorage.removeItem("token");
    router.push("/login");
  }, [router, updateApiToken]);

  // Función para obtener los datos del usuario actual
  const fetchUser = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const userData = await usuariosApi.getUsuarioActual();
      if (userData === null) {
        console.error("Usuario no encontrado o no autorizado");
        logout(); // Limpia todo en caso de error
        router.push("/login"); // Redirigir a login si no se encuentra el usuario
      }
      setUser(userData || null);
    } catch (err) {
      console.error("Error obteniendo usuario:", err);
      logout(); // Limpia todo en caso de error
    } finally {
      setLoading(false);
    }
  }, [token]); // Solo depende de token

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await usuariosApi.login({ email, password });

      if (!res?.access_token) throw new Error("Token no recibido");

      // Actualizar todo sincrónicamente
      localStorage.setItem("token", res.access_token);
      updateApiToken(res.access_token);
      setToken(res.access_token); // Último en actualizarse

      await fetchUser();

      return true;
    } catch (err) {
      console.error("Error en login:", err);
      logout();
      return false;
    } finally {
      setLoading(false);
    }
  };

  const role = user?.rol?.nombre_rol || null;

  const permisosPorRol: Record<string, string[]> = {
    Administrador: ["/admin", "/operador", "/veterinario", "/dashboard"],
    Operador: ["/operador", "/dashboard"],
    Veterinario: ["/veterinario", "/dashboard"],
  };

  const hasPermission = (path: string): boolean => {
    if (!role) return false;
    return permisosPorRol[role]?.includes(path) ?? false;
  };

  // Efecto para cargar el token inicial
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      updateApiToken(storedToken);
      setToken(storedToken); // Dispara el efecto secundario automáticamente
    } else {
      setLoading(false);
    }
  }, []); // Sin dependencias

  // Efecto para cargar los datos del usuario cuando cambia el token
  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]); // Eliminar fetchUser de las dependencias

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        role,
        loading,
        hasPermission,
        fetchUser,
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