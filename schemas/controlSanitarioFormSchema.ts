// schemas/controlSanitarioFormSchema.ts
import { z } from "zod";

export const controlSanitarioFormSchema = z.object({
  animal_id: z.number().min(1, "Animal es obligatorio"),
  fecha_control: z.string().optional(),
  peso_kg: z.number().optional().nullable(),
  condicion_corporal: z.number().optional().nullable(),
  altura_cm: z.number().optional().nullable(),
  responsable_id: z.number().optional().nullable(),
  ubicacion_id: z.number().optional().nullable(),
  observaciones: z.string().optional().nullable(),
});

export type ControlSanitarioFormSchema = z.infer<
  typeof controlSanitarioFormSchema
>;
