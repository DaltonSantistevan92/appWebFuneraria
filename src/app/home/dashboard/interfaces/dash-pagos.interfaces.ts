export interface IntDashPagos {
  pagos: PagosDash;
}

export interface PagosDash {
  labels: string[];
  data: number[];
  anio: string;
}