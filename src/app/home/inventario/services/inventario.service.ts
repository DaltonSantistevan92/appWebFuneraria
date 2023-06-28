import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { IntInventario } from '../interfaces/inventario.interface';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  api = environment.apiUrl;
  http = inject(HttpClient);

  
  getKardex(producto_id: number, fecha_inicio: string, fecha_fin:string): Observable<IntInventario>{
    const url = `${this.api}/kardex/${producto_id}/${fecha_inicio}/${fecha_fin}`;
    return this.http.get<IntInventario>(url);
  }

  
}
