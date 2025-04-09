// types/cliente.ts

export interface ClienteBase {
  nombre: string;
  identificacion_fiscal?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
}

export interface ClienteCreate extends ClienteBase {}

export interface ClienteUpdate extends ClienteBase {}

export interface ClienteOut extends ClienteBase {
  cliente_id: number;
  fecha_creacion: string; // Fecha en formato string (ISO 8601)
  fecha_actualizacion?: string;
}
