import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AfiliadosActivos } from '../../reportes/interfaces/afiliados-activos.interface';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialogRef } from '@angular/material/dialog';
import { AfiliacionesService } from '../../reportes/afiliaciones/services/afiliaciones.service';

@Component({
  selector: 'app-modal-afi',
  templateUrl: './modal-afi.component.html',
  styleUrls: ['./modal-afi.component.scss']
})
export class ModalAfiComponent implements OnInit {
  displayedColumnsAfiliadosActivos: string[] = ['id','cedula','afiliado','celular','direccion'];
  columnsToDisplayWithExpandAfiliadosActivos = [...this.displayedColumnsAfiliadosActivos, 'accion'];
  dataSourceAfiliadosActivos!: MatTableDataSource<AfiliadosActivos>;

  @ViewChild('MatPaginatorAfiliadosActivo') paginatorAfiliadosActivos!: MatPaginator;
  @ViewChild(MatSort) sortAfiliadosActivos!: MatSort;
  listaAfiliadosActivos: AfiliadosActivos[] = [];

 constructor(
   public dialog: MatDialogRef<ModalAfiComponent>,
   private _as : AfiliacionesService,
   private paginatorLabel: MatPaginatorIntl,

 ) { }

 ngOnInit(): void {
   this.paginatorLabel.itemsPerPageLabel = "Items por página";
   this.mostraAfiliadosActivos();
 }

 mostraAfiliadosActivos(){
   this._as.getAfiliadosActivos().subscribe({
     next : (resp) => {
       //console.log('modal-afi',resp);
       if (resp.status) {
         this.datosAfiliadosActivos(resp.data);
       }
     },
     error : (err) => {
       console.log(err);
     }
   });
 }

 datosAfiliadosActivos(afiliados: AfiliadosActivos[]) {
   this.listaAfiliadosActivos = [];
   this.listaAfiliadosActivos = afiliados;
   this.dataSourceAfiliadosActivos = new MatTableDataSource(this.listaAfiliadosActivos);
   setTimeout(() => { this.assignPaginatorAndSort(); }, 1000);
 }


 private assignPaginatorAndSort() {
   this.dataSourceAfiliadosActivos.paginator = this.paginatorAfiliadosActivos;
   this.dataSourceAfiliadosActivos.sort = this.sortAfiliadosActivos;
   this.paginatorAfiliadosActivos._intl.getRangeLabel = this.getRangeDisplayText;
   this.dataSourceAfiliadosActivos.filterPredicate = this.filterBySubject();//filtra por objeto
 }

 getRangeDisplayText = (page: number, pageSize: number, length: number) => {
   const initialText = `Mostrando Afiliados`;

   if (length == 0 || pageSize == 0) {
     return `${initialText} 0 de ${length}`;
   }

   length = Math.max(length, 0);

   const startIndex = page * pageSize;

   const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
   return `${initialText} ${startIndex + 1} a ${endIndex} de ${length}`;
 };

 filterBySubject() {
   let filterFunction = (afiliados: AfiliadosActivos, filter: string): boolean => {
     if (filter) {
       const subjectAfiliados = afiliados;  //para objecto
       const cedula = subjectAfiliados.cliente.persona.cedula || '';
       const afiliado = subjectAfiliados.cliente.persona.nombres || subjectAfiliados.cliente.persona.apellidos;
       const celular = subjectAfiliados.cliente.persona.celular || '';
       const direccion = subjectAfiliados.cliente.persona.direccion || ''

       return cedula.indexOf(filter) !== -1 || afiliado.indexOf(filter) !== -1 || celular.indexOf(filter) !== -1 || direccion.indexOf(filter) !== -1;
     } else {
       return true;
     }
   };  
   return filterFunction;
 }

 cerrar(){
   this.dialog.close();
 }

 applyFilterAfiliadosActivos(event : Event){
   const filterValue = (event.target as HTMLInputElement).value;
   this.dataSourceAfiliadosActivos.filter = filterValue.trim().toLowerCase();
   if (this.dataSourceAfiliadosActivos.paginator) {
     this.dataSourceAfiliadosActivos.paginator.firstPage();
   }
 }


}
