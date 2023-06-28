import { CdkDrag, CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IntUrlActivate } from 'src/app/shared/breadcrumb/interfaces/bread.interface';
import { AsignacionPedidosService } from './services/asignacion-pedidos.service';
import { Repartidor } from './interfaces/repartidor.interface';
import { PedidoEnProceso } from './interfaces/asignacion-pedido.interface';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-asignacion-pedidos',
  templateUrl: './asignacion-pedidos.component.html',
  styleUrls: ['./asignacion-pedidos.component.scss']
})
export class AsignacionPedidosComponent implements OnInit {
  listaUrl: IntUrlActivate[] = [];
  formulario!: FormGroup;

  //pruebas drag and drog
  listaRepartidor: Repartidor[] = [];
  listaPedidosEnProceso: PedidoEnProceso[] = [];
  
  newRepartidor: Repartidor[] = [];
  newPedidoAsignado: PedidoEnProceso[] = [];

  // listaRepartidor: (Repartidor | PedidoEnProceso)[] = [];
  
  // listaPedidosEnProceso: (Repartidor | PedidoEnProceso)[] = [];

  // newRepartidor: (Repartidor | PedidoEnProceso)[] = [];

  // newPedidoAsignado: (Repartidor | PedidoEnProceso)[] = [];


  isEditable: boolean = true;

  constructor(
    private activedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private _aps : AsignacionPedidosService,
    private _alerSer : AlertService,

  ) { }

  ngOnInit(): void {
    this.listaUrl = this.activedRoute.snapshot.url;

    this.formulario = this.fb.group({
      repartidor: ['', Validators.required],
      pedido: ['', Validators.required]
    });

    this.listarRepartidor();
    this.listarPedidosEnProceso();
  }

  listarRepartidor(){
    this._aps.getRepartidor().subscribe({
      next : (resp) => {
        if (resp.status) {
          this.listaRepartidor = resp.data;
        }
      },
      error : (err) => {
        console.log(err);
      }
    })
  }

  listarPedidosEnProceso(){
    this._aps.getPedidosEnProceso().subscribe({
      next : (resp) => {
        //console.log(resp);
        if (resp.status) {
          this.listaPedidosEnProceso = resp.data;
        }
      },
      error : (err) => {
        console.log(err);
      }
    })
  }

  dropRepartidores(event: CdkDragDrop<Repartidor[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  
  dropPedidos(event: CdkDragDrop<PedidoEnProceso[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  

  

  // drop(event: CdkDragDrop<Repartidor[]>) {//add varios
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
  //   }
  // }

  dropOnList(event: CdkDragDrop<Repartidor[]>) {//solo permite add 1
    //obtenemos el elemento
    const element = (event.previousContainer.data as Array<any>)[event.previousIndex];

    //Comprobamos que no exista este elemento en ele array
    const isExist = (event.container.data as Array<any>).includes(element);

    if (!isExist) {
      event.container.data.splice(0, 1);
      copyArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
    } else {
      //console.log('delete',isExist);
    }
  }

  predicate(item: CdkDrag<any>) {
    return item.data.id !== 1;
  }

  asignacionPedido(){
    if (this.newRepartidor.length == 0) {
      this._alerSer.showAlert('Asignación','Asigne un repartidor','warning'); 
      return;
    }

    if (this.newPedidoAsignado.length == 0) {
      this._alerSer.showAlert('Asignación','Asigne más que sea un pedido','warning'); 
      return;
    }

    let json = {
      asignacion : { repartidor_id : this.newRepartidor[0].id, pedidos_asignados : this.newPedidoAsignado }
    }
    //console.log(json);

    this._aps.saveAsignacion(json).subscribe({
      next : (resp) => {
        //console.log(resp);
        if (resp.status) {
          this._alerSer.showAlert('Asignación',resp.message,'success'); 
          this.newRepartidor = [];
          this.newPedidoAsignado = [];
          this.listarRepartidor();
          this.listarPedidosEnProceso();
        } else {
          this._alerSer.showAlert('Asignación',resp.message,'warning'); 
        }
      },
      error : (err) => {
        console.log(err);
      }
    })

    

  }


  // dropC(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(this.listaEntregadores, event.previousIndex, event.currentIndex);
  // }

  // dropG(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(this.listaPedidos, event.previousIndex, event.currentIndex);
  // }

}
