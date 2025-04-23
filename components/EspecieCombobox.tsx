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
import { useEspecies, Especie } from "@/hooks/useEspecies";

interface EspecieComboboxProps {
  label: string;
  value: number | undefined;
  onChange: (especieId: number | undefined) => void;
}

export function EspecieCombobox({
  label,
  value,
  onChange,
}: EspecieComboboxProps) {
  const { especies, isLoading, error } = useEspecies();
  const [open, setOpen] = React.useState(false);

  if (isLoading) return <div>Cargando especies...</div>;
  if (error) return <div>Error al cargar especies</div>;

  const handleSelect = (especieId: string) => {
    const parsedId = especieId === "" ? undefined : parseInt(especieId);
    onChange(parsedId);
    console.log("Especie seleccionada:", parsedId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-fit justify-between"
        >
          {value
            ? especies?.find((especie) => especie.especie_id === value)
                ?.nombre_comun
            : `Seleccionar ${label}...`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 z-50 ">
        <Command>
          <CommandInput placeholder={`Buscar ${label}...`} />
          <CommandList>
            <CommandEmpty>No se encontraron especies.</CommandEmpty>
            <CommandGroup>
              {especies?.map((especie) => (
                <CommandItem
                  key={especie.especie_id.toString()}
                  value={especie.especie_id.toString()}
                  onSelect={handleSelect}
                >
                  {especie.nombre_comun} -{" "}
                  {especie.nombre_cientifico || "Sin nombre científico"}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === especie.especie_id ? "opacity-100" : "opacity-0"
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
