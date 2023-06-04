import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Categorias, IntCate, IntSer } from '../interfaces/categoria.interface';
import { IntServicio } from '../interfaces/servicio.interface';
import { IntProducto } from '../interfaces/producto.interface';

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

  saveServicio( data : { servicio : IntServicio } ): Observable<IntSer>{
    const url = `${this.api}/saveServicio`;
    return this.http.post<IntSer>(url, data);
  }

  updateServicio( data : { servicio : IntServicio } ): Observable<IntSer>{
    const url = `${this.api}/updateServicio`;
    return this.http.post<IntSer>(url, data);
  }

  deleteServicio( servicio_id: number ): Observable<IntSer>{
    const url = `${this.api}/deleteServicio/${servicio_id}`;
    return this.http.get<IntSer>(url);
  }

  //Producto
  getProductos(): Observable<IntProducto>{
    const url = `${this.api}/getProductos`;
    return this.http.get<IntProducto>(url);
  }

  saveProducto( data : { producto : IntServicio } ): Observable<IntProducto>{
    const url = `${this.api}/saveProducto`;
    return this.http.post<IntProducto>(url, data);
  }

  updateProducto( data : { producto : IntServicio } ): Observable<IntProducto>{
    const url = `${this.api}/updateProducto`;
    return this.http.post<IntProducto>(url, data);
  }

  deleteProducto( producto_id: number ): Observable<IntProducto>{
    const url = `${this.api}/deleteProducto/${producto_id}`;
    return this.http.get<IntProducto>(url);
  }

  
}
