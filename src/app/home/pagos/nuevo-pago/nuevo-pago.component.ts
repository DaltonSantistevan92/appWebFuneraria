import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { IntUrlActivate } from 'src/app/shared/breadcrumb/interfaces/bread.interface';
import { ModalAfiComponent } from '../modal-afi/modal-afi.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AfiliadosActivos, ResponseAfiliado } from '../../reportes/interfaces/afiliados-activos.interface';
import { GeneralService } from '../../../../../../appMovilFuneraria/src/app/services/general.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AfiliacionesService } from '../../reportes/afiliaciones/services/afiliaciones.service';
import { ModalPagoComponent } from '../modal-pago/modal-pago.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-nuevo-pago',
  templateUrl: './nuevo-pago.component.html',
  styleUrls: ['./nuevo-pago.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class NuevoPagoComponent implements OnInit {
  listaUrl: IntUrlActivate[] = [];
  band : boolean = false;

  formNuevoPago! : FormGroup;
  
  displayedColumnsAfiliadosResponse: string[] = ['id','cliente','servicio','precio_servicio','monto_mensual','duracion_meses','letras_pagadas','letras_pendientes','monto_pendiente','monto_pagado'];
  columnsToDisplayWithExpandAfiliadosResponse = [...this.displayedColumnsAfiliadosResponse, 'expand','accion'];
  dataSourceAfiliadosResponse!: MatTableDataSource<ResponseAfiliado>;
  expandedElementAfiliadosResponse!: ResponseAfiliado | null;

 
  @ViewChild('MatPaginatorAfiliadosResponse') paginatorAfiliadosResponse!: MatPaginator;
  @ViewChild(MatSort) sortAfiliadosResponse!: MatSort;
  listaAfiliadosResponse: ResponseAfiliado[] = [];

  totalMontoMensual: number = 0;
  totalMontoPendiente: number = 0;
  totalMontoPagado: number = 0;

  @ViewChild('inputAfiliadosResponse') inputAfiliadosResponse!: ElementRef;


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

    this.formNuevoPago.get('afiliado_id')?.valueChanges.subscribe(afiliado_id =>{
      this._as.consultaAfiliadoOrTodos(afiliado_id).subscribe({
        next : (resp) => {
          console.log('tabla pagos ',resp);
          //console.log('valueChanges',resp);
          if (resp.status) {
            this.datosAfiliadosResponse(resp.data);
          } else {
            
          }
        },
        error : (err) => {
          console.log(err);
        }
      });
    });
  }

  initForm() {
    this.formNuevoPago = this.fb.group({
      afiliado_id: [''],
      cedula: [''],
      nombre_afiliado : [''],
    });
  }

  datosAfiliadosResponse(afiliados: ResponseAfiliado[]) {
    this.listaAfiliadosResponse = [];
    this.listaAfiliadosResponse = afiliados;
    this.dataSourceAfiliadosResponse = new MatTableDataSource(this.listaAfiliadosResponse);
    setTimeout(() => { this.assignPaginatorAndSort(); }, 1000);
  }

  private assignPaginatorAndSort() {
    this.dataSourceAfiliadosResponse.paginator = this.paginatorAfiliadosResponse;
    this.dataSourceAfiliadosResponse.sort = this.sortAfiliadosResponse;
    this.paginatorAfiliadosResponse._intl.getRangeLabel = this.getRangeDisplayText;
    this.dataSourceAfiliadosResponse.filterPredicate = this.filterBySubject();//filtra por objeto
    this.calculateTotals();

    // Escucha el evento 'page' del paginator
    this.dataSourceAfiliadosResponse.paginator.page.subscribe((event: PageEvent) => {
      // Recalcula los totales cuando cambia de página
      this.calculateTotals();
    });
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

  modalAfiliados(){
    const dialogRef = this.dialog.open(ModalAfiComponent,{ disableClose: true, width: '600px', height: '500px' });

    dialogRef.afterClosed().subscribe(afiliado => {
      if (afiliado != undefined) {
        //console.log('nuevo-pago', afiliado);
        this.band = true;
        this.setearAfiliado(afiliado);
      }
    });
  }

  setearAfiliado(afiliado: AfiliadosActivos){
    const {id:afiliado_id, cliente : {persona : { cedula, nombres, apellidos  } } } = afiliado;
    let nombre_afiliado = ` ${this._gs.titlecase(nombres)} ${this._gs.titlecase(apellidos)}`;
    this.formNuevoPago.patchValue({afiliado_id,cedula,nombre_afiliado});
  }

  calculateTotals() {
    this.totalMontoMensual = this.dataSourceAfiliadosResponse.filteredData.map(t => t.monto_mensual).reduce((acc, value) => acc + value, 0); 
    this.totalMontoPendiente = this.dataSourceAfiliadosResponse.filteredData.map(t => t.monto_pendiente).reduce((acc, value) => acc + value, 0);
    this.totalMontoPagado = this.dataSourceAfiliadosResponse.filteredData.map(t => t.monto_pagado).reduce((acc, value) => acc + value, 0);
  }


  modalPagar(afiliados: ResponseAfiliado){
    const dialogRef = this.dialog.open(ModalPagoComponent,{ disableClose: true,  data: afiliados, width: '600px', height: '420px' });

    dialogRef.afterClosed().subscribe(afiliado_id => {
      if (afiliado_id != undefined) {
        //console.log('modal-pago', afiliado_id);
        this._as.consultaAfiliadoOrTodos(afiliado_id).subscribe({
          next : (resp) => {
            console.log('actualizando tabla',resp);
            //console.log('valueChanges',resp);
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
    });
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
