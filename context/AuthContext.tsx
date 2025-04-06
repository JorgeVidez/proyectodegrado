"use client";

import { createContext, useContext, useEffect, useState } from "react";
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
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UsuarioOut | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { login: loginApi, getUsuarioActual } = useUsuariosApi(
    token || undefined
  );
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const res = await loginApi({ email, password });
      if (!res?.access_token) throw new Error("Token no recibido");

      setToken(res.access_token);
      localStorage.setItem("token", res.access_token);

      const userData = await getUsuarioActual();
      if (!userData) throw new Error("Error obteniendo usuario");

      setUser(userData);
      return true;
    } catch (err) {
      logout();
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    router.push("/login");
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

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
      getUsuarioActual()
        .then((res) => {
          if (res) setUser(res);
          setLoading(false);
        })
        .catch(() => {
          logout();
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, role, loading, hasPermission }}
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
