export interface IntProductoProveedor {
  status: boolean;
  message: string;
  data: ProductoProveedor;
}

export interface ProductoProveedor {
  proveedor: Proveedor;
  producto: ProductoProveed[];
}

export interface ProductoProveed {
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

export interface Proveedor {
  id: number;
  ruc: string;
  razon_social: string;
  direccion: string;
  correo: string;
  celular: string;
  telefono: string;
  estado: string;
}