import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { IntPedidoEnProceso } from '../interfaces/asignacion-pedido.interface';
import { IntRepartidor } from '../interfaces/repartidor.interface';

@Injectable({
  providedIn: 'root'
})
export class AsignacionPedidosService {

  api = environment.apiUrl;
  http = inject(HttpClient);

  //table de venta o pedidos en proceso
  getPedidosEnProceso(): Observable<IntPedidoEnProceso>{
    const url = `${this.api}/verPedidosEnProceso`;
    return this.http.get<IntPedidoEnProceso>(url);
  }

  getRepartidor(): Observable<IntRepartidor>{
    const url = `${this.api}/listarRepartidor`;
    return this.http.get<IntRepartidor>(url);
  }

  saveAsignacion(data:any): Observable<any>{
    const url = `${this.api}/saveAsignacion`;
    return this.http.post<any>(url,data);
  }




  
}
