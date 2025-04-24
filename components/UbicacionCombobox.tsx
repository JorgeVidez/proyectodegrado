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
import { useUbicaciones } from "@/hooks/useUbicaciones"; // Importa el hook

interface UbicacionComboboxProps {
  label: string;
  value: number | null;
  onChange: (ubicacionId: number | undefined) => void;
}

export function UbicacionCombobox({
  label,
  value,
  onChange,
}: UbicacionComboboxProps) {
  const { ubicaciones, isLoading, error } = useUbicaciones();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const filteredUbicaciones = React.useMemo(
    () =>
      ubicaciones?.filter((ubicacion) =>
        ubicacion.nombre?.toLowerCase().includes(query.toLowerCase())
      ) || [],
    [ubicaciones, query]
  );

  const selectedUbicacion = React.useMemo(
    () => ubicaciones?.find((ubicacion) => ubicacion.ubicacion_id === value),
    [ubicaciones, value]
  );

  const handleSelect = (searchText: string) => {
    const selected = ubicaciones?.find(
      (ubicacion) =>
        ubicacion.nombre?.toLowerCase() === searchText.toLowerCase() ||
        ubicacion.ubicacion_id.toString() === searchText // También permite seleccionar por ID directamente
    );
    const ubicacionId = selected ? selected.ubicacion_id : undefined;
    onChange(ubicacionId);
    console.log(`${label} seleccionado/a:`, ubicacionId);
    setOpen(false);
  };

  if (isLoading) return <div>Cargando ubicaciones...</div>;
  if (error) return <div>Error al cargar ubicaciones</div>;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedUbicacion?.nombre || `Seleccionar ${label}...`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 z-50 ">
        <Command>
          <CommandInput
            placeholder={`Buscar ${label} por nombre`}
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No se encontraron ubicaciones.</CommandEmpty>
            <CommandGroup>
              {filteredUbicaciones.map((ubicacion) => (
                <CommandItem
                  key={ubicacion.ubicacion_id.toString()}
                  value={ubicacion.nombre || ""} // El valor a pasar a onSelect es el nombre
                  onSelect={(value) => handleSelect(value)} // Pasa el nombre del CommandItem a handleSelect
                >
                  {ubicacion.nombre}
                  {ubicacion.tipo && ` (${ubicacion.tipo})`}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === ubicacion.ubicacion_id
                        ? "opacity-100"
                        : "opacity-0"
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
