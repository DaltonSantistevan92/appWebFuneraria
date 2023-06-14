import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IntUrlActivate } from 'src/app/shared/breadcrumb/interfaces/bread.interface';
import { Estado } from '../gestion-afiliacion/interfaces/estados.interface';
import { map, take, tap } from 'rxjs';
import { AfilicacionService } from '../gestion-afiliacion/services/afilicacion.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { Proveedor } from '../catalogo-proveedor/interface/proveedor.interface';
import { GestionCompraService } from './services/gestion-compra.service';
import { ProductoProveedor } from './interfaces/producto-por-proveedor.interface';
import { GeneralService } from '../../../../../appMovilFuneraria/src/app/services/general.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { DetalleCompraObject } from './interfaces/detalle-compra-table.interface';
import { IntDataRequestCompra, IntFormCompra } from './interfaces/compra.interface';
import { CompraResponse } from './interfaces/compras-por-estados.interface';


@Component({
  selector: 'app-gestion-compra',
  templateUrl: './gestion-compra.component.html',
  styleUrls: ['./gestion-compra.component.scss']
})
export class GestionCompraComponent implements OnInit {
  listaUrl: IntUrlActivate[] = [];

  //CONSULTA DE COMPRA
  formConsultaCompra!  : FormGroup;
  estados : Estado [] = [];
  band : boolean = false;

  displayedColumnsCompraTable: string[] = ['id','serie','proveedor','created_at','estado'];
  columnsToDisplayWithExpandCompraTable = [...this.displayedColumnsCompraTable, 'accion'];
  dataSourceCompraTable! : MatTableDataSource<CompraResponse>;

  @ViewChild('MatPaginatorCompraTable') paginatorCompraTable!: MatPaginator;
  @ViewChild(MatSort) sortCompraTable!: MatSort;
  listaCompraTable: CompraResponse[] = [];


  //NUEVA COMPRA
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

  msgPersonalizado : boolean = false;
  msg : string = '';

  @ViewChild('inputCompraTable') inputCompraTable!: ElementRef;

  constructor(
    private activedRoute: ActivatedRoute,
    private _afiSer: AfilicacionService,
    private fb: FormBuilder,
    private _gc : GestionCompraService,
    private _gs : GeneralService,
    private _aus : AuthService,
    private _alerSer: AlertService,
    private paginatorLabel: MatPaginatorIntl,

  ) { }

  ngOnInit(): void {
    this.listaUrl = this.activedRoute.snapshot.url;
    this.paginatorLabel.itemsPerPageLabel = "Items por página";
    
    //CONSULTA DE COMPRA
    this.initFormConsulta();
    this.getEstados();
    //this.valuesChangeEstado();
    this.formConsultaCompra.get('estado_id')?.valueChanges.subscribe((estado_id:number) =>{
      this.tableEstadoCompras(estado_id);
    });

    //NUEVA COMPRA
    this.cargarProveedoresCatalogos();
    this.initFormCompra();
    this.cargarUser();
    this.valuesChangeProveedor();
    this.valuesChangeProducto();
    this.total();
  }

  //NUEVA COMPRA
  initFormCompra() {
    this.formCompra = this.fb.group({
      user_id : [''],//siempre
      name_user : [''],//siempre
      cargo : [''],//siempre
      fecha_compra : [''],//siempre
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

  valuesChangeProveedor(){
    this.formCompra.get('proveedor_id')?.valueChanges.subscribe((proveedor_id:number) => {
      if (proveedor_id === undefined ) { 
        this.formCompra.get('producto_id')?.setValue('');
        this.banderaProveedor = false;  //ocultar form proveedor
        return
      }

      if (proveedor_id.toString() === '') { return }

      if (proveedor_id != undefined) {
        this.productoSeleccionado = false;  //habilitado select proveedor
        this.cargarSelectProductos(proveedor_id);
      }
    });
  }

  valuesChangeProducto(){
    this.formCompra.get('producto_id')?.valueChanges.subscribe((producto_id:number) => { 
      if (producto_id != undefined) {
        if (this.productosProveedor != undefined) {
          const productoSeleccionado = this.productosProveedor.producto.find(producto => producto.id === producto_id);

          const razon_social = this._gs.titlecase(this.productosProveedor.proveedor.razon_social);
          const { proveedor : { ruc, correo, celular } } = this.productosProveedor;

          if(productoSeleccionado != undefined){ 
            this.banderaProveedor = true;//ver form proveedor
            const nombre_producto = this._gs.titlecase(productoSeleccionado.nombre as string);
            const precio_compra = productoSeleccionado.precio_compra.toFixed(2);
            this.formCompra.patchValue({razon_social,ruc,correo,celular,nombre_producto,precio_compra});
          }
        }
      }
    });
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

  cargarProveedoresCatalogos(){
    this._gc.getProveedoresCatalogo().subscribe({
      next: (resp) => { this.proveedoresCatalogo = resp.data; },
      error: (err) => { console.log(err); }
    });
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
    const form : IntFormCompra = this.formCompra.value;
    const arrayDetalleCompra = <FormArray>this.formCompra.get('detalle_compra');
    this.subTotal = Number((parseInt(form.cantidad) * parseFloat(form.precio_compra)).toFixed(2));

    const objDetalleCompra: DetalleCompraObject = {
      producto_id: form.producto_id,
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
        console.log('existeProducto',existeProducto);
        
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
      this.productoSeleccionado = false;//habilitado select proveedor
      this.banderaProveedor = false;//ocultar form proveedor
    }
  }

  saveCompra(){
    const formCompra : IntFormCompra = this.formCompra.value;
    const data = this.addObject(formCompra);
    this.serviceSave(data);
  }

  addObject(formCompra : IntFormCompra): IntDataRequestCompra {
    const json : IntDataRequestCompra = {
      compra : {
        user_id : formCompra.user_id,
        proveedor_id : formCompra.proveedor_id,
        total : formCompra.total
      },
      detalle_compra : formCompra.detalle_compra
    }
    return json;
  }

  serviceSave(data: IntDataRequestCompra ){
    this._gc.saveCompra(data).subscribe({
      next : (resp) => {
        if (resp.status) {
          this.resetCompra();
          this._alerSer.showAlert('Compra', resp.message, 'success');          
        } else {
          this._alerSer.showAlert('Compra', resp.message, 'warning');
        } 
      },
      error : (err) => { console.log(err); } 
    });
  }

  resetCompra(){
    this.productoSeleccionado = false; //habilitado select proveedor
    this.banderaProveedor = false;//ocultar form proveedor

    this.formCompra.get('proveedor_id')?.setValue('');
    this.formCompra.get('producto_id')?.setValue('');
    this.formCompra.get('cantidad')?.setValue('');
    this.formCompra.get('total')?.setValue('');
    this.formCompra.get('razon_social')?.setValue('');
    this.formCompra.get('ruc')?.setValue('');
    this.formCompra.get('correo')?.setValue('');
    this.formCompra.get('celular')?.setValue('');
    this.formCompra.get('nombre_producto')?.setValue('');
    this.formCompra.get('precio_compra')?.setValue('');

   // Vaciar el array cartDetalleCompra del servicio
   this._gc.vaciarCartDetalleCompra();

    const arrayDetalleCompra = this.formCompra.get('detalle_compra') as FormArray;
    arrayDetalleCompra.clear();

    this.newDetalleCompra = [];
    this.dataSourceDetalleCompra = new MatTableDataSource(this.newDetalleCompra);
  }


  //CONSULTA DE COMPRA
  initFormConsulta(){
    this.formConsultaCompra = this.fb.group({
      estado_id: ['', [Validators.required]],
    });
  }

  getEstados() {
    this._afiSer.getEstados().pipe(
      map((resp) => resp.data.filter((estado) => [1, 3, 5].includes(estado.id)).sort((a, b) => a.detalle.localeCompare(b.detalle)))
    ).subscribe({
      next: (estadosFiltradosOrdenados) => {
        this.estados = estadosFiltradosOrdenados;
      },
      error: (err) => { console.log(err); }
    });
  }

 /*  valuesChangeEstado(){
    this.formConsultaCompra.get('estado_id')?.valueChanges.subscribe((estado_id:number) =>{
      this.tableEstadoCompras(estado_id);
    });
  } */

  tableEstadoCompras(estado_id : number){
    this._gc.getComprasxEstados(estado_id).subscribe({
      next: (resp) => {
        if (resp.status) {
          this.band = true;
          this.msgPersonalizado = false;
          this.datosCompras(resp.data);
        } else {
          this.band = false;
          this.msgPersonalizado = true;

          if (estado_id !== undefined) {
            switch (estado_id) {
              case 1: this.msg = 'No hay compras pendientes' 
              break;
  
              case 3: this.msg = 'No hay compras anuladas'
              break;
  
              case 5: this.msg = 'No hay compras recibidas'
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

  datosCompras(compra : CompraResponse[]){
    this.listaCompraTable = [];
    this.listaCompraTable = compra;
    this.dataSourceCompraTable = new MatTableDataSource(this.listaCompraTable);
    setTimeout(() => { this.assignPaginatorAndSort(); }, 1000);
  }

  private assignPaginatorAndSort() {
    this.dataSourceCompraTable.paginator = this.paginatorCompraTable;
    this.dataSourceCompraTable.sort = this.sortCompraTable;
    this.paginatorCompraTable._intl.getRangeLabel = this.getRangeDisplayText;
    this.dataSourceCompraTable.filterPredicate = this.filterBySubject();//filtra por objeto
  }

  getRangeDisplayText = (page: number, pageSize: number, length: number) => {
    const initialText = `Mostrando Compras`;

    if (length == 0 || pageSize == 0) {
      return `${initialText} 0 de ${length}`;
    }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${initialText} ${startIndex + 1} a ${endIndex} de ${length}`;
  };

  filterBySubject() {
    let filterFunction = (compra: CompraResponse, filter: string): boolean => {
      if (filter) {
        const subjectCompra = compra;  //para objecto
        const razon_social = subjectCompra?.proveedor.razon_social || '';
        const serie = subjectCompra.serie || '';
        const fecha = subjectCompra.fecha || '';
        const estado = subjectCompra.estado.detalle || ''

        return razon_social.indexOf(filter) !== -1 || serie.indexOf(filter) !== -1 || fecha.indexOf(filter) !== -1 || estado.indexOf(filter) !== -1;
      } else {
        return true;
      }
    };  
    return filterFunction;
  }

  isEstadoBlocked(estadoId: number, currentEstadoId: number): boolean {
    if (currentEstadoId === 5 && (estadoId === 5 || estadoId === 1 || estadoId === 3)) {
      return true; // Bloquear estado "Recibido" (5) "Anulado" (3) , "Recibido" (5) y "Pendiente" (1)
    }
  
    if (currentEstadoId === 1 && (estadoId === 1)) {
      return true; // Bloquear estado "Pendiente" (1), y se activa "Anulado" (3) , "Recibido" (5)
    }

    if (currentEstadoId === 3 && (estadoId === 1 || estadoId === 3 || estadoId === 5)) {
      return true; // Bloquear estado "Anulado" (3), "Anulado" (3) , "Recibido" (5) y "Pendiente" (1)
    }
  
    return false; // Permitir los demás estados
  }

  openAlert(estadoSeleccionado : number, compra_id : number, estadoAnterior: number){
    const nombre = this.getNombreEstado(estadoSeleccionado);
  
    if (nombre === 'anulado') {
       const name = nombre.replace('anulado','anular')
       this.servicioEstado(name, estadoSeleccionado, compra_id, estadoAnterior);
    }else if(nombre === 'recibido'){
      const name = nombre.replace('recibido','recibir')
      this.servicioEstado(name, estadoSeleccionado, compra_id, estadoAnterior);
    }else {
      console.log('no pasa nd');
    }
  }

  servicioEstado(nombre: string, estadoSeleccionado: number, compra_id: number, estadoAnterior : number){
    this._alerSer.alertStatus(`Está seguro de ${nombre} la compra?`,'¡No podrás revertir esto!','warning').then((isConfirmed) => {
      if (isConfirmed) {
        //console.log('estadoSeleccionado',estadoSeleccionado);
        //console.log('compra_id',compra_id);
        //console.log('estadoAnterior',estadoAnterior);

        this._gc.getSetEstadoCompra(compra_id,estadoSeleccionado).subscribe({
          next: (resp) => {
            if (resp.status) {
              this.band = true;
              this.tableEstadoCompras(estadoAnterior);
              this._alerSer.showAlert('Compra',resp.message,'success');   
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

  getNombreEstado(estadoId: number): string {
    const estado = this.estados.find(e => e.id === estadoId);
    return estado ? estado.detalle : '';
  }


  applyFilterCompra(event : Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCompraTable.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceCompraTable.paginator) {
      this.dataSourceCompraTable.paginator.firstPage();
    }
  }

  verComprobantedeCompra(compra : CompraResponse){
    console.log('comporbante de compra',compra);
    
  }

}
