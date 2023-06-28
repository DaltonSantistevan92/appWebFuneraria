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