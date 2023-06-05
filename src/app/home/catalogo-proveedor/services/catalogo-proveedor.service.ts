import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { IntProv, Proveedor } from '../interface/proveedor.interface';

@Injectable({
  providedIn: 'root'
})
export class CatalogoProveedorService {

  api = environment.apiUrl;
  http = inject(HttpClient);

  //Proveedores
  getProveedores(): Observable<IntProv>{
    const url = `${this.api}/proveedores`;
    return this.http.get<IntProv>(url);
  }

  saveProveedor( data : { proveedor : Proveedor } ): Observable<IntProv>{
    const url = `${this.api}/saveProveedor`;
    return this.http.post<IntProv>(url, data);
  }

  updateProveedor( data : { proveedor : Proveedor } ): Observable<IntProv>{
    const url = `${this.api}/updateProveedor`;
    return this.http.post<IntProv>(url, data);
  }

  deleteProveedor( proveedor_id: number ): Observable<IntProv>{
    const url = `${this.api}/deleteProveedor/${proveedor_id}`;
    return this.http.get<IntProv>(url);
  }


  
}
