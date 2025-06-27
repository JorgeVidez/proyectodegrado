// schemas/movimientoAnimalFormSchema.ts
import { z } from "zod";
import { TipoMovimiento } from "@/hooks/useMovimientosAnimal";

export const movimientoAnimalFormSchema = z.object({
  animal_id: z.number().min(1, "Selecciona un animal"),
  tipo_movimiento: z.nativeEnum(TipoMovimiento),
  origen_ubicacion_id: z.number().optional().nullable(),
  destino_ubicacion_id: z.number().optional().nullable(),
  origen_lote_id: z.number().optional().nullable(),
  destino_lote_id: z.number().optional().nullable(),
  proveedor_id: z.number().optional().nullable(),
  cliente_id: z.number().optional().nullable(),
  documento_referencia: z.string().optional().nullable(),
  usuario_id: z.number().optional().nullable(),
  observaciones: z.string().optional().nullable(),
});

export type MovimientoAnimalFormSchema = z.infer<
  typeof movimientoAnimalFormSchema
>;
