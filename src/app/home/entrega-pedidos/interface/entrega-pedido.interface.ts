export interface IntAsigPedido {
  status: boolean;
  message: string;
  data: AsigPedido[];
}

export interface AsigPedido {
  id: number;
  repartidor_id: number;
  venta_id: number;
  venta: Venta;
}

export interface Venta {
  id: number;
  user_id: number;
  cliente_id: number;
  estado_id: number;
  descuento?: any;
  subtotal: number;
  iva: number;
  total: number;
  serie: string;
  fecha_hora_entrega?: any;
  status: string;
  asignado: string;
  created_at: string;
  updated_at: string;
  cliente: Cliente;
  venta_ubicacion: Ventaubicacion[];
  detalle_venta: Detalleventa[];
}

export interface Detalleventa {
  id: number;
  venta_id: number;
  producto_id?: number | number;
  servicio_id?: (null | number)[];
  cantidad: number;
  precio: number;
  total: number;
  producto?: Producto | Producto;
  servicio?: (Servicio | null)[];
}

export interface Servicio {
  id: number;
  categoria_id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  estado: string;
  categoria: Categoria;
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
  categoria: Categoria;
}

export interface Categoria {
  id: number;
  nombre_categoria: string;
  img: string;
  estado: string;
}

export interface Ventaubicacion {
  id: number;
  venta_id: number;
  provincia_id: number;
  canton: string;
  parroquia: string;
  latitud: number;
  longitud: number;
  provincia: Provincia;
}

export interface Provincia {
  id: number;
  provincia: string;
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