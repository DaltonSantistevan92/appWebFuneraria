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
import { PdfMakeWrapper, Table, Txt , Img, Cell, Columns , Stack, } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";

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

  exportarPdf(){
    console.log(this.listaProductoMasVendido);
    const fechaE = new Date();
    PdfMakeWrapper.setFonts(pdfFonts);
    const tableHeader = [
      new Txt('N°').bold().alignment('center').fontSize(10) .end,
      new Txt('Código').bold().alignment('center').fontSize(10) .end,
      new Txt('Producto').bold().alignment('center').fontSize(10) .end,
      new Txt('Cantidad').bold().alignment('center').fontSize(10) .end,
      new Txt('Precio de Venta').bold().alignment('center').fontSize(10) .end,
      new Txt('Total').bold().alignment('center').fontSize(10) .end,
    ];   
    let count = 1;
    const tableDataArray = this.listaProductoMasVendido.map((item)=>[
      new Txt(`${count++}` ).alignment('center').fontSize(10) .end,
      new Txt(item.producto.codigo).alignment('center').fontSize(10) .end,
      new Txt(item.producto.nombre).alignment('center').fontSize(10) .end,
      new Txt((item.cantidad).toString()).alignment('center').fontSize(10) .end,
      new Txt((item.producto.precio_venta).toFixed(2)).alignment('center').fontSize(10) .end,
      new Txt((item.total).toString()).alignment('center').fontSize(10) .end,
    ]);
    const pdf = new PdfMakeWrapper();
    try{
      pdf.add(
        
        new Txt(
          "Reporte de Productos más vendidos"
        )
        .alignment('center')
        .fontSize(14)
        .bold()
        .margin(10)
        .end
      );

      pdf.add(
        new Table([
          tableHeader,
          ...tableDataArray
        ]).widths('*')
  
        .alignment('center')
        .layout({
        
          fillColor: (rowIndex) => {
            // row 0 is the header
            if (rowIndex === 0) {
              return '#B5B2B2';
            }
    
            return '#ffffff';
          },
          paddingLeft: (rowIndex) => {
            if(rowIndex === 0){
              return 0;
            }
  
            return 8
          }
          
        })
        .end
      );    
      pdf.create().open();    
    }catch (error){
      console.error('Error al generar el PDF:', error);
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
