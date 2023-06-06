export interface Catalogo {
    proveedor_id: number;
    producto_id: number;
}


export interface CatalogoRequest {
    catalogo: {
      producto_id: number;
      proveedor_id: number;
      precio: number;
    };
  }