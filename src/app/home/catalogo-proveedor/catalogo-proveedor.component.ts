import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { IntUrlActivate } from 'src/app/shared/breadcrumb/interfaces/bread.interface';
import { Proveedor } from './interface/proveedor.interface';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CatalogoProveedorService } from './services/catalogo-proveedor.service';
import { AlertService } from 'src/app/services/alert.service';
import { CrearEditarProveedorComponent } from './crear-editar-proveedor/crear-editar-proveedor.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-catalogo-proveedor',
  templateUrl: './catalogo-proveedor.component.html',
  styleUrls: ['./catalogo-proveedor.component.scss']
})
export class CatalogoProveedorComponent implements OnInit {
  listaUrl: IntUrlActivate[] = [];
  //Proveedores
  displayedColumnsProveedores: string[] = ['id','ruc','razon_social','direccion','correo','celular','telefono'];
  columnsToDisplayWithExpandProveedores = [...this.displayedColumnsProveedores, 'accion'];
  dataSourceProveedor!: MatTableDataSource<Proveedor>;

  @ViewChild('MatPaginatorProveedor') paginatorProveedor!: MatPaginator;
  @ViewChild(MatSort) sortProveedor!: MatSort;
  listaProveedores: Proveedor[] = [];

  constructor(
    private activedRoute: ActivatedRoute,
    private paginatorLabel: MatPaginatorIntl,
    private _cp : CatalogoProveedorService,
    private _alerSer: AlertService,
    private dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    this.listaUrl = this.activedRoute.snapshot.url;
    this.paginatorLabel.itemsPerPageLabel = "Items por página";
    this.mostrarProveedor();
  }

  crearNuevoProveedor(){
    const dialogRef = this.dialog.open(CrearEditarProveedorComponent,
                    { disableClose: true, width: '600px', height: '500px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.mostrarProveedor();
      }
    });
  }

  mostrarProveedor() {
    this._cp.getProveedores().subscribe({
      next: (resp) => {
        if (resp.status) {
          this.datosProveedor(resp.data);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  datosProveedor(proveedor : Proveedor[]) {
    this.listaProveedores = [];
    this.listaProveedores = proveedor;
    this.dataSourceProveedor = new MatTableDataSource(this.listaProveedores);
    this.dataSourceProveedor.paginator = this.paginatorProveedor;
    this.dataSourceProveedor.sort = this.sortProveedor;
  }

  applyFilterProveedor(event : Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceProveedor.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceProveedor.paginator) {
      this.dataSourceProveedor.paginator.firstPage();
    }
  }

  editarProveedor(proveedor : Proveedor){
    const dialogRef = this.dialog.open(CrearEditarProveedorComponent,
                    { disableClose: true, data: proveedor, width: '600px', height: '500px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.mostrarProveedor();
      }
    });
  }

  eliminarProveedor(proveedor : Proveedor){
    this._alerSer.alertStatus(`Está seguro de eliminar el proveedor ${proveedor.razon_social}?`, '¡No podrás revertir esto!', 'warning')
    .then((isConfirmed) => {
      if (isConfirmed) {
        this._cp.deleteProveedor(proveedor.id!).subscribe({
          next: (resp) => {
            if (resp.status) {
              this._alerSer.showAlert('Proveedor', resp.message, 'success');
              this.mostrarProveedor();
            } else {
              this._alerSer.showAlert('Proveedor', resp.message, 'warning');
            }
          },
          error: (err) => {
            console.log(err);
          }
        });
      }
    });
  }
}
