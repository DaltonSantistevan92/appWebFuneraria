import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Categorias, IntCate, IntSer } from '../interfaces/categoria.interface';

@Injectable({
  providedIn: 'root'
})
export class GestionProductoService {

  api = environment.apiUrl;
  http = inject(HttpClient);

  //Categoria
  getCategorias(): Observable<IntCate>{
    const url = `${this.api}/categorias`;
    return this.http.get<IntCate>(url);
  }

  saveCategoria( data : { categoria : Categorias } ): Observable<IntCate>{
    const url = `${this.api}/saveCategoria`;
    return this.http.post<IntCate>(url, data);
  }

  updateCategoria( data : { categoria : Categorias } ): Observable<IntCate>{
    const url = `${this.api}/updateCategoria`;
    return this.http.post<IntCate>(url, data);
  }

  deleteCategoria( categoria_id: number ): Observable<IntCate>{
    const url = `${this.api}/deleteCategoria/${categoria_id}`;
    return this.http.get<IntCate>(url);
  }

  //Servicio
  getServicios(): Observable<IntSer>{
    const url = `${this.api}/servicios`;
    return this.http.get<IntSer>(url);
  }


  //Producto
}
