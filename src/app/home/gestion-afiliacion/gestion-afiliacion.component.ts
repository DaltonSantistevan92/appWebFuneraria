import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AfilicacionService } from './services/afilicacion.service';
import { Estado } from './interfaces/estados.interface';
import { ActivatedRoute } from '@angular/router';
import { IntUrlActivate } from 'src/app/shared/breadcrumb/interfaces/bread.interface';
import { delay, map, of } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Afiliado } from './interfaces/afiliados.interface';
import { MatMenuTrigger } from '@angular/material/menu';
import { AlertService } from 'src/app/services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { VerAfiliacionComponent } from './ver-afiliacion/ver-afiliacion.component';

@Component({
  selector: 'app-gestion-afiliacion',
  templateUrl: './gestion-afiliacion.component.html',
  styleUrls: ['./gestion-afiliacion.component.scss']
})
export class GestionAfiliacionComponent implements OnInit {

  displayedColumnsAfiliado: string[] = ['id','cedula','cliente','fecha','estado'];
  columnsToDisplayWithExpandAfiliado = [...this.displayedColumnsAfiliado, 'accion'];
  dataSourceAfiliado!: MatTableDataSource<Afiliado>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  estados: Estado[] = [];
  listaUrl: IntUrlActivate[] = [];

  formTableAfiliado!: FormGroup;
  formEstadoSeleccionado!: FormGroup;


  listaAfiliados : Afiliado [] = [];

  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;

  band : boolean = false;

  @ViewChild('inputAfiliado') inputAfiliado!: ElementRef;



  constructor(
    private paginatorLabel: MatPaginatorIntl,
    private _afiSer: AfilicacionService,
    private activedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private _alerSer : AlertService,
    private dialog: MatDialog

  ) { }

  ngOnInit(): void {
    this.listaUrl = this.activedRoute.snapshot.url;
    this.paginatorLabel.itemsPerPageLabel = "Items por página";
    this.initForm();
    this.getEstados();

    this.formTableAfiliado.get('estado_id')?.valueChanges.subscribe((id:number) =>{
      this.tableEstado(id);
    });

  }

  initForm() {
    this.formTableAfiliado = this.fb.group({
      estado_id: ['', [Validators.required]]
    });  
  }

  ngAfterViewInit() {
   
  }

  tableEstado(estado_id : number){
    this._afiSer.getAfiliadoParamsEstado(estado_id).subscribe({
      next: (resp) => { 
        const nombre = this.getNombreEstado(estado_id);

        if (resp.data != null) {
          this.band = true;
          this.datosAfiliados(resp.data);
        } else {
          this.band = false;
          this._alerSer.showAlert(`${nombre}`,resp.message,'warning'); 
        } 
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  datosAfiliados(afiliado : Afiliado[]){
    this.listaAfiliados = [];
    this.listaAfiliados = afiliado;
    this.dataSourceAfiliado = new MatTableDataSource(this.listaAfiliados);
    setTimeout(() => { this.assignPaginatorAndSort(); }, 1000);
  }

  private assignPaginatorAndSort() {
    this.dataSourceAfiliado.paginator = this.paginator;
    this.dataSourceAfiliado.sort = this.sort;
    this.paginator._intl.getRangeLabel = this.getRangeDisplayText;
    this.dataSourceAfiliado.filterPredicate = this.filterBySubject();//filtra por objeto
  }

  filterBySubject() {
    let filterFunction = (afiliado: Afiliado, filter: string): boolean => {
      if (filter) {
        const subjects = afiliado.cliente.persona;  //para objecto
        const cedula = subjects?.cedula || '';
        const nombres  = subjects?.nombres || '';
        const apellidos  = subjects?.apellidos || '';

        return cedula.indexOf(filter) !== -1 || nombres.indexOf(filter) !== -1 || apellidos.indexOf(filter) !== -1;
      } else {
        return true;
      }
    };  
    return filterFunction;
  }

  getNombreCliente(element: Afiliado): string {
    const nombres = element.cliente.persona.nombres || '';
    const apellidos = element.cliente.persona.apellidos || '';

    return `${nombres} ${apellidos}`.trim();
  }

  getEstados() {
    this._afiSer.getEstados().pipe(
      map((resp) => resp.data.filter((estado) => [1, 3, 4].includes(estado.id)).sort((a, b) => a.detalle.localeCompare(b.detalle)))
    ).subscribe({
      next: (estadosFiltradosOrdenados) => {
        this.estados = estadosFiltradosOrdenados;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getRangeDisplayText = (page: number, pageSize: number, length: number) => {
    const initialText = `Mostrando Afiliados`;

    if (length == 0 || pageSize == 0) {
      return `${initialText} 0 de ${length}`;
    }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${initialText} ${startIndex + 1} a ${endIndex} de ${length}`;
  };

  isEstadoBlocked(estadoId: number, currentEstadoId: number): boolean {
    if (currentEstadoId === 4 && (estadoId === 4 || estadoId === 1)) {
      return true; // Bloquear estado "Activo" (4) y estado "Pendiente" (1) cuando el estado actual es "Activo" (4)
    }
  
    if (currentEstadoId === 1 && (estadoId === 1)) {
      return true; // Bloquear estado "Pendiente" (1), y se activa "Anulado" (3) , "Activo" (4)
    }

    if (currentEstadoId === 3 && (estadoId === 1 || estadoId === 3 || estadoId === 4)) {
      return true; // Bloquear estado "Anulado" (3), "Anulado" (3) , "Activo" (4) y "Pendiente" (1)
    }
  
    return false; // Permitir los demás estados
  }

  applyFilterAfiliado(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAfiliado.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceAfiliado.paginator) {
      this.dataSourceAfiliado.paginator.firstPage();
    }
  }

  verAfilicacion(afiliado: Afiliado){
    const dialogRef = this.dialog.open(VerAfiliacionComponent, { disableClose: true, data:afiliado, width: '700px', height: '900px'} );  
  }

  openAlert(estadoSeleccionado : number, afiliado_id : number, estadoAnterior: number){
    const nombre = this.getNombreEstado(estadoSeleccionado);
  
    if (nombre === 'anulado') {
       const name = nombre.replace('anulado','anular')
       this.servicioEstado(name, estadoSeleccionado, afiliado_id, estadoAnterior);
    }else if(nombre === 'activo'){
      const name = nombre.replace('activo','activar')
      this.servicioEstado(name, estadoSeleccionado, afiliado_id, estadoAnterior);
    }else {
      console.log('no pasa nd');
    }
  }

  servicioEstado(nombre: string, estadoSeleccionado: number, afiliado_id: number, estadoAnterior : number){
    this._alerSer.alertStatus(`Está seguro de ${nombre}?`,'¡No podrás revertir esto!','warning').then((isConfirmed) => {
      if (isConfirmed) {
        this._afiSer.getSetEstadoAfiliado(afiliado_id,estadoSeleccionado).subscribe({
          next: (resp) => {
            if (resp.status) {
              this.band = true;
              this.tableEstado(estadoAnterior);
              this._alerSer.showAlert('Afiliados',resp.message,'success');   
            }else {
              this._alerSer.showAlert(`${nombre}`,resp.message,'warning'); 
              this.band = false;
            }
          },
          error: (err) => {
            console.log(err);
          }
        });
      }else {
        console.log('cancelar',isConfirmed);
      }
    });
  }


  getNombreEstado(estadoId: number): string {
    const estado = this.estados.find(e => e.id === estadoId);
    return estado ? estado.detalle : '';
  }

}
