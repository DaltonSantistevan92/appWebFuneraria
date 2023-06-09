import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { IntAsigPedido } from '../interface/entrega-pedido.interface';

@Injectable({
  providedIn: 'root'
})
export class EntregaPedidoService {

  api = environment.apiUrl;
  http = inject(HttpClient);
  
  getPedidosAsignados(repartidor_id:number): Observable<IntAsigPedido>{
    const url = `${this.api}/verPedidosAsignados/${repartidor_id}`;
    return this.http.get<IntAsigPedido>(url);
  }

  setPedidosEntregado(asignacion_venta_repartidor_id:number,repartidor_id:number): Observable<{status :boolean; message: string}>{
    const url = `${this.api}/pedidosEntregado/${asignacion_venta_repartidor_id}/${repartidor_id}`;
    return this.http.get<{status :boolean; message: string}>(url);
  }

  
}
