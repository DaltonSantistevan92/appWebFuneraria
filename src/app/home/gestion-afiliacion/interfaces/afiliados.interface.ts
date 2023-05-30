export interface IntAfiParEst {
  status: boolean;
  message: string;
  data: Afiliado[];
}

export interface Afiliado {
  id: number;
  cliente_id: number;
  estado_civil_id: number;
  fecha: string;
  estado_id: number;
  facturado: string;
  created_at: string;
  updated_at: string;
  cliente: Cliente;
  estado_civil: Estadocivil;
  estado: Estado;
  contacto_emergencia: Contactoemergencia[];
  detalle_afiliado: Detalleafiliado[];
}

export interface Detalleafiliado {
  id: number;
  afiliado_id: number;
  servicio_id: number;
  duracion_mes_id: number;
  costo_mensual: number;
  servicio: Servicio;
  duracion_mes: Duracionmes;
}

export interface Duracionmes {
  id: number;
  duracion: number;
  estado: string;
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

export interface Categoria {
  id: number;
  nombre_categoria: string;
  img: string;
  estado: string;
}

export interface Contactoemergencia {
  id: number;
  afiliado_id: number;
  parentesco_id: number;
  nombre: string;
  num_celular: string;
  parentesco: Parentesco;
}

export interface Parentesco {
  id: number;
  relacion: string;
  estado: string;
}

export interface Estado {
  id: number;
  detalle: string;
  estado: string;
}

export interface Estadocivil {
  id: number;
  status: string;
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
  user : User[];
}

export interface User {
  id: number;
  persona_id: number;
  rol_id: number;
  name: string;
  email: string;
  email_verified_at: null;
  created_at: string;
  updated_at: string;
}

