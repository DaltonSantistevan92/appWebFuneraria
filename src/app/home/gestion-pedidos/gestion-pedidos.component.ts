import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IntUrlActivate } from 'src/app/shared/breadcrumb/interfaces/bread.interface';
import { Estado } from '../gestion-afiliacion/interfaces/estados.interface';
import { AfilicacionService } from '../gestion-afiliacion/services/afilicacion.service';
import { map } from 'rxjs';
import { PedidosService } from './services/pedidos.service';
import { Venta } from './interfaces/pedidos.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-gestion-pedidos',
  templateUrl: './gestion-pedidos.component.html',
  styleUrls: ['./gestion-pedidos.component.scss']
})
export class GestionPedidosComponent implements OnInit {
  listaUrl: IntUrlActivate[] = [];

  formConsultaPedido!  : FormGroup;
  estados : Estado [] = [];

  band : boolean = false;

  msgPersonalizado : boolean = false;
  msg : string = '';

  displayedColumnsVentaTable: string[] = ['id','serie','cliente','created_at','estado'];
  columnsToDisplayWithExpandVentaTable = [...this.displayedColumnsVentaTable, 'accion'];
  dataSourceVentaTable! : MatTableDataSource<Venta>;

  @ViewChild('MatPaginatorVentaTable') paginatorVentaTable!: MatPaginator;
  @ViewChild(MatSort) sortVentaTable!: MatSort;
  listaVentaTable: Venta[] = [];


  @ViewChild('inputPedidoTable') inputPedidoTable!: ElementRef;



  constructor(
    private activedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private _afiSer: AfilicacionService,
    private _ps : PedidosService,
    private _alerSer: AlertService,
  ) { }

  ngOnInit(): void {
    this.listaUrl = this.activedRoute.snapshot.url;
    this.initFormConsultaPedido();
    this.getEstados();

    this.formConsultaPedido.get('estado_id')?.valueChanges.subscribe((estado_id:number) => { 
      this.tableEstadoVenta(estado_id);
    });
  }

  initFormConsultaPedido(){
    this.formConsultaPedido = this.fb.group({
      estado_id: ['', [Validators.required]],
    });
  }

  getEstados() {
    this._afiSer.getEstados().pipe(
      map((resp) => resp.data.filter((estado) => [1, 2, 3, 6].includes(estado.id)).sort((a, b) => a.detalle.localeCompare(b.detalle)))
    ).subscribe({
      next: (estadosFiltradosOrdenados) => {
        this.estados = estadosFiltradosOrdenados;
      },
      error: (err) => { console.log(err); }
    });
  }

  tableEstadoVenta(estado_id: number){
    this._ps.getVentasxEstados(estado_id).subscribe({
      next: (resp) => {
        if (resp.status) {
          this.band = true;
          this.msgPersonalizado = false;
          this.datosVentas(resp.data);
        } else {
          this.band = false;
          this.msgPersonalizado = true;

          if (estado_id !== undefined) {
            switch (estado_id) {
              case 1: this.msg = 'No hay pedidos pendientes' 
              break;

              case 2: this.msg = 'No hay pedidos entregados'
              break;
  
              case 3: this.msg = 'No hay pedidos anulados'
              break;
  
              case 6: this.msg = 'No hay pedidos en proceso'
              break;
            }
          }else {
            this.msgPersonalizado = false;
          }

        }
      },
      error: (err) => { console.log(err); }
    });
  }

  openAlert(estadoSeleccionado : number, compra_id : number, estadoAnterior: number){
    const nombre = this.getNombreEstado(estadoSeleccionado);

    console.log('nombre del estado', nombre);
    
    if (nombre === 'anulado') {
       const name = nombre.replace('anulado','anular')
       this.servicioEstado(name, estadoSeleccionado, compra_id, estadoAnterior);
    }else if(nombre === 'en proceso'){
      const name = nombre.replace('en proceso','procesar')
      this.servicioEstado(name, estadoSeleccionado, compra_id, estadoAnterior);
    }else {
      console.log('no pasa nd');
    }
  }

  servicioEstado(nombre: string, estadoSeleccionado: number, venta_id: number, estadoAnterior : number){
    this._alerSer.alertStatus(`Está seguro de ${nombre} el pedido?`,'¡No podrás revertir esto!','warning').then((isConfirmed) => {
      if (isConfirmed) {
        this._ps.getSetEstadoVenta(venta_id,estadoSeleccionado).subscribe({
          next: (resp) => {
            if (resp.status) {
              this.band = true;
              this.tableEstadoVenta(estadoAnterior);
              this._alerSer.showAlert('Venta',resp.message,'success');   
            }else {
              this._alerSer.showAlert(`${nombre}`,resp.message,'warning'); 
              this.band = false;
            }
          },
          error: (err) => { console.log(err); }
        });
      }else {
        console.log('cancelar',isConfirmed);
      }
    });
  }

  isEstadoBlocked(estadoId: number, currentEstadoId: number): boolean {
    if (currentEstadoId === 6 && (estadoId === 6 || estadoId === 1 || estadoId === 2 || estadoId === 3)) {
      return true; // Bloquear estado "En Proceso" (6) , "Pendiente" (1) y "entregado" (2)
    }
  
    if (currentEstadoId === 1 && (estadoId === 1) || (estadoId === 2) ) {//listo
      return true; // Bloquear estado "Pendiente" (1), y se activa "Anulado" (3) , "Recibido" (5)
    }

    if (currentEstadoId === 3 && (estadoId === 1 || estadoId === 2 || estadoId === 3)) {
      return true; // Bloquear estado "Anulado" (3),  "Pendiente" (1) y "entregado" (2) y "Anulado" (3)
    }
  
    return false; // Permitir los demás estados
  }

  getNombreEstado(estadoId: number): string {
    const estado = this.estados.find(e => e.id === estadoId);
    return estado ? estado.detalle : '';
  }

  datosVentas(venta : Venta[]){
    this.listaVentaTable = [];
    this.listaVentaTable = venta;
    this.dataSourceVentaTable = new MatTableDataSource(this.listaVentaTable);
  }

  applyFilterPedido(event:Event){

  }

  verComprobantedeVenta(venta : Venta){

  }

}
