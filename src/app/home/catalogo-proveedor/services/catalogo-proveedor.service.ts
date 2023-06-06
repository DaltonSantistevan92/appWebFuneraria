import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { IntProv, Proveedor } from '../interface/proveedor.interface';
import { IntProducto } from '../../gestion-producto/interfaces/producto.interface';
import { CatalogoRequest } from '../interface/catalogo.interface';

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

  //filtro producto por categoria_id
  getProductoPorCategoria(categoria_id : number): Observable<IntProducto>{
    const url = `${this.api}/listarProductoPorCategoria/${categoria_id}`;
    return this.http.get<IntProducto>(url);
  }

  //Catalogo
  saveCatalogo( data : CatalogoRequest ): Observable<any>{
    const url = `${this.api}/saveCatalogo`;
    return this.http.post<any>(url, data);
  }



  
}
