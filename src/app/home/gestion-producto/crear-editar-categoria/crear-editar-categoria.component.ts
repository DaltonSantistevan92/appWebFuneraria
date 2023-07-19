import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Categoria } from '../../gestion-afiliacion/interfaces/afiliados.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';
import { AlertService } from 'src/app/services/alert.service';
import { Categorias } from '../interfaces/categoria.interface';
import { GestionProductoService } from '../services/gestion-producto.service';


@Component({
  selector: 'app-crear-editar-categoria',
  templateUrl: './crear-editar-categoria.component.html',
  styleUrls: ['./crear-editar-categoria.component.scss']
})
export class CrearEditarCategoriaComponent implements OnInit {
  public listadoSeleccionado: any;
  public formCategoria!: FormGroup;

  files: File[] = [];
  activeImage: boolean = false;
  imagenDefault: string = 'category-default.png';
  base64Image: string = '';

  constructor(
    public dialog: MatDialogRef<CrearEditarCategoriaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Categorias,
    private fb: FormBuilder,
    private _gs : GeneralService,
    private _alerSer : AlertService,
    private _gp : GestionProductoService

  ) { }

  ngOnInit(): void {
    this.initForm();
    this.setCategoria();
  }


  initForm() {
    this.formCategoria = this.fb.group({
      nombre_categoria: ['', [Validators.required, Validators.minLength(3)]],
      img: [''],
      pertenece : ['',[Validators.required]]
    });
  }

  close(){
    this.dialog.close();
  }

  setCategoria(){
    if (this.data != null) {
      //console.log(this.data);
      
      this.listadoSeleccionado = this.data;
      this.serviceImagen(this.data.img);

      const { nombre_categoria, img, pertenece  } = this.data;
      this.formCategoria.patchValue({ nombre_categoria, img, pertenece });
    }
  }

  saveUpdateCategoria(){
    this.formCategoria.markAllAsTouched();
    if (this.formCategoria.invalid) { return; }
    
    if (this.listadoSeleccionado) {//editar
      let dataCate = {...this.formCategoria.value,id: this.listadoSeleccionado.id}

      if (dataCate.img === this.imagenDefault || dataCate.img === '') {
        const data = this.addObjeto(dataCate);
        this.actualizarCategoria(data);
      }else {
        const data = this.addObjeto(dataCate);
        //servicio para guardar la img en el backend
        this.servicioGuardarImg(this.files,'img','categorias','subirArchivo',data.categoria.img);
        this.actualizarCategoria(data);
      }
    } else { //guardar
      const form : Categorias = this.formCategoria.value;
      const data = this.addObjeto(form);
    
      // //servicio para guardar la img en el backend
      this.servicioGuardarImg(this.files,'img','categorias','subirArchivo',data.categoria.img);
      this.registrarCategoria(data);
    }
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

  addObjeto(cate : Categorias) : { categoria : Categorias }{
    let categoria : Categorias = {
      nombre_categoria : cate.nombre_categoria,
      img : (this.activeImage) ? cate.img : this.imagenDefault,
      pertenece : cate.pertenece
    }

    if (cate.id) {
      let categoriaId : Categorias = { ...categoria, id : cate.id  }
      return { categoria : categoriaId }
    } else {
      return { categoria : categoria }
    }
  }

  actualizarCategoria(data : { categoria : Categorias }){
    this._gp.updateCategoria(data).subscribe({
      next: (resp) => {
        if (resp.status) {
          this.formCategoria.reset();
          this._alerSer.showAlert('Categoria',resp.message,'success'); 
        } else {
          this._alerSer.showAlert('Categoria',resp.message,'warning'); 
        }        
      },
      error: (err) => { console.log(err) }
    });
  }

  registrarCategoria( data : { categoria : Categorias } ){
    this._gp.saveCategoria(data).subscribe({
      next: (resp) => {
        if (resp.status) {
          this.formCategoria.reset();
          this._alerSer.showAlert('Categoria',resp.message,'success'); 
        } else {
          this._alerSer.showAlert('Categoria',resp.message,'warning'); 
        }        
      },
      error: (err) => { console.log(err) }
    });
  }

  onSelect(event: any) {
    if (!this.activeImage) {//
      this.files.push(...event.addedFiles);
      this.activeImage = true;
      this.formCategoria.get('img')?.setValue(event.addedFiles[0].name);
    } else {
      this._alerSer.showAlert('Archivo','Solo sube 1 imagen !!','warning'); 
    }
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    this.activeImage = false;
    this.formCategoria.get('img')?.setValue('');
  }

  serviceImagen(imagen: string) {
    this._gs.mostrarArchivoBlod('categorias', imagen).subscribe({
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
