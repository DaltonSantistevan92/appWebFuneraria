import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  api = environment.apiUrl;
  http = inject(HttpClient);

  savePagos( data : any ): Observable<any>{
    const url = `${this.api}/savePagos`;
    return this.http.post<any>(url, data);
  }
}
