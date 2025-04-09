// types/animal.ts

export interface EspecieOut {
  especie_id: number;
  nombre_comun: string;
}

export interface RazaOut {
  raza_id: number;
  nombre_raza: string;
}

export interface AnimalSimpleOut {
  animal_id: number;
  numero_trazabilidad: string;
  nombre_identificatorio?: string;
}

export enum EstadoAnimal {
  Activo = "Activo",
  Vendido = "Vendido",
  Muerto = "Muerto",
  Descartado = "Descartado",
}

export interface AnimalOut {
  animal_id: number;
  numero_trazabilidad: string;
  nombre_identificatorio?: string;
  especie: EspecieOut;
  raza: RazaOut;
  sexo: string;
  fecha_nacimiento?: string; // Fecha en formato string (ISO 8601)
  madre?: AnimalSimpleOut;
  padre?: AnimalSimpleOut;
  estado_actual: EstadoAnimal;
  fecha_registro: string; // Fecha y hora en formato string (ISO 8601)
  observaciones_generales?: string;
}

export interface AnimalBase {
  numero_trazabilidad: string;
  nombre_identificatorio?: string;
  especie_id: number;
  raza_id: number;
  sexo: string;
  fecha_nacimiento?: string;
  madre_id?: number;
  padre_id?: number;
  estado_actual: EstadoAnimal;
  observaciones_generales?: string;
}

export interface AnimalCreate extends AnimalBase {}

export interface AnimalUpdate extends AnimalBase {}
