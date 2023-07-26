import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { IntProductoMasVendido } from '../../interfaces/productoMasVendido.interface';

@Injectable({
  providedIn: 'root'
})
export class ProdMasVendidosService {
  api = environment.apiUrl;
  http = inject(HttpClient);

  getProductoMasVendidos(fecha_inicio:string,fecha_fin:string): Observable<IntProductoMasVendido>{
    const url = `${this.api}/productoMasVendidos/${fecha_inicio}/${fecha_fin}`;
    return this.http.get<IntProductoMasVendido>(url);
  }



  
}
