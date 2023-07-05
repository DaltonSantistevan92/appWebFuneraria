import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { IntAfiliadosInactivosAndActivos, IntCompraVentaTotales, IntDashCompraVenta } from '../interfaces/dashboard.interface';
import { IntKPIPedidoEstado } from '../interfaces/kpi-totales-pedido-estado.interface';

@Injectable({
  providedIn: 'root'
})
export class DashService {

  api = environment.apiUrl;
  http = inject(HttpClient);

  getDashCompra(): Observable<IntDashCompraVenta>{
    const url = `${this.api}/dashCompraAndVenta`;
    return this.http.get<IntDashCompraVenta>(url);
  }

  getkpiTotalesPedidosEstados(): Observable<IntKPIPedidoEstado>{
    const url = `${this.api}/kpiTotalesPedidosEstados`;
    return this.http.get<IntKPIPedidoEstado>(url);
  }

  getCantidadAfiliados(): Observable<IntAfiliadosInactivosAndActivos>{
    const url = `${this.api}/cantidadAfiliado`;
    return this.http.get<IntAfiliadosInactivosAndActivos>(url);
  }

  getTotalCompraAndVenta(): Observable<IntCompraVentaTotales>{
    const url = `${this.api}/totalCompraAndVenta`;
    return this.http.get<IntCompraVentaTotales>(url);
  }

  
  
}
