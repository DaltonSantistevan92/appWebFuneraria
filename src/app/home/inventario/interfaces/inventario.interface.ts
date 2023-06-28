export interface IntInventario {
  status: boolean;
  message: string;
  data: Inventario[];
}

export interface Inventario {
  numero: number;
  fecha: string;
  tipo: string;
  entrada_cantidad: number | string;
  entrada_precio: number | string;
  entrada_total: number | string;
  salida_cantidad: number | string;
  salida_precio: number | string;
  salida_total: number | string;
  disponible_cantidad: number;
  disponible_precio: number;
  disponible_total: number;
}