import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { IntTableVenta } from '../interfaces/pedidos.interface';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  api = environment.apiUrl;
  http = inject(HttpClient);

  //table de consulta de venta filtrado por estado_id
  getVentasxEstados(estado_id: number): Observable<IntTableVenta>{
    const url = `${this.api}/tableVentas/${estado_id}`;
    return this.http.get<IntTableVenta>(url);
  }

  getSetEstadoVenta(venta_id : number, estado_id : number): Observable<any>{
    const url = `${this.api}/setEstadoVenta/${venta_id}/${estado_id}`;
    return this.http.get<any>(url);
  }

  
}
