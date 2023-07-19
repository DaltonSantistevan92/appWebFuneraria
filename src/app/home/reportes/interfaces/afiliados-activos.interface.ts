export interface IntAfiliadosActivos {
  status: boolean;
  message: string;
  data: AfiliadosActivos[];
}

export interface AfiliadosActivos {
  id: number;
  cliente_id: number;
  estado_civil_id: number;
  fecha: string;
  estado_id: number;
  facturado: string;
  created_at: string;
  updated_at: string;
  cliente: Cliente;
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
}


///

export interface IntResponseAfiliado {
  status: boolean;
  message: string;
  data: ResponseAfiliado[];
}

export interface ResponseAfiliado {
  afiliado_id: number;
  cliente: string;
  servicio_id: number;
  servicio: string;
  precio_servicio: number;
  monto_mensual: number;
  duracion_meses: number;
  letras_pagadas: string;
  letras_pendientes: string;
  monto_pendiente: number;
  monto_pagado: number;
  fecha_pagos: Fechapago[];
}

export interface Fechapago {
  id: number;
  afiliado_id: number;
  servicio_id: number;
  fecha_pago: string;
  isPagado: string;
}