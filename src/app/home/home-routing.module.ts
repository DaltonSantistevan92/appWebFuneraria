import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GestionAfiliacionComponent } from './gestion-afiliacion/gestion-afiliacion.component';
import { GestionProductoComponent } from './gestion-producto/gestion-producto.component';
import { CatalogoProveedorComponent } from './catalogo-proveedor/catalogo-proveedor.component';

const routes: Routes = [
  { path : '' , redirectTo : 'inicio/dashboard', pathMatch : 'full'},
  {
    path : '',
    component : HomeComponent,
    canActivate : [AuthGuard],
    children : [
      { 
        path : 'inicio/dashboard', 
        component : DashboardComponent,
        canActivate : [AuthGuard],
      },
      { 
        path : 'gestión-afiliación/consultar', 
        component : GestionAfiliacionComponent,
        canActivate : [AuthGuard],
      },
      { 
        path : 'gestión-producto/nuevos-registros', 
        component : GestionProductoComponent,
        canActivate : [AuthGuard],
      },
      { 
        path : 'catálogo-proveedor/nuevo-catálogo', 
        component : CatalogoProveedorComponent,
        canActivate : [AuthGuard],
      },
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
