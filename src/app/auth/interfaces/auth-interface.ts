export interface IntAuth {
    status: boolean;
    message: string;
    token: string;
}


export interface IntDataUser {
    email: string;
    password: string;
}


export interface IntPayload {
  iss?: string;
  iat?: number;
  exp?: number;
  nbf?: number;
  jti?: string;
  sub?: string;
  prv?: string;
  user: User;
  menu: Menu[];
}

export interface Menu {
  id: number;
  nombre: string;
  icono: string;
  url: string;
  menus_hijos: Menushijo[];
}

export interface Menushijo {
  id: number;
  nombre: string;
  icono: string;
  url: string;
  id_seccion: number;
}

export interface User {
  id: number;
  persona_id: number;
  rol_id: number;
  name: string;
  email: string;
  email_verified_at?: any;
  imagen?: string;//
  created_at?: string;
  updated_at?: string;
  estado?: string;//
  rol: Rol;
  persona: Persona;
}

export interface Persona {
  id: number;
  cedula?: any;
  nombres: string;
  apellidos: string;
  celular?: any;
  direccion?: any;
  estado: string;
  repartidor?: Repartidor[]; 
}

export interface Repartidor {
  id: number;
  persona_id: number;
  disponible : string;
  estado: string;
}

export interface Rol {
  id: number;
  cargo: string;
  estado: string;
}
