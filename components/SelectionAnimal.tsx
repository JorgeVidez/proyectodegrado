"use client";

import * as React from "react";
import { useAnimales } from "@/hooks/useAnimales";
import { AnimalOut } from "@/types/animal";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  onChange: (selectedId: number | null) => void;
  value?: number | null;
};

export const SelectionAnimal: React.FC<Props> = ({ onChange, value }) => {
  const [open, setOpen] = React.useState(false);
  const { animales, isLoading } = useAnimales();

  const selectedAnimal = animales?.find((a) => a.animal_id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedAnimal
            ? `${selectedAnimal.numero_trazabilidad} - ${selectedAnimal.nombre_identificatorio}`
            : "Seleccionar animal..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar animal..." />
          <CommandEmpty>No se encontraron animales.</CommandEmpty>
          <CommandGroup>
            {!isLoading &&
              animales?.map((animal) => (
                <CommandItem
                  key={animal.animal_id}
                  onSelect={() => {
                    onChange(animal.animal_id);
                    setOpen(false);
                  }}
                  value={animal.animal_id.toString()}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === animal.animal_id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {animal.numero_trazabilidad} - {animal.nombre_identificatorio}
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
