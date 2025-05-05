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
import { useTipoAlimentos } from "@/hooks/useTipoAlimentos"; // Importa el hook

interface TipoAlimentoComboboxProps {
  label: string;
  value: number | undefined;
  onChange: (tipoAlimentoId: number | undefined) => void;
}

export function TipoAlimentoCombobox({
  label,
  value,
  onChange,
}: TipoAlimentoComboboxProps) {
  const { tiposAlimento, isLoading, error } = useTipoAlimentos();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  // Filtrar tipos de alimento basado en la búsqueda
  const filteredTiposAlimento = React.useMemo(
    () =>
      tiposAlimento?.filter(
        (tipoAlimento) =>
          tipoAlimento.nombre.toLowerCase().includes(query.toLowerCase()) ||
          tipoAlimento.descripcion?.toLowerCase().includes(query.toLowerCase())
      ) || [],
    [tiposAlimento, query]
  );

  // Encontrar el tipo de alimento seleccionado actualmente
  const selectedTipoAlimento = React.useMemo(
    () =>
      tiposAlimento?.find(
        (tipoAlimento) => tipoAlimento.tipo_alimento_id === value
      ),
    [tiposAlimento, value]
  );

  const handleSelect = (searchText: string) => {
    const selected = tiposAlimento?.find(
      (tipoAlimento) =>
        tipoAlimento.nombre.toLowerCase() === searchText.toLowerCase() ||
        tipoAlimento.tipo_alimento_id.toString() === searchText // También permite seleccionar por ID directamente
    );
    const tipoAlimentoId = selected ? selected.tipo_alimento_id : undefined;
    onChange(tipoAlimentoId);
    console.log(`${label} seleccionado/a:`, tipoAlimentoId);
    setOpen(false);
  };

  if (isLoading) return <div>Cargando tipos de alimento...</div>;
  if (error) return <div>Error al cargar tipos de alimento: {error}</div>;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between overflow-hidden"
        >
          {selectedTipoAlimento?.nombre || `Seleccionar ${label}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
            <CommandEmpty>No se encontraron tipos de alimento.</CommandEmpty>
            <CommandGroup>
              {filteredTiposAlimento.map((tipoAlimento) => (
                <CommandItem
                  key={tipoAlimento.tipo_alimento_id.toString()}
                  value={tipoAlimento.nombre || ""}
                  onSelect={(value) => handleSelect(value)}
                >
                  {tipoAlimento.nombre}
                  {tipoAlimento.unidad_medida &&
                    ` (${tipoAlimento.unidad_medida})`}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === tipoAlimento.tipo_alimento_id
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
