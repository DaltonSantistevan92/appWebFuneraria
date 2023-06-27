import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { IntUrlActivate } from 'src/app/shared/breadcrumb/interfaces/bread.interface';
import { EntregaPedidoService } from './service/entrega-pedido.service';
import { AsigPedido } from './interface/entrega-pedido.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-entrega-pedidos',
  templateUrl: './entrega-pedidos.component.html',
  styleUrls: ['./entrega-pedidos.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EntregaPedidosComponent implements OnInit {
  listaUrl: IntUrlActivate[] = [];

  displayedColumnsPedidoAsignados: string[] = ['id','cliente','ubicacion','total','estado'];
  columnsToDisplayWithExpandPedidoAsignados = [...this.displayedColumnsPedidoAsignados, 'accion','expand'];
  dataSourcePedidoAsignados!: MatTableDataSource<AsigPedido>;
  expandedElementPedidoAsignados!: any | null;

  @ViewChild('MatPaginatorPedidoAsignados') paginatorPedidoAsignados!: MatPaginator;
  @ViewChild(MatSort) sortPedidoAsignados!: MatSort;
  listaPedidoAsignados: AsigPedido[] = [];

  formEntregaPedido!  : FormGroup;


  constructor(
    private activedRoute: ActivatedRoute,
    private paginatorLabel: MatPaginatorIntl,
    private _ep : EntregaPedidoService,
    private fb: FormBuilder,
    private _aus : AuthService,
    private _alerSer: AlertService,



  ) { }

  ngOnInit(): void {
    this.listaUrl = this.activedRoute.snapshot.url;
    this.paginatorLabel.itemsPerPageLabel = "Items por página";
    this.initForm();
    this.setRepartidor();
    this.mostrarCategoria(this.formEntregaPedido.value.repartidor_id);

  }

  initForm(){
    this.formEntregaPedido = this.fb.group({
      repartidor_id: ['']
    });
  }

  setRepartidor(){
    if (this._aus.tokenDecodificado) {
      const repartidor_id =  this._aus.tokenDecodificado.user.persona.repartidor![0].id;
      this.formEntregaPedido.patchValue({repartidor_id}); 
    }
  }

  mostrarCategoria(repartidor_id : number) {
    this._ep.getPedidosAsignados(repartidor_id).subscribe({
      next: (resp) => {
        if (resp.status) {
          console.log(resp.data);
          
          this.datosAsigPedidos(resp.data);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  datosAsigPedidos(asigPedido: AsigPedido[]) {
    this.listaPedidoAsignados = [];
    this.listaPedidoAsignados = asigPedido;
    this.dataSourcePedidoAsignados = new MatTableDataSource(this.listaPedidoAsignados);
    this.dataSourcePedidoAsignados.paginator = this.paginatorPedidoAsignados;
    this.dataSourcePedidoAsignados.sort = this.sortPedidoAsignados;
  }

  applyFilterPedidos(event: Event){

  }

  entregarPedido(asigPedido: AsigPedido){
    this._ep.setPedidosEntregado(asigPedido.id, asigPedido.repartidor_id).subscribe({
      next: (resp) => {
        if (resp.status) {
          this._alerSer.showAlert('Pedidos', resp.message, 'success');
        }else {
          this._alerSer.showAlert('Pedidos', resp.message, 'warning');
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
    

  }

}
