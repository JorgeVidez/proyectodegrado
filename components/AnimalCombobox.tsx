"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAnimales } from "@/hooks/useAnimales"; // Importa el hook y la interfaz

interface AnimalComboboxProps {
  label: string;
  value: number | undefined;
  onChange: (animalId: number | undefined) => void;
}

export function AnimalCombobox({
  label,
  value,
  onChange,
}: AnimalComboboxProps) {
  const { animales, isLoading, error } = useAnimales();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  // Llamada a useMemo incondicionalmente
  const filteredAnimales = React.useMemo(
    () =>
      animales?.filter(
        (animal) =>
          animal.numero_trazabilidad
            ?.toLowerCase()
            .includes(query.toLowerCase()) ||
          animal.nombre_identificatorio
            ?.toLowerCase()
            .includes(query.toLowerCase())
      ) || [],
    [animales, query]
  );

  // Llamada a useMemo incondicionalmente
  const selectedAnimal = React.useMemo(
    () => animales?.find((animal) => animal.animal_id === value),
    [animales, value]
  );

  const handleSelect = (searchText: string) => {
    const selected = animales?.find(
      (animal) =>
        animal.numero_trazabilidad?.toLowerCase() ===
          searchText.toLowerCase() ||
        animal.nombre_identificatorio?.toLowerCase() ===
          searchText.toLowerCase() ||
        animal.animal_id.toString() === searchText // También permite seleccionar por ID directamente
    );
    const animalId = selected ? selected.animal_id : undefined;
    onChange(animalId);
    console.log(`${label} seleccionado/a:`, animalId);
    setOpen(false);
  };

  if (isLoading) return <div>Cargando animales...</div>;
  if (error) return <div>Error al cargar animales</div>;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full col-span-3 justify-between"
        >
          {selectedAnimal?.numero_trazabilidad ||
            selectedAnimal?.nombre_identificatorio ||
            `Seleccionar ${label}...`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 z-50 ">
        <Command>
          <CommandInput
            placeholder={`Buscar ${label} por trazabilidad`}
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No se encontraron animales.</CommandEmpty>
            <CommandGroup>
              {filteredAnimales.map((animal) => (
                <CommandItem
                  key={animal.animal_id.toString()}
                  value={
                    animal.numero_trazabilidad ||
                    animal.nombre_identificatorio ||
                    ""
                  } // El valor a pasar a onSelect es el texto a buscar
                  onSelect={(value) => handleSelect(value)} // Pasa el valor del CommandItem a handleSelect
                >
                  {animal.numero_trazabilidad} -{" "}
                  {animal.nombre_identificatorio || "Sin nombre"}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === animal.animal_id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
