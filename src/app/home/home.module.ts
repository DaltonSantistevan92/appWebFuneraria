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
import { GestionProductoComponent } from './gestion-producto/gestion-producto.component';
import { CrearEditarCategoriaComponent } from './gestion-producto/crear-editar-categoria/crear-editar-categoria.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SoloLetrasDirective } from '../directives/solo-letras.directive';
import { CrearEditarServicioComponent } from './gestion-producto/crear-editar-servicio/crear-editar-servicio.component';
import { DecimalNumberDirective } from '../directives/decimal-number.directive';
import { CrearEditarProductoComponent } from './gestion-producto/crear-editar-producto/crear-editar-producto.component';

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    GestionAfiliacionComponent,
    VerAfiliacionComponent,
    GestionProductoComponent,
    CrearEditarCategoriaComponent,
    CrearEditarServicioComponent,
    SoloLetrasDirective,
    DecimalNumberDirective,
    CrearEditarProductoComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxDropzoneModule
  ]
})
export class HomeModule { }
