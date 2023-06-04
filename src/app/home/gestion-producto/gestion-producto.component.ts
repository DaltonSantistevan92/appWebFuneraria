import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { IntUrlActivate } from 'src/app/shared/breadcrumb/interfaces/bread.interface';
import { GestionProductoService } from './services/gestion-producto.service';
import { CrearEditarCategoriaComponent } from './crear-editar-categoria/crear-editar-categoria.component';
import { GeneralService } from '../../services/general.service';
import { Categorias, IntSer, Servicio, ServicioDescripcionModificado } from './interfaces/categoria.interface';
import { AlertService } from 'src/app/services/alert.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { map } from 'rxjs';
import { CrearEditarServicioComponent } from './crear-editar-servicio/crear-editar-servicio.component';
import { ProductoResponse } from './interfaces/producto.interface';
import { CrearEditarProductoComponent } from './crear-editar-producto/crear-editar-producto.component';


@Component({
  selector: 'app-gestion-producto',
  templateUrl: './gestion-producto.component.html',
  styleUrls: ['./gestion-producto.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GestionProductoComponent implements OnInit {
  listaUrl: IntUrlActivate[] = [];

  //Categoria
  displayedColumnsCategoria: string[] = ['id','img','nombre_categoria'];
  columnsToDisplayWithExpandCategoria = [...this.displayedColumnsCategoria, 'accion'];
  dataSourceCategoria!: MatTableDataSource<Categorias>;

  @ViewChild('MatPaginatorCategoria') paginatorCategoria!: MatPaginator;
  @ViewChild(MatSort) sortCategoria!: MatSort;
  listaCategorias: Categorias[] = [];

  //Servicio
  displayedColumnsServicio: string[] = ['id','imagen','nombre','precio','nombre_categoria'];
  columnsToDisplayWithExpandServicio = [...this.displayedColumnsServicio, 'accion','expand'];
  dataSourceServicio!: MatTableDataSource<ServicioDescripcionModificado>;
  expandedElementServicio!: ServicioDescripcionModificado | null;

  @ViewChild('MatPaginatorServicio') paginatorServicio!: MatPaginator;
  @ViewChild(MatSort) sortServicio!: MatSort;
  listaServicios: ServicioDescripcionModificado[] = [];


  //Producto
  displayedColumnsProducto: string[] = ['id','imagen','codigo','nombre','categoria','stock','precio_compra','precio_venta','margen_ganancia'];
  columnsToDisplayWithExpandProducto = [...this.displayedColumnsProducto, 'accion'];
  dataSourceProducto!: MatTableDataSource<ProductoResponse>;

  @ViewChild('MatPaginatorProducto') paginatorProducto!: MatPaginator;
  @ViewChild(MatSort) sortProducto!: MatSort;
  listaProductos: ProductoResponse[] = [];



  constructor(
    private activedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _gp: GestionProductoService,
    private _gs: GeneralService,
    private _alerSer: AlertService,
    private paginatorLabel: MatPaginatorIntl,

  ) { }

  ngOnInit(): void {
    this.listaUrl = this.activedRoute.snapshot.url;
    this.paginatorLabel.itemsPerPageLabel = "Items por página";
    this.mostrarCategoria();
    this.mostrarServicios();
    this.mostrarProducto();
  }

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }


  //Categoria
  crearNuevaCategoria() {
    const dialogRef = this.dialog.open(CrearEditarCategoriaComponent,
      { disableClose: true, width: '600px', height: '350px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.mostrarCategoria();
      }
    });
  }

  mostrarCategoria() {
    this._gp.getCategorias().subscribe({
      next: (resp) => {
        if (resp.status) {
          this.datosCategoria(resp.data);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  datosCategoria(categoria: Categorias[]) {
    this.listaCategorias = [];
    this.listaCategorias = categoria;
    this.dataSourceCategoria = new MatTableDataSource(this.listaCategorias);
    this.dataSourceCategoria.paginator = this.paginatorCategoria;
    this.dataSourceCategoria.sort = this.sortCategoria;
  }

  editarCategoria(categoria: Categorias) {
    const dialogRef = this.dialog.open(CrearEditarCategoriaComponent,
      { disableClose: true, data: categoria, width: '600px', height: '350px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.mostrarCategoria();
      }
    });
  }

  eliminarCategoria(categoria: Categorias) {
    this._alerSer.alertStatus(`Está seguro de eliminar la categoria ${categoria.nombre_categoria}?`, '¡No podrás revertir esto!', 'warning')
      .then((isConfirmed) => {
        if (isConfirmed) {
          this._gp.deleteCategoria(categoria.id!).subscribe({
            next: (resp) => {
              if (resp.status) {
                this._alerSer.showAlert('Categoria', resp.message, 'success');
                this.mostrarCategoria();
              } else {
                this._alerSer.showAlert('Categoria', resp.message, 'warning');
              }
            },
            error: (err) => {
              console.log(err);
            }
          });
        }
      });
  }

  applyFilterCategoria(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCategoria.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceCategoria.paginator) {
      this.dataSourceCategoria.paginator.firstPage();
    }
  }

  verimg(folder: string, image: string): string {
    return this._gs.verImagen(folder, image);
  }

  //Servivio
  crearNuevoServicio() {
    const dialogRef = this.dialog.open(CrearEditarServicioComponent,
                      { disableClose: true, width: '650px', height: '650px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.mostrarServicios();
      }
    });
  }

  applyFilterServicio(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceServicio.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceServicio.paginator) {
      this.dataSourceServicio.paginator.firstPage();
    }
  }

  mostrarServicios() {
    this._gp.getServicios().pipe(map((response: IntSer) =>
      response.data.map(item => ({ ...item, descripcion: item.descripcion.split(",") })))
    ).subscribe({
      next: (servicioModificadoDescripcion) => {
        this.datosServicios(servicioModificadoDescripcion);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  datosServicios(serviciosModificado: ServicioDescripcionModificado[]) {
    this.listaServicios = [];
    this.listaServicios = serviciosModificado;
    this.dataSourceServicio = new MatTableDataSource(this.listaServicios);
    setTimeout(() => { this.assignPaginatorAndSort(); }, 1000);
  }

  private assignPaginatorAndSort() {
    this.dataSourceServicio.paginator = this.paginatorServicio;
    this.dataSourceServicio.sort = this.sortServicio;
    this.dataSourceServicio.filterPredicate = this.filterBySubjectAndNumber();//filtra por objeto
  }

  filterBySubjectAndNumber() {
    let filterFunction = (servicio: ServicioDescripcionModificado, filter: string): boolean => {
      if (filter) {
        const subjects = servicio;  // para objeto
        const nombre = subjects.nombre || '';
        const nombre_categoria = subjects?.categoria.nombre_categoria || '';
        const precio = subjects.precio || 0;
  
        const filterNumber = parseInt(filter); // Convertir a número entero
  
        if (!isNaN(filterNumber)) {
          const precioString = precio.toString();
          return nombre.indexOf(filter) !== -1 || nombre_categoria.indexOf(filter) !== -1 || precioString.startsWith(filter);
        } else {
          return nombre.indexOf(filter) !== -1 || nombre_categoria.indexOf(filter) !== -1;
        }
      } else {
        return true;
      }
    };  
    return filterFunction;
  }

  editarServicio(serviciosModificado: ServicioDescripcionModificado) {
    const servicioOrginal: Servicio = { ...serviciosModificado, descripcion: serviciosModificado.descripcion.join(', ') };

    const dialogRef = this.dialog.open(CrearEditarServicioComponent,
                      { disableClose: true, data: servicioOrginal, width: '650px', height: '650px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.mostrarServicios();
      }
    });
  }

  eliminarServicio(servicios: ServicioDescripcionModificado) {
    this._alerSer.alertStatus(`Está seguro de eliminar el servicio ${servicios.nombre}?`, '¡No podrás revertir esto!', 'warning')
    .then((isConfirmed) => {
      if (isConfirmed) {
        this._gp.deleteServicio(servicios.id).subscribe({
          next: (resp) => {
            if (resp.status) {
              this._alerSer.showAlert('Servicio', resp.message, 'success');
              this.mostrarServicios();
            } else {
              this._alerSer.showAlert('Servicio', resp.message, 'warning');
            }
          },
          error: (err) => {
            console.log(err);
          }
        });
      }
    });
  }

  //Producto
  crearNuevoProducto(){
    const dialogRef = this.dialog.open(CrearEditarProductoComponent,
                      { disableClose: true, width: '600px', height: '500px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.mostrarProducto();
      }
    });
  }

  mostrarProducto() {
    this._gp.getProductos().subscribe({
      next: (resp) => {
        if (resp.status) {
          this.datosProductos(resp.data);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  datosProductos(producto :  ProductoResponse[]){
    this.listaProductos = [];
    this.listaProductos = producto;
    this.dataSourceProducto = new MatTableDataSource(this.listaProductos);
    this.dataSourceProducto.paginator = this.paginatorProducto;
    this.dataSourceProducto.sort = this.sortProducto;
  }

  applyFilterProducto(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceProducto.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceProducto.paginator) {
      this.dataSourceProducto.paginator.firstPage();
    }
  }

  editarProducto(producto : ProductoResponse){
    const dialogRef = this.dialog.open(CrearEditarProductoComponent,
      { disableClose: true, data: producto, width: '600px', height: '500px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.mostrarProducto();
      }
    });
  }

  eliminarProducto(producto : ProductoResponse){
    this._alerSer.alertStatus(`Está seguro de eliminar el producto ${producto.nombre}?`, '¡No podrás revertir esto!', 'warning')
    .then((isConfirmed) => {
      if (isConfirmed) {
        this._gp.deleteProducto(producto.id).subscribe({
          next: (resp) => {
            if (resp.status) {
              this._alerSer.showAlert('Producto', resp.message, 'success');
              this.mostrarProducto();
            } else {
              this._alerSer.showAlert('Producto', resp.message, 'warning');
            }
          },
          error: (err) => {
            console.log(err);
          }
        });
      }
    });
    
  }

  getStockColor(stock: number): object {
    if (stock === 0) {
      return { 'background-color': '#dc3545' };//rojo
    } else if (stock < 10) {
      return { 'background-color': '#ffca2c' };//amarillo
    } else {
      return { 'background-color': '#157347' };//verde
    }
  }
}
