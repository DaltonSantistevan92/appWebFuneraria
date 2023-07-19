import { Component, Inject, OnInit } from '@angular/core';
import { Categorias, Servicio, ServicioDescripcionModificado } from '../interfaces/categoria.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { GestionProductoService } from '../services/gestion-producto.service';
import { map } from 'rxjs';
import { IntServicio } from '../interfaces/servicio.interface';
import { GeneralService } from 'src/app/services/general.service';

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

  constructor(
    public dialog: MatDialogRef<CrearEditarServicioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Servicio,
    private fb: FormBuilder,
    private _alerSer : AlertService,
    private _gp: GestionProductoService,
    private _gs : GeneralService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.mostrarCategoriaServicio();
    this.setServicio();
  }


  initForm() {
    this.formServicio = this.fb.group({
      categoria_id: ['', [Validators.required]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      imagen: [''],
    });
  }

  setServicio(){
    if (this.data != null) {
      this.listadoSeleccionado = this.data;
      this.serviceImagen(this.data.imagen);

      const { categoria_id, nombre, descripcion, precio, imagen } = this.data;
      this.formServicio.patchValue({ categoria_id, nombre, descripcion, precio, imagen });
    }
  }

  //AHI QUE MODIFICAR
  // mostrarCategoriaServicio2() {
  //   this._gp.getCategorias().pipe(
  //     map((resp) => resp.data.filter((categoria) => [ 3 ].includes(categoria.id!)).sort((a, b) => a.nombre_categoria.localeCompare(b.nombre_categoria)))
  //   ).subscribe({
  //     next: (categoriaFiltradosOrdenados) => {
  //       this.listaCategoria = categoriaFiltradosOrdenados;
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     }
  //   });
  // }

  mostrarCategoriaServicio() {
    this._gp.getCategoriasServicios().subscribe({
      next: (resp) => {
       this.listaCategoria = resp.data;
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
    this.formServicio.markAllAsTouched();
    if (this.formServicio.invalid) { return; }

    if (this.listadoSeleccionado) {//editar

      let dataServi : IntServicio = {...this.formServicio.value, id: this.listadoSeleccionado.id}
      const data = this.addObjeto(dataServi);
    
      if (dataServi.imagen === this.imagenDefault || dataServi.imagen === '') {
        this.actualizarServicio(data);
      } else {
        this.actualizarServicio(data);
        //servicio para guardar la img en el backend
        this.servicioGuardarImg(this.files,'img','servicios','subirArchivo',data.servicio.imagen);
      }
    } else {//guardar
      const form : IntServicio = this.formServicio.value;
      const data = this.addObjeto(form);

      this.registrarServicio(data);
      //servicio para guardar la img en el backend
      this.servicioGuardarImg(this.files,'img','servicios','subirArchivo',data.servicio.imagen);
    }
  }

  addObjeto(serv : IntServicio) : { servicio : IntServicio }{
    let servicio : IntServicio = {
      categoria_id : serv.categoria_id,
      nombre : serv.nombre,
      descripcion : serv.descripcion,
      precio : serv.precio,
      imagen : (this.activeImage) ? serv.imagen : this.imagenDefault,
    }

    if (serv.id) {
      let servicioId : IntServicio = { ...servicio, id : serv.id  }
      return { servicio : servicioId }
    } else {
      return { servicio : servicio }
    }
  }

  actualizarServicio(data : { servicio : IntServicio }){
    this._gp.updateServicio(data).subscribe({
      next: (resp) => {
        if (resp.status) {
          this.formServicio.reset();
          this._alerSer.showAlert('Servicio',resp.message,'success'); 
        } else {
          this._alerSer.showAlert('Servicio',resp.message,'warning'); 
        }        
      },
      error: (err) => { console.log(err) }
    });
  }

  servicioGuardarImg(file : File[], name: string, folder: string, url :string, nombreImg: string){
    this._gs.subirArchivo(file,name,folder,url).subscribe({
      next: (resp) => {
        if (resp.status) {
          const index = this.files[0].name.indexOf( nombreImg ?? '', 1);
          this.files.splice(index, 1);
          this.activeImage = false;
        }        
      },
      error: (err) => { console.log(err) }
    });
  }

  registrarServicio(data : { servicio : IntServicio }){
    this._gp.saveServicio(data).subscribe({
      next: (resp) => {
        if (resp.status) {
          this.formServicio.reset();
          this._alerSer.showAlert('Servicio',resp.message,'success'); 
          
        } else {
          this._alerSer.showAlert('Servicio',resp.message,'warning'); 
        }        
      },
      error: (err) => { console.log(err) }
    });
  }


  serviceImagen(imagen: string) {
    this._gs.mostrarArchivoBlod('servicios', imagen).subscribe({
      next: (blob) => { this.convertirFileReader(blob) },
      error: (err) => { console.log(err) }
    });
  }

  convertirFileReader(blob: any) {
    const reader = new FileReader();

    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      this.base64Image = reader.result as string;

      if (this.base64Image != '') {
        const arrayBufferFromBase64 = this.convertDataURIToBinary(this.base64Image);
        const imagemAsFile = new File([arrayBufferFromBase64], 'new-imagem', { type: 'image/png' });
        this.files.push(imagemAsFile);
        this.activeImage = true;
      }
    }
  }

  convertDataURIToBinary(dataURI: string) {//funcional 
    var BASE64_MARKER = ';base64,';
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }



}
