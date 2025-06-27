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
import { useMedicamentos } from "@/hooks/useMedicamentos";

interface MedicamentoComboboxProps {
  label: string;
  value: number | undefined;
  onChange: (medicamentoId: number | undefined) => void;
}

export function MedicamentoCombobox({
  label,
  value,
  onChange,
}: MedicamentoComboboxProps) {
  const { medicamentos, isLoading, error } = useMedicamentos();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const filteredMedicamentos = React.useMemo(
    () =>
      medicamentos?.filter(
        (medicamento) =>
          medicamento.nombre_comercial
            ?.toLowerCase()
            .includes(query.toLowerCase()) ||
          medicamento.principio_activo
            ?.toLowerCase()
            .includes(query.toLowerCase()) ||
          medicamento.laboratorio?.toLowerCase().includes(query.toLowerCase())
      ) || [],
    [medicamentos, query]
  );

  const selectedMedicamento = React.useMemo(
    () => medicamentos?.find((med) => med.medicamento_id === value),
    [medicamentos, value]
  );

  const handleSelect = (searchText: string) => {
    // Opcional: añade logs para depuración si el problema persiste
    console.log("searchText recibido:", searchText);

    const trimmedSearchText = searchText.toLowerCase().trim(); // Normalizamos el texto de búsqueda

    const selected = medicamentos?.find((med) => {
      // Normalizamos cada campo del medicamento antes de comparar
      const trimmedNombreComercial = med.nombre_comercial?.toLowerCase().trim();
      const trimmedPrincipioActivo = med.principio_activo?.toLowerCase().trim();

      const match =
        trimmedNombreComercial === trimmedSearchText ||
        trimmedPrincipioActivo === trimmedSearchText ||
        med.medicamento_id.toString() === trimmedSearchText; // Esta es poco probable que coincida con texto

      // Opcional: logs de depuración para ver cada comparación
      // console.log(`  Comparando '${trimmedSearchText}' con:`);
      // console.log(`    Nombre Comercial ('${trimmedNombreComercial}'): ${trimmedNombreComercial === trimmedSearchText}`);
      // console.log(`    Principio Activo ('${trimmedPrincipioActivo}'): ${trimmedPrincipioActivo === trimmedSearchText}`);
      // console.log(`    ID ('${med.medicamento_id.toString()}'): ${med.medicamento_id.toString() === trimmedSearchText}`);
      // console.log(`  Resultado de la iteración: ${match}`);

      return match;
    });

    console.log("Medicamento seleccionado:", selected); // Verifica el resultado de la búsqueda

    const medicamentoId = selected ? selected.medicamento_id : undefined;
    onChange(medicamentoId);
    console.log(`${label} seleccionado:`, medicamentoId); // Ahora debería mostrar un ID si se encuentra
    setOpen(false);
  };

  if (isLoading) return <div>Cargando medicamentos...</div>;
  if (error) return <div>Error al cargar medicamentos</div>;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between overflow-hidden"
        >
          {selectedMedicamento?.nombre_comercial ||
            selectedMedicamento?.principio_activo ||
            `Seleccionar ${label}...`}
          <ChevronsUpDown className=" opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 z-50">
        <Command>
          <CommandInput
            placeholder={`Buscar ${label} por nombre o principio activo`}
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No se encontraron medicamentos.</CommandEmpty>
            <CommandGroup>
              {filteredMedicamentos.map((medicamento) => (
                <CommandItem
                  key={medicamento.medicamento_id.toString()}
                  value={
                    medicamento.nombre_comercial ||
                    medicamento.principio_activo ||
                    ""
                  }
                  onSelect={(value) => handleSelect(value)}
                >
                  {medicamento.nombre_comercial}
                  {medicamento.principio_activo && (
                    <span className="text-muted-foreground ml-2">
                      ({medicamento.principio_activo})
                    </span>
                  )}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === medicamento.medicamento_id
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
