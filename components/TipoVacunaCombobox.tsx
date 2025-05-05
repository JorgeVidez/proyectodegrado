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

import { useTipoVacunas } from "@/hooks/useTipoVacunas";

interface TipoVacunaComboboxProps {
  label: string;
  value: number | undefined;
  onChange: (tipoVacunaId: number | undefined) => void;
}

export function TipoVacunaCombobox({
  label,
  value,
  onChange,
}: TipoVacunaComboboxProps) {
  const { tiposVacuna, isLoading, error } = useTipoVacunas();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const filteredTipos = React.useMemo(
    () =>
      tiposVacuna?.filter((tv) =>
        tv.nombre_vacuna.toLowerCase().includes(query.toLowerCase())
      ) || [],
    [tiposVacuna, query]
  );

  const selectedTipo = React.useMemo(
    () => tiposVacuna?.find((tv) => tv.tipo_vacuna_id === value),
    [tiposVacuna, value]
  );

  const handleSelect = (searchText: string) => {
    const selected = tiposVacuna?.find(
      (tv) =>
        tv.nombre_vacuna.toLowerCase() === searchText.toLowerCase() ||
        tv.tipo_vacuna_id.toString() === searchText
    );
    const tipoVacunaId = selected ? selected.tipo_vacuna_id : undefined;
    onChange(tipoVacunaId);
    console.log(`${label} seleccionada:`, tipoVacunaId);
    setOpen(false);
  };

  if (isLoading) return <div>Cargando tipos de vacuna...</div>;
  if (error) return <div>Error al cargar tipos de vacuna</div>;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full  justify-between overflow-hidden"
        >
          {selectedTipo?.nombre_vacuna || `Seleccionar ${label}...`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 z-50">
        <Command>
          <CommandInput
            placeholder={`Buscar ${label}`}
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No se encontraron tipos de vacuna.</CommandEmpty>
            <CommandGroup>
              {filteredTipos.map((tipo) => (
                <CommandItem
                  key={tipo.tipo_vacuna_id}
                  value={tipo.nombre_vacuna}
                  onSelect={handleSelect}
                >
                  {tipo.nombre_vacuna}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === tipo.tipo_vacuna_id
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
