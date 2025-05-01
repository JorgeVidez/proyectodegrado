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
import { useProveedores } from "@/hooks/useProveedores"; // Importa el hook

interface ProveedorComboboxProps {
  label: string;
  value: number | null;
  onChange: (proveedorId: number | undefined) => void;
}

export function ProveedorCombobox({
  label,
  value,
  onChange,
}: ProveedorComboboxProps) {
  const { proveedores, isLoading, error } = useProveedores();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const filteredProveedores = React.useMemo(
    () =>
      proveedores?.filter(
        (proveedor) =>
          proveedor.nombre?.toLowerCase().includes(query.toLowerCase()) ||
          proveedor.identificacion_fiscal
            ?.toLowerCase()
            .includes(query.toLowerCase())
      ) || [],
    [proveedores, query]
  );

  const selectedProveedor = React.useMemo(
    () => proveedores?.find((proveedor) => proveedor.proveedor_id === value),
    [proveedores, value]
  );

  const handleSelect = (searchText: string) => {
    const selected = proveedores?.find(
      (proveedor) =>
        proveedor.nombre?.toLowerCase() === searchText.toLowerCase() ||
        proveedor.identificacion_fiscal?.toLowerCase() ===
          searchText.toLowerCase() ||
        proveedor.proveedor_id.toString() === searchText // También permite seleccionar por ID directamente
    );
    const proveedorId = selected ? selected.proveedor_id : undefined;
    onChange(proveedorId);
    console.log(`${label} seleccionado/a:`, proveedorId);
    setOpen(false);
  };

  if (isLoading) return <div>Cargando proveedores...</div>;
  if (error) return <div>Error al cargar proveedores</div>;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full  justify-between overflow-hidden"
        >
          {selectedProveedor?.nombre || `Seleccionar ${label}...`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 z-50 ">
        <Command>
          <CommandInput
            placeholder={`Buscar ${label} por nombre o identificación`}
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No se encontraron proveedores.</CommandEmpty>
            <CommandGroup>
              {filteredProveedores.map((proveedor) => (
                <CommandItem
                  key={proveedor.proveedor_id.toString()}
                  value={proveedor.nombre || ""} // El valor a pasar a onSelect es el nombre
                  onSelect={(value) => handleSelect(value)} // Pasa el nombre del CommandItem a handleSelect
                >
                  {proveedor.nombre}
                  {proveedor.identificacion_fiscal &&
                    ` (${proveedor.identificacion_fiscal})`}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === proveedor.proveedor_id
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
