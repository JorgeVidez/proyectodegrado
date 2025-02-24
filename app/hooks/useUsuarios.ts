import useSWR from "swr";
import axios, { AxiosError } from "axios";

const API_URL = "http://localhost:8000/api/usuarios/"; // Ajusta la URL según tu backend
const LOGIN_URL = "http://localhost:8000/api/login";

// Función fetcher para SWR
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useUsuarios() {
  const { data, error, mutate } = useSWR(API_URL, fetcher);

  return {
    usuarios: data || [],
    isLoading: !error && !data,
    isError: error,
    refetch: mutate,
  };
}

export async function loginUsuario(email: string, password: string) {
  try {
    const response = await axios.post(
      LOGIN_URL,
      { email, password }, // Ahora enviamos JSON
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log(response.data);

    const { access_token } = response.data;
    localStorage.setItem("token", access_token); // Guardar el token
    return { success: true, token: access_token };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.detail || "Error al iniciar sesión"
      );
    }
    throw new Error("Error desconocido al iniciar sesión");
  }
}

// Verificar si el usuario está autenticado
export function isAuthenticated(): boolean {
  return !!localStorage.getItem("token");
}

// Logout
export function logoutUsuario() {
  localStorage.removeItem("token");
}

// Crear usuario
export async function createUsuario(usuario: {
  nombre: string;
  email: string;
  rol: string;
  password: string;
}) {
  try {
    const response = await axios.post(API_URL, usuario);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.detail || "Error al crear usuario");
    }
    throw new Error("Error desconocido al crear usuario");
  }
}

// Actualizar usuario
export async function updateUsuario(
  id: number,
  usuarioData: Partial<{
    nombre: string;
    email: string;
    rol: string;
    password: string;
  }>
) {
  try {
    const response = await axios.put(`${API_URL}${id}`, usuarioData);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.detail || "Error al actualizar usuario"
      );
    }
    throw new Error("Error desconocido al actualizar usuario");
  }
}

// Eliminar usuario
export async function deleteUsuario(id: number) {
  try {
    await axios.delete(`${API_URL}${id}`);
    return { message: "Usuario eliminado correctamente" };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.detail || "Error al eliminar usuario"
      );
    }
    throw new Error("Error desconocido al eliminar usuario");
  }
}
