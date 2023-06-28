// export interface IntKPIPedidoEstado {
//   status: boolean;
//   message: string;
//   data: KPIPedidoEstado;
// }

// export interface KPIPedidoEstado {
//   labels: string[];
//   count: number[];
//   porcentaje: number[];
//   colors: string[];
// }


export interface IntKPIPedidoEstado {
  status: boolean;
  message: string;
  series: Series[];
}

export interface Series {
  name: string;
  points: Point[];
}

export interface Point {
  name: string;
  y: number;
}