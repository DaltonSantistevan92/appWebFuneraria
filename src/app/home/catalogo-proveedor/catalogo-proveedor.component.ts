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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categorias } from '../gestion-producto/interfaces/categoria.interface';
import { GestionProductoService } from '../gestion-producto/services/gestion-producto.service';
import { map } from 'rxjs';
import { ProductoResponse } from '../gestion-producto/interfaces/producto.interface';
import { GeneralService } from 'src/app/services/general.service';
import { Catalogo, CatalogoRequest } from './interface/catalogo.interface';

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

  formCatalogo!: FormGroup;
  formPrecio!: FormGroup;

  categorias : Categorias [] = [];
  proveedores : Proveedor [] = [];

  listaProductoPorCatalogo : ProductoResponse [] = [];
  formularioTocado = false;

  constructor(
    private activedRoute: ActivatedRoute,
    private paginatorLabel: MatPaginatorIntl,
    private _cp : CatalogoProveedorService,
    private _gp : GestionProductoService,
    private _alerSer: AlertService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private _gs : GeneralService

  ) { }

  ngOnInit(): void {
    this.listaUrl = this.activedRoute.snapshot.url;
    this.paginatorLabel.itemsPerPageLabel = "Items por página";
    this.initForm();
    this.mostrarProveedor();
    this.mostrarCategoriaProducto();


    // Suscribirse al evento valueChanges del control categoria_id
    this.formCatalogo.get('categoria_id')?.valueChanges.subscribe((categoria_id: number) => {
      //validacion normal
      /* if (categoria_id) {
        this._cp.getProductoPorCategoria(categoria_id).subscribe( resp => {
          console.log(resp);
          this.listaProductoPorCatalogo = resp.data;
        });
      } else {
        this.listaProductoPorCatalogo = []; // Vaciar el arreglo si no se selecciona una categoría válida
      } */

      //refactorizado a validacion ternaria
      categoria_id 
      ? this._cp.getProductoPorCategoria(categoria_id).subscribe(resp => { this.listaProductoPorCatalogo = resp.data as ProductoResponse[] }) 
      : this.listaProductoPorCatalogo = [];
    });
  }

  initForm() {
    this.formCatalogo = this.fb.group({
      categoria_id: ['', [Validators.required]],
      proveedor_id : ['', [Validators.required]],
    }); 
    
    this.formPrecio = this.fb.group({
      precio: [0],
    }); 
  }

  verimg(folder: string, image: string): string {
    return this._gs.verImagen(folder, image);
  }

  marcarFormularioTocado() {
    this.formularioTocado = true;
  }

  actualizarPrecio(producto: ProductoResponse) {
    const formCatalogo: Catalogo = this.formCatalogo.value;
    const formPrecio = this.formPrecio.value;
  
    if (formCatalogo.proveedor_id === undefined || formCatalogo.proveedor_id.toString() === '' || formCatalogo.proveedor_id === null) {
      this._alerSer.showAlert('Proveedor', 'Seleccione un proveedor', 'warning');
      return;
    }
  
    if (formPrecio.precio === 0) {
      this._alerSer.showAlert('Producto', `Ingrese el precio del producto ${this._gs.titlecase(producto.nombre)}`, 'warning');
      return;
    }
  
    let json: CatalogoRequest = {
      catalogo: {
        producto_id: producto.id,
        proveedor_id: formCatalogo.proveedor_id,
        precio: Number(parseFloat( formPrecio.precio ))
      }
    };

    this.guardandoCatalogo(json);
  }

  guardandoCatalogo(data : CatalogoRequest){
    this._cp.saveCatalogo(data).subscribe({
      next: (resp) => {
        if (resp.status) {
          this.formCatalogo.reset();
          this.formPrecio.reset();
          this._alerSer.showAlert('Catalgo',resp.message,'success'); 
        } else {
          this._alerSer.showAlert('Catalgo',resp.message,'warning'); 
        }
      },
      error: (err) => {
        console.log(err);
      }
    }
    )
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
          this.proveedores = resp.data;
          this.datosProveedor(resp.data);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  mostrarCategoriaProducto() {
    this._gp.getCategorias().pipe(
      map((resp) => resp.data.filter((categoria) => [ 1,2 ].includes(categoria.id!)).sort((a, b) => a.nombre_categoria.localeCompare(b.nombre_categoria)))
    ).subscribe({
      next: (categoriaFiltradosOrdenados) => {
        this.categorias = categoriaFiltradosOrdenados;
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
