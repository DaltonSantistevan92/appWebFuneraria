import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IntUrlActivate } from 'src/app/shared/breadcrumb/interfaces/bread.interface';
import { ProdMasVendidosService } from './services/prod-mas-vendidos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ProductoMasVendido } from '../interfaces/productoMasVendido.interface';

@Component({
  selector: 'app-productos-mas-vendidos',
  templateUrl: './productos-mas-vendidos.component.html',
  styleUrls: ['./productos-mas-vendidos.component.scss']
})
export class ProductosMasVendidosComponent implements OnInit {
  listaUrl: IntUrlActivate[] = [];
  formProductoVendido! : FormGroup;

  columnsToDisplayWithExpandProductoMasVendido: string[] = ['id','codigo','producto','cantidad','precio_venta','total'];
  dataSourceProductoMasVendido!: MatTableDataSource<ProductoMasVendido>;
 
  @ViewChild('MatPaginatorProductoMasVendido') paginatorProductoMasVendido!: MatPaginator;
  @ViewChild(MatSort) sortProductoMasVendido!: MatSort;
  listaProductoMasVendido: ProductoMasVendido[] = [];

  total: number = 0;


  constructor(
    private activedRoute: ActivatedRoute,
    private _pmvs : ProdMasVendidosService,
    private fb: FormBuilder,
    private _als : AlertService,

  ) { }

  ngOnInit(): void {
    this.listaUrl = this.activedRoute.snapshot.url;
    this.initForm();

  }

  initForm() {
    this.formProductoVendido = this.fb.group({
      fecha_inicio: ['', [Validators.required]],
      fecha_fin: ['', [Validators.required]]
    });
  }

  dateValidator(fecha_inicio: string, fecha_fin: string): boolean {
    if (fecha_inicio && fecha_fin) {
      const start = new Date(fecha_inicio);
      const end = new Date(fecha_fin);

      if (start > end) {
        this._als.showAlert('Prductos más vendidos', 'La fecha fin no puede ser menor', 'warning');
        return false;
      }
    }
    return true;
  }

  consultar(){
    if (this.formProductoVendido.invalid) { return; }

    if (this.formProductoVendido.valid) {
      const form = this.formProductoVendido.value;

      let dateValidator = this.dateValidator(form.fecha_inicio, form.fecha_fin);

      if (dateValidator) {
        this.mostrarProductoMasVendidos(form.fecha_inicio, form.fecha_fin);
      } else {
      
      }
    }
  }

  applyFilterProductoMasVendido(event: any){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceProductoMasVendido.filter = filterValue.trim().toLowerCase();
   
    if (this.dataSourceProductoMasVendido.paginator) {
      this.dataSourceProductoMasVendido.paginator.firstPage();
    }
    this.calculateTotals();
  }


  mostrarProductoMasVendidos(fecha_inicio: string, fecha_fin: string){
    this._pmvs.getProductoMasVendidos(fecha_inicio,fecha_fin).subscribe({
      next : (resp) => {
        if (resp.status) {
          console.log(resp.data);
          this.datosProductoMasVendido(resp.data);
        } else {
          
        }
      },
      error : (err) => {
        console.error(err);
      }
    })
  }

  datosProductoMasVendido(productoMasVendido: ProductoMasVendido[]) {
    this.listaProductoMasVendido = [];
    this.listaProductoMasVendido = productoMasVendido;
    this.dataSourceProductoMasVendido = new MatTableDataSource(this.listaProductoMasVendido);
    this.calculateTotals();
    //setTimeout(() => { this.assignPaginatorAndSort(); }, 1000);
  }


  calculateTotals() {
   
    this.total = this.dataSourceProductoMasVendido.filteredData.map(t => t.total).reduce((acc, value) => acc + value, 0);
  }
}
