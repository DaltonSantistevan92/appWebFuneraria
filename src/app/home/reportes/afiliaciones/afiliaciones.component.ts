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
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-afiliaciones',
  templateUrl: './afiliaciones.component.html',
  styleUrls: ['./afiliaciones.component.scss']
})
export class AfiliacionesComponent implements OnInit {
  listaUrl: IntUrlActivate[] = [];
  formReporteAfiliado! : FormGroup;
  band : boolean = false;

  columnsToDisplayWithExpandAfiliadosResponse: string[] = ['id','cliente','servicio','precio_servicio','monto_mensual','duracion_meses','letras_pagadas','letras_pendientes','monto_pendiente','monto_pagado'];
  dataSourceAfiliadosResponse!: MatTableDataSource<ResponseAfiliado>;
 
  @ViewChild('MatPaginatorAfiliadosResp') paginatorAfiliadosResp!: MatPaginator;
  @ViewChild(MatSort) sortAfiliadosResponse!: MatSort;
  listaAfiliadosResponse: ResponseAfiliado[] = [];

  totalMontoMensual: number = 0;
  totalMontoPendiente: number = 0;
  totalMontoPagado: number = 0;


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

    this.formReporteAfiliado.get('afiliado_id')?.valueChanges.subscribe((afiliado_id:number) =>{
      this._as.consultaAfiliadoOrTodos(afiliado_id).subscribe({
        next : (resp) => {
          console.log('consulta afiliado aqui me falta ver los dias de pagos',resp);
          
          if (resp.status) {
            this.datosAfiliadosResponse(resp.data);
          } 
        },
        error : (err) => {
          console.log(err);
        }
      });
    });
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

  datosAfiliadosResponse(afiliados: ResponseAfiliado[]) {
    this.listaAfiliadosResponse = [];
    this.listaAfiliadosResponse = afiliados;
    this.dataSourceAfiliadosResponse = new MatTableDataSource(this.listaAfiliadosResponse);
    setTimeout(() => { this.assignPaginatorAndSort(); }, 1000);
  }

  private assignPaginatorAndSort() {
    this.dataSourceAfiliadosResponse.paginator = this.paginatorAfiliadosResp;
    this.dataSourceAfiliadosResponse.sort = this.sortAfiliadosResponse;
    this.paginatorAfiliadosResp._intl.getRangeLabel = this.getRangeDisplayText;
    this.dataSourceAfiliadosResponse.filterPredicate = this.filterBySubject();//filtra por objeto
    this.calculateTotals();


    // Escucha el evento 'page' del paginator
    this.dataSourceAfiliadosResponse.paginator.page.subscribe((event: PageEvent) => {
      // Recalcula los totales cuando cambia de página
      this.calculateTotals();
    });
  }

  calculateTotals() {
    this.totalMontoMensual = this.dataSourceAfiliadosResponse.filteredData.map(t => t.monto_mensual).reduce((acc, value) => acc + value, 0); 
    this.totalMontoPendiente = this.dataSourceAfiliadosResponse.filteredData.map(t => t.monto_pendiente).reduce((acc, value) => acc + value, 0);
    this.totalMontoPagado = this.dataSourceAfiliadosResponse.filteredData.map(t => t.monto_pagado).reduce((acc, value) => acc + value, 0);
  }
  

  getRangeDisplayText = (page: number, pageSize: number, length: number) => {
    const initialText = `Mostrando Afiliaciones`;
   
    if (length == 0 || pageSize == 0) {
      return `${initialText} 0 de ${length}`;
    }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${initialText} ${startIndex + 1} a ${endIndex} de ${length}`;
  };

  filterBySubject() {
    let filterFunction = (respAfiliado: ResponseAfiliado, filter: string): boolean => {
      if (filter) {
        const subjectAfiliado = respAfiliado;  //para objecto
        const cliente = subjectAfiliado?.cliente || '';
        const servicio = subjectAfiliado.servicio || '';
        
        return cliente.indexOf(filter) !== -1 || servicio.indexOf(filter) !== -1;
      } else {
        return true;
      }
    };  
    return filterFunction;
  }

  applyFilterAfiliadosResponse(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAfiliadosResponse.filter = filterValue.trim().toLowerCase();
   
    if (this.dataSourceAfiliadosResponse.paginator) {
      this.dataSourceAfiliadosResponse.paginator.firstPage();
    }
    this.calculateTotals();
  }
}
