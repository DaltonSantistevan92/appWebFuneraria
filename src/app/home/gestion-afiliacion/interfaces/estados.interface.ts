export interface IntEst {
  status: boolean;
  message: string;
  data: Estado[];
}

export interface Estado{
  id: number;
  detalle: string;
  estado: string;
}