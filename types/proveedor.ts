// types/proveedor.ts

export interface ProveedorBase {
  nombre: string;
  identificacion_fiscal?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  persona_contacto?: string;
  tipo_proveedor?: string;
}

export interface ProveedorCreate extends ProveedorBase {}

export interface ProveedorUpdate extends ProveedorBase {}

export interface ProveedorOut extends ProveedorBase {
  proveedor_id: number;
  fecha_creacion: string; // Fecha en formato string (ISO 8601)
  fecha_actualizacion?: string;
}
