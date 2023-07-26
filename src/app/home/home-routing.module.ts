import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GestionAfiliacionComponent } from './gestion-afiliacion/gestion-afiliacion.component';
import { GestionProductoComponent } from './gestion-producto/gestion-producto.component';
import { CatalogoProveedorComponent } from './catalogo-proveedor/catalogo-proveedor.component';
import { GestionCompraComponent } from './gestion-compra/gestion-compra.component';
import { GestionPedidosComponent } from './gestion-pedidos/gestion-pedidos.component';
import { AsignacionPedidosComponent } from './asignacion-pedidos/asignacion-pedidos.component';
import { EntregaPedidosComponent } from './entrega-pedidos/entrega-pedidos.component';
import { InventarioComponent } from './inventario/inventario.component';
import { AfiliacionesComponent } from './reportes/afiliaciones/afiliaciones.component';
import { NuevoPagoComponent } from './pagos/nuevo-pago/nuevo-pago.component';
import { ProductosMasVendidosComponent } from './reportes/productos-mas-vendidos/productos-mas-vendidos.component';
import { InicioComponent } from './inicio/inicio.component';

const routes: Routes = [
  // { path : '' , redirectTo : 'inicio/dashboard', pathMatch : 'full'},
  { path : '' , redirectTo : 'inicio', pathMatch : 'full'},

  {
    path : '', component : HomeComponent, canActivate : [AuthGuard],
    children : [
      { path : 'inicio', component : InicioComponent, canActivate : [AuthGuard] },
      { path : 'inicio/dashboard', component : DashboardComponent, canActivate : [AuthGuard] },
      { path : 'gestión-afiliación/consultar', component : GestionAfiliacionComponent, canActivate : [AuthGuard] },
      { path : 'gestión-producto/nuevos-registros', component : GestionProductoComponent, canActivate : [AuthGuard] },
      { path : 'catálogo-proveedor/nuevo-catálogo', component : CatalogoProveedorComponent, canActivate : [AuthGuard] },
      { path : 'gestión-compra/consultar-compras', component : GestionCompraComponent, canActivate : [AuthGuard] },
      { path : 'gestión-pedidos/consultar-pedidos', component : GestionPedidosComponent,canActivate : [AuthGuard] },
      { path : 'gestión-pedidos/asignación-pedidos', component : AsignacionPedidosComponent, canActivate : [AuthGuard] },
      { path : 'gestión-pedidos/entrega-pedidos', component : EntregaPedidosComponent, canActivate : [AuthGuard] },
      { path : 'inventario/kardex', component : InventarioComponent, canActivate : [AuthGuard] },
      { path : 'reporte/afiliación', component : AfiliacionesComponent, canActivate : [AuthGuard] },
      { path : 'pagos/nuevo-pago', component : NuevoPagoComponent, canActivate : [AuthGuard] },
      { path : 'reporte/producto-vendidos', component : ProductosMasVendidosComponent, canActivate : [AuthGuard] },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
