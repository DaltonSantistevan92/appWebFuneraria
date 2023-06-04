export interface IntCate {
  status: boolean;
  message: string;
  data: Categorias[];
}

export interface Categorias {
  id?: number;
  nombre_categoria: string;
  img: string;
  estado?: string;
}


//servicios
export interface IntSer {
  status: boolean;
  message: string;
  data: Servicio[];
}

export interface Servicio {
  id: number;
  categoria_id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  estado: string;
  categoria: Categorias;
}

export interface ServicioDescripcionModificado {
  id: number;
  categoria_id: number;
  nombre: string;
  descripcion: string[];
  precio: number;
  imagen: string;
  estado: string;
  categoria: Categorias;
}




