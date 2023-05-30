import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { IntEst } from '../interfaces/estados.interface';
import { IntAfiParEst } from '../interfaces/afiliados.interface';

@Injectable({
  providedIn: 'root'
})
export class AfilicacionService {

  api = environment.apiUrl;
  http = inject(HttpClient);

  getEstados(): Observable<IntEst>{
    const url = `${this.api}/estados`;
    return this.http.get<IntEst>(url);
  }

  getAfiliadoParamsEstado(estado_id:number): Observable<IntAfiParEst>{
    const url = `${this.api}/tableAfiliado/${estado_id}`;
    return this.http.get<IntAfiParEst>(url);
  }

  getSetEstadoAfiliado(afiliado_id : number, estado_id : number): Observable<any>{
    const url = `${this.api}/setEstadoAfiliado/${afiliado_id}/${estado_id}`;
    return this.http.get<any>(url);
  }

}
