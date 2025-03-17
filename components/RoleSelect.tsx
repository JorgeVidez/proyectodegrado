"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Definir los roles como Enum en TypeScript
export enum RolUsuario {
  ADMINISTRADOR = "administrador",
  OPERADOR = "operador",
  VETERINARIO = "veterinario",
}

// Propiedades del componente
interface RoleSelectProps {
  value?: RolUsuario; // Valor inicial opcional
  onChange?: (value: RolUsuario) => void; // Callback al cambiar de valor
}

export function RoleSelect({ value, onChange }: RoleSelectProps) {
  return (
    <Select
      onValueChange={(val) => onChange?.(val as RolUsuario)}
      value={value}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Seleccionar rol" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Roles</SelectLabel>
          <SelectItem value={RolUsuario.ADMINISTRADOR}>
            Administrador
          </SelectItem>
          <SelectItem value={RolUsuario.OPERADOR}>Operador</SelectItem>
          <SelectItem value={RolUsuario.VETERINARIO}>Veterinario</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
