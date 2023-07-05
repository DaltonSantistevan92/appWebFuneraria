import { Component, OnInit } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { IntUrlActivate } from 'src/app/shared/breadcrumb/interfaces/bread.interface';
import { GestionProductoService } from '../gestion-producto/services/gestion-producto.service';
import { ProductoResponse } from '../gestion-producto/interfaces/producto.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { InventarioService } from './services/inventario.service';
import { MatTableDataSource } from '@angular/material/table';
import { Inventario } from './interfaces/inventario.interface';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {
  listaUrl: IntUrlActivate[] = [];
  productos : ProductoResponse [] = [];
  formInventario! : FormGroup;

  displayedColumnsInventario: string[] = [
    'numero',
    'fecha',
    'tipo',
    'entrada_cantidad',
    'entrada_precio',
    'entrada_total',
    'salida_cantidad',
    'salida_precio',
    'salida_total',
    'disponible_cantidad',
    'disponible_precio',
    'disponible_total'
  ];
  
  dataSourceInventario!: MatTableDataSource<Inventario>;
  listaInventario : Inventario [] = [];
  band : boolean = false;


  constructor(
    private activedRoute: ActivatedRoute,
    private paginatorLabel: MatPaginatorIntl,
    private _gps : GestionProductoService,
    private fb: FormBuilder,
    private _alerSer : AlertService,
    private _ins : InventarioService


  ) { }

  ngOnInit(): void {
    this.listaUrl = this.activedRoute.snapshot.url;
    this.paginatorLabel.itemsPerPageLabel = "Items por página";
    this.initForm();
    this.mostrarProducto();
    
  }

  initForm(){
    this.formInventario = this.fb.group({
      producto_id: ['', [Validators.required]],
      fecha_inicio: ['', [Validators.required]],
      fecha_fin: ['', [Validators.required]],
    });
  }

  mostrarProducto(){
    this._gps.getProductos().subscribe({
      next : (resp) => {
        this.productos = resp.data;
      },
      error : (err) => {
        console.log(err);
      }
    });
  }

  applyFilterInventario(event:Event){

  }

  consultar(){
    if (this.formInventario.invalid) { return; }

    if (this.formInventario.valid) {
      const form = this.formInventario.value;

      let dateValidator = this.dateValidator(form.fecha_inicio, form.fecha_fin);

      if (dateValidator) {
        this.servicioKardex(parseInt(form.producto_id),form.fecha_inicio, form.fecha_fin);
        
      }

    }
  }

  servicioKardex(producto_id:number, fecha_inicio:string, fecha_fin:string){
    this._ins.getKardex(producto_id,fecha_inicio,fecha_fin).subscribe({
      next : (resp) => {
       //console.log(resp);
       if (resp.status) {
          this.band = true;
          this.datosInventario(resp.data); 
       } else {
          this.band = false;
       }
      },
      error : (err) => {
        console.log(err);
      }
    })
  }

  datosInventario(inventario: Inventario[]) {
    this.listaInventario = [];
    this.listaInventario = inventario;
    this.dataSourceInventario = new MatTableDataSource(this.listaInventario);
    // this.dataSourceInventario.paginator = this.paginatorCategoria;
    // this.dataSourceInventario.sort = this.sortCategoria;
  }

  dateValidator(fecha_inicio: string, fecha_fin: string): boolean {
    if (fecha_inicio && fecha_fin) {
      const start = new Date(fecha_inicio);
      const end = new Date(fecha_fin);

      if (start > end) {
        this._alerSer.showAlert('Inventario','La fecha fin no puede ser menor','warning'); 
        return false;
      }
    }
    return true;
  }

}
