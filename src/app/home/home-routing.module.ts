import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GestionAfiliacionComponent } from './gestion-afiliacion/gestion-afiliacion.component';

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
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
