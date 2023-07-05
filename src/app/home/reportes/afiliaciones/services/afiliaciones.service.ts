import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { IntAfiliadosActivos, IntResponseAfiliado } from '../../interfaces/afiliados-activos.interface';

@Injectable({
  providedIn: 'root'
})
export class AfiliacionesService {

  api = environment.apiUrl;
  http = inject(HttpClient);

  getAfiliadosActivos(): Observable<IntAfiliadosActivos>{
    const url = `${this.api}/mostrarAfiliadosActivos`;
    return this.http.get<IntAfiliadosActivos>(url);
  }

  consultaAfiliadoOrTodos(afiliadoIdORTodos:number): Observable<IntResponseAfiliado>{
    const url = `${this.api}/obtenerInformacionAfiliadoOrTodos/${afiliadoIdORTodos}`;
    return this.http.get<IntResponseAfiliado>(url);
  }
}
