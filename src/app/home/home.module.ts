import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { GestionAfiliacionComponent } from './gestion-afiliacion/gestion-afiliacion.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { VerAfiliacionComponent } from './gestion-afiliacion/ver-afiliacion/ver-afiliacion.component';


@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    GestionAfiliacionComponent,
    VerAfiliacionComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class HomeModule { }
