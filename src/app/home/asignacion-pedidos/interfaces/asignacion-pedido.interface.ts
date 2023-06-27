export interface IntPedidoEnProceso {
  status: boolean;
  message: string;
  data: PedidoEnProceso[];
}

export interface PedidoEnProceso {
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
  created_at: string;
  updated_at: string;
  user: User;
  cliente: Cliente;
  estado: Estado;
  venta_ubicacion: Ventaubicacion[];
  detalle_venta: Detalleventa[];
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

export interface Estado {
  id: number;
  detalle: string;
  estado: string;
}

export interface Cliente {
  id: number;
  persona_id: number;
  estado: string;
  persona: Persona2;
}

export interface Persona2 {
  id: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  celular: string;
  direccion: string;
  estado: string;
}

export interface User {
  id: number;
  persona_id: number;
  rol_id: number;
  name: string;
  email: string;
  email_verified_at?: any;
  created_at: string;
  updated_at: string;
  persona: Persona;
}

export interface Persona {
  id: number;
  cedula?: any;
  nombres: string;
  apellidos?: any;
  celular?: any;
  direccion?: any;
  estado: string;
}