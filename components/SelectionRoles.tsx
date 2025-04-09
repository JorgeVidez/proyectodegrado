"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useRoles from "@/hooks/useRoles";

interface RoleSelectProps {
  value: number; // Cambiado a number
  onValueChange: (value: number) => void;
}

export const RoleSelect: React.FC<RoleSelectProps> = ({
  value,
  onValueChange,
}) => {
  const { roles, loading, error, fetchRoles } = useRoles();
  const [localRoles, setLocalRoles] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && roles) {
      setLocalRoles(roles);
    }
  }, [loading, roles]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  if (loading) {
    return <div>Cargando roles...</div>;
  }

  if (error) {
    return <div>Error al cargar roles: {error.message}</div>;
  }

  return (
    <Select
      value={value.toString()}
      onValueChange={(value) => onValueChange(parseInt(value))}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Seleccionar rol" />
      </SelectTrigger>
      <SelectContent>
        {localRoles.map((rol) => (
          <SelectItem key={rol.rol_id.toString()} value={rol.rol_id.toString()}>
            {rol.nombre_rol}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
