"use client";

import React, { useState, useEffect } from "react";
import { useEspecies } from "@/hooks/useEspecies";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectionEspecie({ value, onChange }) {
  const { especies, isLoading, error } = useEspecies();
  const [selectedValue, setSelectedValue] = useState(value || "all"); // Usamos "all" como valor inicial

  useEffect(() => {
    setSelectedValue(value || "all"); // Usamos "all" como valor inicial
  }, [value]);

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  const handleEspecieChange = (newValue) => {
    setSelectedValue(newValue);
    onChange(newValue);
  };

  if (isLoading) return <div>Cargando especies...</div>;
  if (error) return <div>Error al cargar especies</div>;

  return (
    <Select value={selectedValue} onValueChange={handleEspecieChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Seleccionar especie" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">Todas</SelectItem>{" "}
          {/* Cambiamos value="" a value="all" */}
          {especies?.map((especie) => (
            <SelectItem
              key={especie.especie_id}
              value={especie.especie_id.toString()}
            >
              {especie.nombre_comun}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
