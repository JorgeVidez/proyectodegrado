// schemas/inventarioFormSchema.ts
import { z } from "zod";
import { MotivoIngreso, MotivoEgreso } from "@/types/inventarioAnimal";

export const inventarioFormSchema = z.object({
  animal_id: z.number().min(1, "Selecciona un animal"),
  fecha_ingreso: z.string().min(1, "La fecha es obligatoria"),
  motivo_ingreso: z.nativeEnum(MotivoIngreso),
  proveedor_compra_id: z.number().nullable().optional(),
  precio_compra: z.number().nullable().optional(),
  ubicacion_actual_id: z.number().nullable().optional(),
  lote_actual_id: z.number().nullable().optional(),
  fecha_egreso: z.string().nullable().optional(),
  motivo_egreso: z.nativeEnum(MotivoEgreso).nullable().optional(),
  activo_en_finca: z.boolean().optional(),
});

export type InventarioFormSchema = z.infer<typeof inventarioFormSchema>;
