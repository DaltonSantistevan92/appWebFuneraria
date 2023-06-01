import { Component, Inject, OnInit } from '@angular/core';
import { Categorias, ServicioDescripcionModificado } from '../interfaces/categoria.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { GestionProductoService } from '../services/gestion-producto.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-crear-editar-servicio',
  templateUrl: './crear-editar-servicio.component.html',
  styleUrls: ['./crear-editar-servicio.component.scss']
})
export class CrearEditarServicioComponent implements OnInit {
  public listadoSeleccionado: any;
  public formServicio!: FormGroup;

  files: File[] = [];
  activeImage: boolean = false;
  imagenDefault: string = 'service-default.png';
  base64Image: string = '';

  listaCategoria : Categorias [] = [];

  numerosDecimales="^[0-9]+(\.[0-9]{1,2})?$"

  constructor(
    public dialog: MatDialogRef<CrearEditarServicioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ServicioDescripcionModificado,
    private fb: FormBuilder,
    private _alerSer : AlertService,
    private _gp: GestionProductoService,


  ) { }

  ngOnInit(): void {
    this.initForm();
    this.mostrarCategoria();
  }


  initForm() {
    this.formServicio = this.fb.group({
      categoria_id: ['', [Validators.required]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required]],
      precio: ['', [Validators.required]],  /* Validators.pattern(this.numerosDecimales) */
      imagen: [''],
    });
  }

  mostrarCategoria() {
    this._gp.getCategorias().pipe(
      map((resp) => resp.data.filter((categoria) => [ 3 ].includes(categoria.id!)).sort((a, b) => a.nombre_categoria.localeCompare(b.nombre_categoria)))
    ).subscribe({
      next: (categoriaFiltradosOrdenados) => {
        this.listaCategoria = categoriaFiltradosOrdenados;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  


  onSelect(event: any) {
    if (!this.activeImage) {//
      this.files.push(...event.addedFiles);
      this.activeImage = true;
      this.formServicio.get('imagen')?.setValue(event.addedFiles[0].name);
    } else {
      this._alerSer.showAlert('Archivo','Solo sube 1 imagen !!','warning'); 
    }
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    this.activeImage = false;
    this.formServicio.get('imagen')?.setValue('');
  }

  close(){
    this.dialog.close();
  }

  saveUpdateServicio(){

  }

}
