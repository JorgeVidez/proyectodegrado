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
import { useAnimales } from "@/hooks/useAnimales";
import { AnimalSimpleOut } from "@/types/animal";

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

  if (isLoading) return <div>Cargando animales...</div>;
  if (error) return <div>Error al cargar animales</div>;

  const handleSelect = (animalId: string) => {
    const parsedId = animalId === "" ? undefined : parseInt(animalId);
    onChange(parsedId);
    console.log("Animal seleccionado:", parsedId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-64 justify-between"
        >
          {value
            ? animales?.find((animal) => animal.animal_id === value)
                ?.numero_trazabilidad
            : `Seleccionar ${label}...`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 ">
        <Command>
          <CommandInput placeholder={`Buscar ${label}...`} />
          <CommandList>
            <CommandEmpty>No se encontraron animales.</CommandEmpty>
            <CommandGroup>
              {animales?.map((animal) => (
                <CommandItem
                  key={animal.animal_id.toString()}
                  value={animal.animal_id.toString()}
                  onSelect={handleSelect}
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
