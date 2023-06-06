export interface IntProv {
  status: boolean;
  message: string;
  data: Proveedor[];
}

export interface Proveedor {
  id?: number;
  ruc: string;
  razon_social: string;
  direccion: string;
  correo: string;
  celular: string;
  telefono: string;
  estado?: string;
}
