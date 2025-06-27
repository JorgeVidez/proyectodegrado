// schemas/vacunacionFormSchema.ts
import { z } from "zod";

export const vacunacionFormSchema = z.object({
  animal_id: z.number().min(1, "Animal obligatorio"),
  fecha_aplicacion: z.string().min(1, "Fecha requerida"),
  tipo_vacuna_id: z.number().min(1, "Tipo vacuna requerido"),
  dosis_aplicada: z.number().optional().nullable(),
  unidad_dosis: z.string().optional().nullable(),
  lote_vacuna: z.string().optional().nullable(),
  fecha_vencimiento_lote: z.string().optional().nullable(),
  proveedor_vacuna_id: z.number().optional().nullable(),
  responsable_aplicacion_id: z.number().optional().nullable(),
  proxima_vacunacion_sugerida: z.string().optional().nullable(),
  observaciones: z.string().optional().nullable(),
});

export type VacunacionFormSchema = z.infer<typeof vacunacionFormSchema>;
