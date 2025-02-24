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
  refreshAuthToken: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchUser = useCallback(async (token: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/usuarios/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error(`Error al obtener usuario: ${res.status}`);
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      setUser(null);
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

  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem("token");
    return token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : { "Content-Type": "application/json" };
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Credenciales incorrectas");

      const responseData = await res.json(); // Ahora sí esperas la respuesta JSON

      console.log("Response Data:", responseData);

      const token = responseData.access_token; // Asegúrate de extraer la clave correcta
      localStorage.setItem("token", token);
      console.log("Token guardado:", token);
      await fetchUser(token);
      console.log("User", user);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      throw new Error("Error al iniciar sesión");
    }
  };

  const register = async (
    nombre: string,
    email: string,
    rol: string,
    password: string
  ) => {
    try {
      const res = await fetch("http://localhost:8000/api/usuarios/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, rol, password }),
      });

      if (!res.ok) throw new Error("Error en el registro");

      const { token }: { token: string } = await res.json();
      localStorage.setItem("token", token);
      await fetchUser(token);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      throw new Error("Error al registrar usuario");
    }
  };

  const getUsers = async (): Promise<User[]> => {
    try {
      const res = await fetch("http://localhost:8000/api/usuarios/", {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Error al obtener usuarios");

      return await res.json();
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener la lista de usuarios");
    }
  };

  const getUserById = async (id: string): Promise<User> => {
    try {
      const res = await fetch(`http://localhost:8000/api/usuarios/${id}`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Error al obtener usuario");

      return await res.json();
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener usuario por ID");
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      const res = await fetch(`http://localhost:8000/api/usuarios/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      if (!res.ok) throw new Error("Error al actualizar usuario");

      const { token }: { token: string } = await res.json();
      localStorage.setItem("token", token);
      await fetchUser(token);
    } catch (error) {
      console.error(error);
      throw new Error("Error al actualizar la información");
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/usuarios/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Error al eliminar usuario");

      logout();
    } catch (error) {
      console.error(error);
      throw new Error("Error al eliminar la cuenta");
    }
  };

  const refreshAuthToken = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/refresh", {
        method: "POST",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Error al refrescar token");

      const { token }: { token: string } = await res.json();
      localStorage.setItem("token", token);
    } catch (error) {
      console.error(error);
      throw new Error("Error al refrescar el token");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
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
