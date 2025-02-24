"use client";

import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="text-2xl font-semibold text-gray-900">Cargando...</h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
      {user && (
        <div className="mt-4 p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold">Bienvenido, {user.nombre}</h2>
          <p className="text-gray-700">Email: {user.email}</p>
          <p className="text-gray-700">Rol: {user.rol}</p>
        </div>
      )}
    </div>
  );
}
