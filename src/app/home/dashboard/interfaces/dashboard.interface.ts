export interface IntDashCompraVenta {
  compra: CompraDash;
  venta: VentaDash;
}

export interface CompraDash {
  labels: string[];
  data: number[];
  anio: string;
}

export interface VentaDash {
    labels: string[];
    data: number[];
    anio: string;
}

//afiliados cantidad activos y inactivos
export interface IntAfiliadosInactivosAndActivos {
  status: boolean;
  message: string;
  data: AfiliadosInactivosAndActivos;
}

export interface AfiliadosInactivosAndActivos {
  nombre: string;
  cantidad_activos: number;
  cantidad_inactivos: number;
}

// totales generales de compra"recibida" y venta(pedido)"entregada"
export interface IntCompraVentaTotales {
  status: boolean;
  message: string;
  data: CompraVentaTotales;
}

export interface CompraVentaTotales {
  compra: number;
  venta: number;
}