import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { IntUrlActivate } from 'src/app/shared/breadcrumb/interfaces/bread.interface';
import { ModalAfiliadosComponent } from './modal-afiliados/modal-afiliados.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AfiliadosActivos, ResponseAfiliado } from '../interfaces/afiliados-activos.interface';
import { GeneralService } from '../../../../../../appMovilFuneraria/src/app/services/general.service';
import { AfiliacionesService } from './services/afiliaciones.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-afiliaciones',
  templateUrl: './afiliaciones.component.html',
  styleUrls: ['./afiliaciones.component.scss']
})
export class AfiliacionesComponent implements OnInit {
  listaUrl: IntUrlActivate[] = [];
  formReporteAfiliado! : FormGroup;
  band : boolean = false;

  displayedColumnsAfiliadosResponse: string[] = ['id','cliente','servicio','precio_servicio','monto_mensual','duracion_meses','letras_pagadas','letras_pendientes','monto_pendiente','monto_pagado'];
  columnsToDisplayWithExpandAfiliadosResponse = [...this.displayedColumnsAfiliadosResponse, 'accion'];
  dataSourceAfiliadosResponse!: MatTableDataSource<ResponseAfiliado>;
 
  @ViewChild('MatPaginatorAfiliadosResponse') paginatorAfiliadosResponse!: MatPaginator;
  @ViewChild(MatSort) sortAfiliadosResponse!: MatSort;
  listaAfiliadosResponse: ResponseAfiliado[] = [];

  constructor(
    private activedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private _gs: GeneralService,
    private _as: AfiliacionesService

  ) { }

  ngOnInit(): void {
    this.listaUrl = this.activedRoute.snapshot.url;
    this.initForm();
  }

  initForm() {
    this.formReporteAfiliado = this.fb.group({
      afiliado_id: [''],
      cedula: [''],
      nombre_afiliado : [''],
    });
  }

  modalAfiliados(){
    const dialogRef = this.dialog.open(ModalAfiliadosComponent,{ disableClose: true, width: '600px', height: '500px' });

    dialogRef.afterClosed().subscribe(afiliado => {
      if (afiliado != undefined) {

       if (afiliado == -1) {
        this.band = false;
        this.formReporteAfiliado.get('afiliado_id')?.setValue(afiliado);
       } else {
        this.band = true;
         this.setearAfiliado(afiliado);
       }
      }
    });
  }

  setearAfiliado(afiliado: AfiliadosActivos){
    const {id:afiliado_id, cliente : {persona : { cedula, nombres, apellidos  } } } = afiliado;
    let nombre_afiliado = ` ${this._gs.titlecase(nombres)} ${this._gs.titlecase(apellidos)}`;
    this.formReporteAfiliado.patchValue({afiliado_id,cedula,nombre_afiliado});
  }

  consultar(){
    const form = this.formReporteAfiliado.value; 
    if (form.afiliado_id === '') { return }

    this._as.consultaAfiliadoOrTodos(form.afiliado_id).subscribe({
      next : (resp) => {
        console.log(resp);
        if (resp.status) {
          this.datosAfiliadosResponse(resp.data);
        } else {
          
        }
        
      },
      error : (err) => {
        console.log(err);
      }
    });
  }

  datosAfiliadosResponse(afiliados: ResponseAfiliado[]) {
    this.listaAfiliadosResponse = [];
    this.listaAfiliadosResponse = afiliados;
    this.dataSourceAfiliadosResponse = new MatTableDataSource(this.listaAfiliadosResponse);
    this.dataSourceAfiliadosResponse.paginator = this.paginatorAfiliadosResponse;
    this.dataSourceAfiliadosResponse.sort = this.sortAfiliadosResponse;
    //setTimeout(() => { this.assignPaginatorAndSort(); }, 1000);
  }

  getMontoPendiente() {
    return this.dataSourceAfiliadosResponse.data.map(t => t.monto_pendiente).reduce((acc, value) => acc + value, 0);
  }

  getMontoPagado() {
    return this.dataSourceAfiliadosResponse.data.map(t => t.monto_pagado).reduce((acc, value) => acc + value, 0);
  }

  applyFilterAfiliadosResponse(event: Event){

  }
}
