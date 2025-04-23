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
import { useRazas } from "@/hooks/useRazas";

interface RazaComboboxProps {
  label: string;
  value: number | undefined;
  onChange: (razaId: number | undefined) => void;
  especieId?: number;
}

export function RazaCombobox({
  label,
  value,
  onChange,
  especieId,
}: RazaComboboxProps) {
  const { razas, isLoading, error } = useRazas();
  const [open, setOpen] = React.useState(false);

  const filteredRazas = React.useMemo(() => {
    if (!razas) return [];
    if (especieId === undefined) return razas;
    return razas.filter((raza) => raza.especie_id === especieId);
  }, [razas, especieId]);

  const handleSelect = (nombreRaza: string) => {
    const selected = filteredRazas.find(
      (raza) => raza.nombre_raza.toLowerCase() === nombreRaza.toLowerCase()
    );
    const razaId = selected ? selected.raza_id : undefined;
    onChange(razaId);
    console.log("Raza seleccionada:", razaId);
    setOpen(false);
  };

  if (isLoading) return <div>Cargando razas...</div>;
  if (error) return <div>Error al cargar razas</div>;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full col-span-3 justify-between"
        >
          {value
            ? razas?.find((raza) => raza.raza_id === value)?.nombre_raza
            : `Seleccionar ${label}...`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 z-50">
        <Command>
          <CommandInput placeholder={`Buscar ${label}...`} />
          <CommandList>
            <CommandEmpty>No se encontraron razas.</CommandEmpty>
            <CommandGroup>
              {filteredRazas.map((raza) => (
                <CommandItem
                  key={raza.raza_id.toString()}
                  value={raza.nombre_raza}
                  onSelect={handleSelect}
                >
                  {raza.nombre_raza} -{" "}
                  {raza.especie?.nombre_comun || "Sin especie"}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === raza.raza_id ? "opacity-100" : "opacity-0"
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
