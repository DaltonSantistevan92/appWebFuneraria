export interface IntProductoMasVendido {
  status: boolean;
  message: string;
  data: ProductoMasVendido[];
}

export interface ProductoMasVendido {
  producto: ProductoMas;
  cantidad: number;
  total: number;
}

export interface ProductoMas {
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
  categoria: CategoriaMas;
}

export interface CategoriaMas {
  id: number;
  nombre_categoria: string;
  img: string;
  pertenece: string;
  estado: string;
}