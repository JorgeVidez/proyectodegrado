// types/inventarioAnimal.ts

import { UbicacionOut } from "@/hooks/useUbicaciones";
import { AnimalOut } from "./animal";
import { LoteOut } from "@/hooks/useLotes";
import { ProveedorOut } from "./proveedor";

export enum MotivoIngreso {
  Nacimiento = "Nacimiento",
  Compra = "Compra",
  TrasladoInterno = "TrasladoInterno",
}

export enum MotivoEgreso {
  Venta = "Venta",
  Muerte = "Muerte",
  Descarte = "Descartado",
  TrasladoExterno = "TrasladoExterno",
}

export interface InventarioAnimalBase {
  animal_id: number;
  fecha_ingreso: string; // Cambiado a string para coincidir con la fecha en formato ISO (YYYY-MM-DD)
  motivo_ingreso: MotivoIngreso;
  proveedor_compra_id?: number | null;
  precio_compra?: number | null; // Cambiado a number | null para representar Optional[float]
  ubicacion_actual_id?: number | null;
  lote_actual_id?: number | null;
  fecha_egreso?: string | null; // Cambiado a string | null para coincidir con la fecha en formato ISO (YYYY-MM-DD)
  motivo_egreso?: MotivoEgreso | null;
}

export interface InventarioAnimalCreate extends InventarioAnimalBase {}

export interface InventarioAnimalUpdate extends InventarioAnimalBase {}

export interface InventarioAnimalOut extends InventarioAnimalBase {
  inventario_id: number;
  activo_en_finca: boolean;
  animal: AnimalOut;
  ubicacion_actual?: UbicacionOut | null;
  lote_actual?: LoteOut | null;
  proveedor_compra?: ProveedorOut | null;
}
