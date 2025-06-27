import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types"; // Importa PropTypes correctamente
import { Input } from "./ui/input";
import { useAuth } from "@/context/AuthContext";

// Asumiendo que getUsuarioPorId se define dentro de useAuth o se exporta por separado.
// Si getUsuarioPorId es un método del contexto, lo obtendremos de useAuth.

const UserInput = ({ idusuario, onChange, value }: { idusuario?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void, value?: string }) => {
  const { getUsuarioPorId } = useAuth(); // Obtén getUsuarioPorId del hook useAuth
  const [nombreUsuario, setNombreUsuario] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      if (idusuario) {
        try {
          const usuario = await getUsuarioPorId(Number(idusuario));
          if (usuario && usuario.nombre) {
            // Asumiendo que el objeto usuario tiene una propiedad 'nombre'
            setNombreUsuario(usuario.nombre);
          } else {
            setNombreUsuario(""); // Limpiar si no se encuentra el usuario o el nombre
          }
        } catch (error) {
          console.error("Error al obtener el usuario por ID:", error);
          setNombreUsuario(""); // Limpiar en caso de error
        }
      } else {
        setNombreUsuario(""); // Limpiar si no hay idusuario
      }
    };

    fetchUserName();
  }, [idusuario, getUsuarioPorId]); // Dependencias: idusuario y getUsuarioPorId

  // Si se proporciona un 'value' desde fuera, se le da preferencia.
  // De lo contrario, se usa el nombreUsuario cargado.
  const inputValue = value !== undefined ? value : nombreUsuario;

  return (
    <Input
      type="text"
      disabled
      placeholder="Cargando nombre de usuario..." // Mensaje mientras carga
      className="w-full max-w-md border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={inputValue}
      onChange={onChange} // Pasa el onChange para permitir control externo
      readOnly={value === undefined} // Hazlo de solo lectura si no se controla externamente
    />
  );
};

UserInput.propTypes = {
  idusuario: PropTypes.string, // idusuario ahora es un prop requerido para la carga
  onChange: PropTypes.func, // Opcional, para controlar el input externamente
  value: PropTypes.string, // Opcional, para proporcionar un valor inicial externamente
};

export default UserInput;
