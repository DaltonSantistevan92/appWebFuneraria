export interface IntRepartidor {
  status: boolean;
  message: string;
  data: Repartidor[];
}

export interface Repartidor {
  id: number;
  persona_id: number;
  disponible: string;
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