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
import { useLotes } from "@/hooks/useLotes"; // Importa el hook

interface LoteComboboxProps {
  label: string;
  value: number | null;
  onChange: (loteId: number | undefined) => void;
}

export function LoteCombobox({ label, value, onChange }: LoteComboboxProps) {
  const { lotes, isLoading, error } = useLotes();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const filteredLotes = React.useMemo(
    () =>
      lotes?.filter((lote) =>
        lote.codigo_lote?.toLowerCase().includes(query.toLowerCase())
      ) || [],
    [lotes, query]
  );

  const selectedLote = React.useMemo(
    () => lotes?.find((lote) => lote.lote_id === value),
    [lotes, value]
  );

  const handleSelect = (searchText: string) => {
    const selected = lotes?.find(
      (lote) =>
        lote.codigo_lote?.toLowerCase() === searchText.toLowerCase() ||
        lote.lote_id.toString() === searchText // También permite seleccionar por ID directamente
    );
    const loteId = selected ? selected.lote_id : undefined;
    onChange(loteId);
    console.log(`${label} seleccionado/a:`, loteId);
    setOpen(false);
  };

  if (isLoading) return <div>Cargando lotes...</div>;
  if (error) return <div>Error al cargar lotes</div>;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between overflow-hidden"
        >
          {selectedLote?.codigo_lote || `Seleccionar ${label}...`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 z-50 ">
        <Command>
          <CommandInput
            placeholder={`Buscar ${label} por código`}
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No se encontraron lotes.</CommandEmpty>
            <CommandGroup>
              {filteredLotes.map((lote) => (
                <CommandItem
                  key={lote.lote_id.toString()}
                  value={lote.codigo_lote || ""} // El valor a pasar a onSelect es el código del lote
                  onSelect={(value) => handleSelect(value)} // Pasa el código del lote a handleSelect
                >
                  {lote.codigo_lote}
                  {lote.proposito && ` (${lote.proposito})`}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === lote.lote_id ? "opacity-100" : "opacity-0"
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
