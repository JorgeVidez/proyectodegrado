// schemas/animalFormSchema.ts
import { z } from "zod";
import { EstadoAnimal } from "@/types/animal";

export const animalFormSchema = z.object({
  numero_trazabilidad: z.string().min(1, "Campo obligatorio"),
  nombre_identificatorio: z.string().optional(),
  especie_id: z.number().min(1),
  raza_id: z.number().min(1),
  sexo: z.enum(["M", "H"]),
  fecha_nacimiento: z.string().optional(),
  madre_id: z.number().optional(),
  padre_id: z.number().optional(),
  estado_actual: z.nativeEnum(EstadoAnimal),
  observaciones_generales: z.string().optional(),
});

export type AnimalFormSchema = z.infer<typeof animalFormSchema>;
