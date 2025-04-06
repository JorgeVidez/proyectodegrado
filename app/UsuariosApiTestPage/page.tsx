'use client';

import React, { useState } from 'react';
import { useUsuariosApi } from '@/hooks/useUsuariosApi'; // Asegúrate de que la ruta sea correcta

function UsuariosApiTestPage() {
  const [token, setToken] = useState<string | undefined>();
  const {
    loading,
    error,
    getUsuarioActual,
    getUsuarios,
    getUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    login,
  } = useUsuariosApi(token);

  const [result, setResult] = useState<any>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [usuarioData, setUsuarioData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol_id: 1,
    activo: true,
  });
  const [usuarioUpdateData, setUsuarioUpdateData] = useState({});

  const handleLogin = async () => {
    const response = await login(loginData);
    setResult(response);
    if (response && response.access_token) {
      setToken(response.access_token);
    }
  };

  const handleGetUsuarioActual = async () => {
    const response = await getUsuarioActual();
    setResult(response);
  };

  const handleGetUsuarios = async () => {
    const response = await getUsuarios();
    setResult(response);
  };

  const handleGetUsuarioPorId = async () => {
    if (!userId) return;
    const response = await getUsuarioPorId(userId);
    setResult(response);
  };

  const handleCrearUsuario = async () => {
    const response = await crearUsuario(usuarioData);
    setResult(response);
  };

  const handleActualizarUsuario = async () => {
    if (!userId) return;
    const response = await actualizarUsuario(userId, usuarioUpdateData);
    setResult(response);
  };

  const handleEliminarUsuario = async () => {
    if (!userId) return;
    const response = await eliminarUsuario(userId);
    setResult(response);
  };

  return (
    <div>
      <h1>Prueba de useUsuariosApi</h1>

      <div>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={loginData.email}
          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={loginData.password}
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
        />
        <button onClick={handleLogin}>Login</button>
      </div>

      <div>
        <h2>Get Usuario Actual</h2>
        <button onClick={handleGetUsuarioActual}>Get Usuario Actual</button>
      </div>

      <div>
        <h2>Get Usuarios</h2>
        <button onClick={handleGetUsuarios}>Get Usuarios</button>
      </div>

      <div>
        <h2>Get Usuario por ID</h2>
        <input
          type="number"
          placeholder="Usuario ID"
          value={userId || ''}
          onChange={(e) => setUserId(Number(e.target.value))}
        />
        <button onClick={handleGetUsuarioPorId}>Get Usuario</button>
      </div>

      <div>
        <h2>Crear Usuario</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={usuarioData.nombre}
          onChange={(e) => setUsuarioData({ ...usuarioData, nombre: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={usuarioData.email}
          onChange={(e) => setUsuarioData({ ...usuarioData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={usuarioData.password}
          onChange={(e) => setUsuarioData({ ...usuarioData, password: e.target.value })}
        />
        <input
          type="number"
          placeholder="Rol ID"
          value={usuarioData.rol_id}
          onChange={(e) => setUsuarioData({ ...usuarioData, rol_id: Number(e.target.value) })}
        />
        <label>
          Activo:
          <input
            type="checkbox"
            checked={usuarioData.activo}
            onChange={(e) => setUsuarioData({ ...usuarioData, activo: e.target.checked })}
          />
        </label>
        <button onClick={handleCrearUsuario}>Crear Usuario</button>
      </div>

      <div>
        <h2>Actualizar Usuario</h2>
        <input
          type="number"
          placeholder="Usuario ID"
          value={userId || ''}
          onChange={(e) => setUserId(Number(e.target.value))}
        />
        <input
          type="text"
          placeholder="Nombre (Actualizar)"
          onChange={(e) => setUsuarioUpdateData({ ...usuarioUpdateData, nombre: e.target.value })}
        />
         <input
          type="email"
          placeholder="Email (Actualizar)"
          onChange={(e) => setUsuarioUpdateData({ ...usuarioUpdateData, email: e.target.value })}
        />
         <input
          type="password"
          placeholder="Password (Actualizar)"
          onChange={(e) => setUsuarioUpdateData({ ...usuarioUpdateData, password: e.target.value })}
        />
         <input
          type="number"
          placeholder="Rol ID (Actualizar)"
          onChange={(e) => setUsuarioUpdateData({ ...usuarioUpdateData, rol_id: Number(e.target.value) })}
        />
        <label>
          Activo (Actualizar):
          <input
            type="checkbox"
            onChange={(e) => setUsuarioUpdateData({ ...usuarioUpdateData, activo: e.target.checked })}
          />
        </label>
        <button onClick={handleActualizarUsuario}>Actualizar Usuario</button>
      </div>

      <div>
        <h2>Eliminar Usuario</h2>
        <input
          type="number"
          placeholder="Usuario ID"
          value={userId || ''}
          onChange={(e) => setUserId(Number(e.target.value))}
        />
        <button onClick={handleEliminarUsuario}>Eliminar Usuario</button>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      {result && (
        <div>
          <h2>Resultado:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default UsuariosApiTestPage;