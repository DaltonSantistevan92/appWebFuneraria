/* export interface IntCompraResponse {

} */

export interface IntDataRequestCompra {
    compra: IntCompraReq;
    detalle_compra: DetalleCompraForm[];
}

export interface IntCompraReq {
    user_id: number;
    proveedor_id: number;
    total: number; 
}

//
export interface IntFormCompra {
    user_id: number;
    name_user: string;
    cargo: string;
    fecha_compra: string;
    producto_id: number;
    cantidad: string;
    proveedor_id: number;
    total: number;
    razon_social: string;
    ruc: string;
    correo: string;
    celular: string;
    nombre_producto: string;
    precio_compra: string;
    detalle_compra: DetalleCompraForm[];
  }


  export interface DetalleCompraForm {
    producto_id: number;
    nombre_producto: string;
    cantidad: number;
    precio: number;
    subTotal: number;
  }
