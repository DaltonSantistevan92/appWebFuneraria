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
}
