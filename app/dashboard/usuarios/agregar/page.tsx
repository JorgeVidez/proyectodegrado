"use client";

import React, { useState } from "react";
import { useUsuarios } from "../../../../hooks/useUsuarios";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RoleSelect, RolUsuario } from "@/components/RoleSelect"; // Importamos RoleSelect
import { AxiosError } from "axios";

export default function AgregarUsuarioPage() {
  const { register } = useUsuarios();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState<RolUsuario | undefined>(undefined);
  const [password, setPassword] = useState("");
  const [mensajeExito, setMensajeExito] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null); // ✅ Estado para manejar errores

  const handleAgregarUsuario = async () => {
    if (nombre && email && rol && password) {
      setMensajeError(null);
      try {
        await register(nombre, email, rol, password);
        setMensajeExito(true);
        setTimeout(() => {
          setMensajeExito(false);
        }, 2000);
      } catch (error) {
        if (error instanceof AxiosError) {
          // ✅ Si es un error de Axios, obtenemos el mensaje de respuesta del servidor
          setMensajeError(
            error.response?.data?.message || "Error en la solicitud."
          );
        } else if (error instanceof Error) {
          // ✅ Si es otro tipo de error de JavaScript, obtenemos su mensaje
          setMensajeError(error.message);
        } else {
          // ✅ Si no podemos determinar el error, mostramos un mensaje genérico
          setMensajeError("Ocurrió un error inesperado.");
        }
      }
    } else {
      setMensajeError("Todos los campos son obligatorios.");
    }
  };

  return (
    <div>
      <header className="flex h-16 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Agregar Usuario</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-4">
          {mensajeExito && (
            <Alert className="mb-4">
              <AlertTitle>Éxito</AlertTitle>
              <AlertDescription>
                Usuario agregado correctamente.
              </AlertDescription>
            </Alert>
          )}

          {mensajeError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{mensajeError}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4">
            <div>
              <Label>Nombre</Label>
              <Input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label>Rol</Label>
              <RoleSelect value={rol} onChange={setRol} />
            </div>
            <div>
              <Label>Contraseña</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button className="mt-4" onClick={handleAgregarUsuario}>
            Agregar Usuario
          </Button>
        </div>
      </div>
    </div>
  );
}
