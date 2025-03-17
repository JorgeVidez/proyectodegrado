"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface User {
  id: string;
  nombre: string;
  email: string;
  rol: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;

  refreshAuthToken: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchUser = useCallback(async (token: string) => {
    try {
      const res = await axios.get("http://localhost:8000/api/usuarios/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      const token = res.data.access_token;
      const refreshToken = res.data.refresh_token;

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      await fetchUser(token);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      throw new Error("Error al iniciar sesión");
    }
  };

  const refreshAuthToken = async () => {
    if (isRefreshing) return; // Evita múltiples llamadas simultáneas
    setIsRefreshing(true);

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        logout();
        return;
      }

      const res = await axios.post("http://localhost:8000/api/refresh", {
        refresh_token: refreshToken, // Enviar el refresh token en el body, no en headers
      });

      const newToken = res.data.access_token;
      localStorage.setItem("token", newToken);
      return newToken;
    } catch (error) {
      console.error("Error al refrescar el token:", error);
      logout();
    } finally {
      setIsRefreshing(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    router.push("/login");
  };

  // Interceptores para manejar errores 401 y refrescar el token automáticamente
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          console.warn("Token expirado. Intentando renovar...");

          if (!isRefreshing) {
            const newToken = await refreshAuthToken();
            if (newToken) {
              error.config.headers.Authorization = `Bearer ${newToken}`;
              return axios(error.config);
            }
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [isRefreshing]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,

        refreshAuthToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
