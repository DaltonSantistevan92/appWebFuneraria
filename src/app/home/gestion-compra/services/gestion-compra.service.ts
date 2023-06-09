import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { IntProv } from '../../catalogo-proveedor/interface/proveedor.interface';
import { IntProductoProveedor } from '../interfaces/producto-por-proveedor.interface';
import { DetalleCompraObject } from '../interfaces/detalle-compra-table.interface';

@Injectable({
  providedIn: 'root'
})
export class GestionCompraService {

  api = environment.apiUrl;
  http = inject(HttpClient);

  private cartDetalleCompra : BehaviorSubject<DetalleCompraObject[]> = new BehaviorSubject<DetalleCompraObject[]>([]);
  public currentDataCartDetalleCompra$ = this.cartDetalleCompra.asObservable();

  private totalSubject : BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalGeneralPrice$ = this.totalSubject.asObservable();

  private get getListCartDetalleCompra(): DetalleCompraObject[] {
    return this.cartDetalleCompra.getValue();
  }

  //Proveedores de Catalogo
  getProveedoresCatalogo(): Observable<IntProv>{
    const url = `${this.api}/mostrarProveedoresDeCatalago`;
    return this.http.get<IntProv>(url);
  }

  getProductosPorProveedores(proveedor_id: number): Observable<IntProductoProveedor>{
    const url = `${this.api}/productosPorProveedor/${proveedor_id}`;
    return this.http.get<IntProductoProveedor>(url);
  }

  agregarDetalleCompra(detalle: DetalleCompraObject): void {
    if (this.getListCartDetalleCompra.find(item => item.producto_id === detalle.producto_id)) {
      return;
    }
    this.getListCartDetalleCompra.push(detalle);
    this.cartDetalleCompra.next(this.getListCartDetalleCompra);
    this.actualizarTotales(this.getListCartDetalleCompra);
  }

  actualizarTotales(productoActual: DetalleCompraObject[]){
    this.totalSubject.next(this.calcularTotalGeneral(productoActual))
  }

  calcularTotalGeneral(productoActual: DetalleCompraObject[]): number {
    const total = productoActual.reduce((subTotal, producto) => subTotal + producto.cantidad * producto.precio, 0);
    return Number(total.toFixed(2));
  }

  getDetallesCompra(): Observable<DetalleCompraObject[]> {
    return this.currentDataCartDetalleCompra$;
  }

  aumentarCantidad(producto: DetalleCompraObject): void {
    const productoEnDetalle = this.getListCartDetalleCompra.find(item => item.producto_id === producto.producto_id);
    if (productoEnDetalle) {
      productoEnDetalle.cantidad++;
      productoEnDetalle.subTotal = Number((producto.cantidad * producto.precio).toFixed(2));
    }
    this.cartDetalleCompra.next(this.getListCartDetalleCompra);
    this.actualizarTotales(this.getListCartDetalleCompra);
  }

  disminuirCantidad(producto: DetalleCompraObject): void {
    const productoEnDetalle = this.getListCartDetalleCompra.find(item => item.producto_id === producto.producto_id);

    if (productoEnDetalle && productoEnDetalle.cantidad > 1) {
      productoEnDetalle.cantidad--;
      productoEnDetalle.subTotal = Number((producto.cantidad * producto.precio).toFixed(2));
    }
    this.cartDetalleCompra.next(this.getListCartDetalleCompra);
    this.actualizarTotales(this.getListCartDetalleCompra);
  }

  eliminarDetalleCompra(producto: DetalleCompraObject): void {
    const index = this.getListCartDetalleCompra.findIndex(item => item.producto_id === producto.producto_id);
    
    if (index != -1) {
      this.getListCartDetalleCompra[index].cantidad = 1;
      this.getListCartDetalleCompra.splice(index, 1);
    }
    this.cartDetalleCompra.next(this.getListCartDetalleCompra);
    this.actualizarTotales(this.getListCartDetalleCompra);
  }
  
}
