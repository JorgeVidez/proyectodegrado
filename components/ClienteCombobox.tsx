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
import { useClientes } from "@/hooks/useClientes"; // Importa el hook

interface ClienteComboboxProps {
  label: string;
  value: number | undefined;
  onChange: (clienteId: number | undefined) => void;
}

export function ClienteCombobox({
  label,
  value,
  onChange,
}: ClienteComboboxProps) {
  const { clientes, isLoading, error } = useClientes();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const filteredClientes = React.useMemo(
    () =>
      clientes?.filter(
        (cliente) =>
          cliente.nombre?.toLowerCase().includes(query.toLowerCase()) ||
          cliente.identificacion_fiscal
            ?.toLowerCase()
            .includes(query.toLowerCase()) ||
          cliente.cliente_id?.toString().includes(query.toLowerCase())
      ) || [],
    [clientes, query]
  );

  const selectedCliente = React.useMemo(
    () => clientes?.find((cliente) => cliente.cliente_id === value),
    [clientes, value]
  );

  const handleSelect = (searchText: string) => {
    const selected = clientes?.find(
      (cliente) =>
        cliente.nombre?.toLowerCase() === searchText.toLowerCase() ||
        cliente.identificacion_fiscal?.toLowerCase() ===
          searchText.toLowerCase() ||
        cliente.cliente_id?.toString() === searchText
    );
    const clienteId = selected ? selected.cliente_id : undefined;
    onChange(clienteId);
    console.log(`${label} seleccionado/a:`, clienteId);
    setOpen(false);
  };

  if (isLoading) return <div>Cargando clientes...</div>;
  if (error) return <div>Error al cargar clientes</div>;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between overflow-hidden"
        >
          {selectedCliente?.nombre ||
            selectedCliente?.identificacion_fiscal ||
            `Seleccionar ${label}...`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 z-50 ">
        <Command>
          <CommandInput
            placeholder={`Buscar ${label} por nombre o ID`}
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No se encontraron clientes.</CommandEmpty>
            <CommandGroup>
              {filteredClientes.map((cliente) => (
                <CommandItem
                  key={cliente.cliente_id.toString()}
                  value={
                    cliente.nombre ||
                    cliente.identificacion_fiscal ||
                    cliente.cliente_id.toString()
                  }
                  onSelect={(value) => handleSelect(value)}
                >
                  {cliente.nombre}{" "}
                  {cliente.identificacion_fiscal
                    ? `(${cliente.identificacion_fiscal})`
                    : ""}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === cliente.cliente_id ? "opacity-100" : "opacity-0"
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
