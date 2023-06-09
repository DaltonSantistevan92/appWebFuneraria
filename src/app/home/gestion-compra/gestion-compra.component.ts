import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IntUrlActivate } from 'src/app/shared/breadcrumb/interfaces/bread.interface';
import { Estado } from '../gestion-afiliacion/interfaces/estados.interface';
import { filter, finalize, map, take, tap } from 'rxjs';
import { AfilicacionService } from '../gestion-afiliacion/services/afilicacion.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Proveedor } from '../catalogo-proveedor/interface/proveedor.interface';
import { GestionCompraService } from './services/gestion-compra.service';
import { Producto } from '../../../../../appMovilFuneraria/src/app/home/interfaces/categoria-producto.interface';
import { ProductoProveed, ProductoProveedor } from './interfaces/producto-por-proveedor.interface';
import { GeneralService } from '../../../../../appMovilFuneraria/src/app/services/general.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { DetalleCompraObject } from './interfaces/detalle-compra-table.interface';



@Component({
  selector: 'app-gestion-compra',
  templateUrl: './gestion-compra.component.html',
  styleUrls: ['./gestion-compra.component.scss']
})
export class GestionCompraComponent implements OnInit {
  listaUrl: IntUrlActivate[] = [];

  estados : Estado [] = [];

  formConsultaCompra!  : FormGroup;

  //Compras
  displayedColumnsCompras: string[] = ['id','ruc','razon_social','direccion','correo','celular','telefono'];
  columnsToDisplayWithExpandCompras = [...this.displayedColumnsCompras, 'accion'];
  dataSourceCompras!: MatTableDataSource<any>;

  @ViewChild('MatPaginatorCompras') paginatorCompras!: MatPaginator;
  @ViewChild(MatSort) sortCompras!: MatSort;
  listaCompras: any[] = [];

  proveedoresCatalogo : Proveedor[] = [];
  productosProveedor! : ProductoProveedor;

  formCompra!  : FormGroup;
  detalle_compra = new FormControl();
  newDetalleCompra: DetalleCompraObject[] = [];

  subTotal: number = 0.00;
  totalGeneral: number = 0.00;

  displayedColumnsDetalleCompra: string[] = ['producto_id','nombre_producto','cantidad','precio','subTotal'];
  columnsToDisplayWithExpandDetalleCompra = [...this.displayedColumnsDetalleCompra, 'accion'];
  dataSourceDetalleCompra!: MatTableDataSource<DetalleCompraObject>;

  banderaProveedor : boolean = false;
  productoSeleccionado : boolean = false;


  constructor(
    private activedRoute: ActivatedRoute,
    private _afiSer: AfilicacionService,
    private fb: FormBuilder,
    private _gc : GestionCompraService,
    private _gs : GeneralService,
    private _aus : AuthService,
    private _alerSer: AlertService,
  ) { }

  ngOnInit(): void {
    this.listaUrl = this.activedRoute.snapshot.url;
    
    //consulta
    this.initFormConsulta();
    this.getEstados();

    this.formConsultaCompra.get('estado_id')?.valueChanges.subscribe((id:number) =>{
      this.tableEstadoCompras(id);
    });

    //compra
    this.cargarProveedoresCatalogos();
    this.initFormCompra();
    this.cargarUser();

    this.formCompra.get('proveedor_id')?.valueChanges.subscribe((proveedor_id:number) => {
      if (proveedor_id != undefined) {
        this.productoSeleccionado = false;  //normal select proveedor
        this.cargarSelectProductos(proveedor_id);
      }
      this.formCompra.get('producto_id')?.setValue('');
      this.banderaProveedor = false;
    });

    this.formCompra.get('producto_id')?.valueChanges.subscribe((producto_id:number) => { 
      if (producto_id != undefined) {
        if (this.productosProveedor != undefined) {
          const productoSeleccionado = this.productosProveedor.producto.find(producto => producto.id === producto_id);

          const razon_social = this._gs.titlecase(this.productosProveedor.proveedor.razon_social);
          const { proveedor : { ruc, correo, celular } } = this.productosProveedor;

          if(productoSeleccionado != undefined){ 
            this.banderaProveedor = true;

            const nombre_producto = this._gs.titlecase(productoSeleccionado.nombre as string);
            const precio_compra = productoSeleccionado.precio_compra.toFixed(2);

            this.formCompra.patchValue({razon_social,ruc,correo,celular,nombre_producto,precio_compra});
          }
        }
      }
    });

    this.total();
  }

  cargarUser(){
    if (this._aus.tokenDecodificado) {
      const user_id =  this._aus.tokenDecodificado.user.id;
      const name_user = this._gs.titlecase(this._aus.tokenDecodificado.user.name);
      const cargo = this._gs.titlecase(this._aus.tokenDecodificado.user.rol.cargo);
      const fc = new Date().toISOString().substring(0, 10);
      const fecha_compra = new FormControl(fc).value;
      this.formCompra.patchValue({user_id,name_user,cargo,fecha_compra}); 
    }
  }

  initFormCompra() {
    this.formCompra = this.fb.group({
      user_id : [''],//
      name_user : [''],
      cargo : [''],
      fecha_compra : [''],
      producto_id: [''],
      cantidad: [''],
      proveedor_id: ['', [Validators.required]],//
      total : [''],
      razon_social : [''],
      ruc : [''],
      correo : [''],
      celular : [''],
      nombre_producto : [''],
      precio_compra : [''],
      detalle_compra: this.fb.array([], [Validators.required])

    }); 
  }

  initFormConsulta(){
    this.formConsultaCompra = this.fb.group({
      estado_id: ['', [Validators.required]],
    });
  }

  getEstados() {
    this._afiSer.getEstados().pipe(
      map((resp) => resp.data.filter((estado) => [1, 2, 3].includes(estado.id)).sort((a, b) => a.detalle.localeCompare(b.detalle)))
    ).subscribe({
      next: (estadosFiltradosOrdenados) => {
        this.estados = estadosFiltradosOrdenados;
      },
      error: (err) => { console.log(err); }
    });
  }

  cargarProveedoresCatalogos(){
    this._gc.getProveedoresCatalogo().subscribe({
      next: (resp) => { this.proveedoresCatalogo = resp.data; },
      error: (err) => { console.log(err); }
    });
  }

  tableEstadoCompras(estado_id : number){
    
  }

  cargarSelectProductos(proveedor_id : number ){
    this._gc.getProductosPorProveedores(proveedor_id).subscribe({
      next: (resp) => { this.productosProveedor = resp.data; },
      error: (err) => { console.log(err); }
    });
  }

  addProductoAlDetalleCompra(){
    if (this.formCompra.get('cantidad')?.value == '') { 
      const producto = this.formCompra.get('nombre_producto')?.value;
      this._alerSer.showAlert('Compra', `Ingrese una cantidad para el producto ${this._gs.titlecase(producto)}`, 'warning');
      return 
    }
    const form = this.formCompra.value;
    const arrayDetalleCompra = <FormArray>this.formCompra.get('detalle_compra');
    this.subTotal = Number((parseInt(form.cantidad) * parseFloat(form.precio_compra)).toFixed(2));

    const objDetalleCompra: DetalleCompraObject = {
      producto_id: parseInt(form.producto_id),
      nombre_producto: form.nombre_producto,
      cantidad: parseInt(form.cantidad),
      precio: Number(parseFloat(form.precio_compra).toFixed(2)),
      subTotal: this.subTotal
    }
    this.procesandoTable(arrayDetalleCompra, objDetalleCompra);
    this.formCompra.get('producto_id')?.setValue('');
    this.formCompra.get('cantidad')?.setValue('');    
  }

  procesandoTable(arrayDetalleCompra: FormArray, objDetalleCompra: DetalleCompraObject) {
    this._gc.getDetallesCompra().pipe(
      take(1),
      map(detalles => detalles.some(detalle => detalle.producto_id === objDetalleCompra.producto_id)),
      tap(existeProducto => {
        if (existeProducto) {
          this._alerSer.showAlert('Compra', `Ya existe el producto ${this._gs.titlecase(objDetalleCompra.nombre_producto)}`, 'warning');
        } else {
          this.productoSeleccionado = true; //disabled select proveedor
          this._gc.agregarDetalleCompra(objDetalleCompra);
          arrayDetalleCompra.push(new FormControl(objDetalleCompra));
          this.newDetalleCompra = arrayDetalleCompra.value;
          this.dataSourceDetalleCompra = new MatTableDataSource(this.newDetalleCompra);
        }
      })
    ).subscribe();
  }

  total(){
    this._gc.totalGeneralPrice$.subscribe( totalGeneral => {
      this.totalGeneral = totalGeneral
      this.formCompra.get('total')?.setValue(this.totalGeneral);
    });
  }

  aumentar(producto : DetalleCompraObject){
    this._gc.aumentarCantidad(producto);
  }

  disminuir(producto : DetalleCompraObject){
    this._gc.disminuirCantidad(producto);
  }

  eliminar(producto : DetalleCompraObject){
    this._gc.eliminarDetalleCompra(producto);

    const arrayDetalleCompra = <FormArray>this.formCompra.get('detalle_compra');
    const index = arrayDetalleCompra.value.findIndex((item: DetalleCompraObject) => item === producto);

    if (index !== -1) {
      arrayDetalleCompra.removeAt(index);
    }
    this.newDetalleCompra = arrayDetalleCompra.value;
    this.dataSourceDetalleCompra = new MatTableDataSource(this.newDetalleCompra);

    if (this.newDetalleCompra.length == 0) {
      this.productoSeleccionado = false;
      this.banderaProveedor = false;
    }
  }


  saveCompra(){
    const formCompra = this.formCompra.value;
    console.log('formCompra', formCompra);

  }
}
