export interface IntProducto {
  status: boolean;
  message: string;
  data: ProductoResponse[];
}

export interface ProductoResponse {
  id: number;
  categoria_id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  stock: number;
  precio_compra?: number;
  precio_venta: number;
  margen_ganancia?: number;
  fecha: string;
  promocion: string;
  precio_anterior?: number;
  estado: string;
  categoria: CategoriaResponse;
}

export interface CategoriaResponse {
  id: number;
  nombre_categoria: string;
  img: string;
  estado: string;
}