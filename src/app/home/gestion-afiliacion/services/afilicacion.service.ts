import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { IntEst } from '../interfaces/estados.interface';

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

}
