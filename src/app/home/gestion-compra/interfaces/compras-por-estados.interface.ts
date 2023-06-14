
export interface IntTableCompraEstadoResponse {
  status: boolean; 
  message: string;
  data: CompraResponse[];
}

export interface CompraResponse {
  id: number;
  user_id: number;
  proveedor_id: number;
  estado_id: number;
  serie: string;
  descuento?: any;
  iva?: any;
  subtotal?: any;
  total: number;
  fecha: string;
  status: string;
  created_at: any;
  updated_at: any;
  user: UserResponse;
  estado : EstadoResponse;
  proveedor: ProveedorResponse;
  detalle_compra: DetallecompraResponse [];
}

export interface EstadoResponse {
    id: number;
    detalle: string;
    estado: string;
}

export interface DetallecompraResponse {
  id: number;
  compra_id: number;
  producto_id: number;
  cantidad: number;
  precio: number;
  total: number;
  producto: ProductoResponse;
}

export interface ProductoResponse {
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

export interface ProveedorResponse  {
  id: number;
  ruc: string;
  razon_social: string;
  direccion: string;
  correo: string;
  celular: string;
  telefono: string;
  estado: string;
}

export interface UserResponse {
  id: number;
  persona_id: number;
  rol_id: number;
  name: string;
  email: string;
  email_verified_at?: any;
  created_at: string;
  updated_at: string;
  persona: PersonaResponse;
}

export interface PersonaResponse {
  id: number;
  cedula?: any;
  nombres: string;
  apellidos?: any;
  celular?: any;
  direccion?: any;
  estado: string;
}