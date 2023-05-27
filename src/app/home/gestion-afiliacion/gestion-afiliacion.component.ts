import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AfilicacionService } from './services/afilicacion.service';
import { Estado } from './interfaces/estados.interface';

@Component({
  selector: 'app-gestion-afiliacion',
  templateUrl: './gestion-afiliacion.component.html',
  styleUrls: ['./gestion-afiliacion.component.scss']
})
export class GestionAfiliacionComponent implements OnInit {

  displayedColumnsAfiliado: string[] = ['id','cliente','fecha','estado'];
  columnsToDisplayWithExpandAfiliado = [...this.displayedColumnsAfiliado, 'accion'];
  dataSourceAfiliado!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  estados : Estado [] = [];

  constructor(
    private paginatorLabel: MatPaginatorIntl,
    private _afiSer : AfilicacionService

  ) { }

  ngOnInit(): void {
    this.paginatorLabel.itemsPerPageLabel = "Items por página";
    this.getEstados();
  }

  ngAfterViewInit() {
    this.paginator._intl.getRangeLabel = this.getRangeDisplayText;
  }

  getEstados(){
    this._afiSer.getEstados().subscribe({
      next : (resp) => {
        this.estados = resp.data.filter((estado) => estado.id === 1 || estado.id === 3 || estado.id === 4);
      },
      error : (err) => {
        console.log(err);
      }
    });
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

  applyFilterAfiliado(e: any){

  }

  activarAfilicacion(item : any){

  }

  anularAfiliacion(item : any){

  }

}
