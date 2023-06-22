export interface IntTableVenta {
  status: boolean;
  message: string;
  data: Venta[];
}

export interface Venta {
  id: number;
  user_id?: any;
  cliente_id: number;
  estado_id: number;
  descuento?: any;
  subtotal: number;
  iva: number;
  total: number;
  serie: string;
  fecha_hora_entrega?: any;
  status: string;
  created_at: string;
  updated_at: string;
  cliente: Cliente;
  estado: Estados;
  detalle_venta: Detalleventa[];
}

export interface Estados {
    id: number;
    detalle : string;
    estado: string;
}

export interface Detalleventa {
  id: number;
  venta_id: number;
  producto_id?: number;
  servicio_id?: number;
  cantidad: number;
  precio: number;
  total: number;
  producto?: Producto;
  servicio?: Servicio;
}

export interface Servicio {
  id: number;
  categoria_id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  estado: string;
}

export interface Producto {
  id: number;
  categoria_id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  stock: number;
  precio_compra: number;
  precio_venta: number;
  margen_ganancia: number;
  fecha: string;
  promocion: string;
  precio_anterior: number;
  estado: string;
}

export interface Cliente {
  id: number;
  persona_id: number;
  estado: string;
  persona: Persona;
}

export interface Persona {
  id: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  celular: string;
  direccion: string;
  estado: string;
}