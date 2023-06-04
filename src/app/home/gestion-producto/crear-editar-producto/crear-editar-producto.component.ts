import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductoResponse } from '../interfaces/producto.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';
import { AlertService } from 'src/app/services/alert.service';
import { GestionProductoService } from '../services/gestion-producto.service';
import { Categorias } from '../interfaces/categoria.interface';
import { map } from 'rxjs';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { IntServicio } from '../interfaces/servicio.interface';

@Component({
  selector: 'app-crear-editar-producto',
  templateUrl: './crear-editar-producto.component.html',
  styleUrls: ['./crear-editar-producto.component.scss']
})
export class CrearEditarProductoComponent implements OnInit {
  public listadoSeleccionado: any;
  public formProducto!: FormGroup;

  files: File[] = [];
  activeImage: boolean = false;
  imagenDefault: string = 'category-default.png';
  base64Image: string = '';

  listaCategoria : Categorias [] = [];


  constructor(
    public dialog: MatDialogRef<CrearEditarProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductoResponse,
    private fb: FormBuilder,
    private _gs : GeneralService,
    private _alerSer : AlertService,
    private _gp : GestionProductoService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.mostrarCategoriaProducto();
    this.setProducto();
  }


  initForm() {
    this.formProducto = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion : ['', [Validators.required]],
      categoria_id : ['', [Validators.required]],
      imagen: [''],
      stock : [0]
    });
  }

  close(){
    this.dialog.close();
  }

  setProducto(){
    if (this.data != null) {
      //console.log(this.data);
      
      this.listadoSeleccionado = this.data;
      this.serviceImagen(this.data.imagen);
  
      const { nombre, descripcion, categoria_id, imagen, stock } = this.data;
      this.formProducto.patchValue({ nombre, descripcion, categoria_id, imagen, stock  });
    }

  }

  saveUpdateProducto(){
    this.formProducto.markAllAsTouched();
    if (this.formProducto.invalid) { return; }
    
    if (this.listadoSeleccionado) {//editar
      let dataProd : IntServicio = {...this.formProducto.value,id: this.listadoSeleccionado.id}

      if (dataProd.imagen === this.imagenDefault || dataProd.imagen === '') {
        const data = this.addObjeto(dataProd);
        this.actualizarProducto(data);
      }else {
        const data = this.addObjeto(dataProd);
        //servicio para guardar la img en el backend
        this.servicioGuardarImg(this.files,'img','productos','subirArchivo',data.producto.imagen);
        this.actualizarProducto(data);
      }
    } else { //guardar
      const form : IntServicio = this.formProducto.value;
      const data = this.addObjeto(form);
    
      //servicio para guardar la img en el backend
      this.servicioGuardarImg(this.files,'img','productos','subirArchivo',data.producto.imagen);
      this.registrarProducto(data);
    }
  }

  addObjeto(pro : IntServicio) : { producto : IntServicio }{
    let producto : IntServicio = {
      nombre : pro.nombre,
      descripcion : pro.descripcion,
      categoria_id : pro.categoria_id,
      imagen : (this.activeImage) ? pro.imagen : this.imagenDefault,
      precio : pro.precio
    }

    if (pro.id) {
      let productoId : IntServicio = { ...producto, id : pro.id  }
      return { producto : productoId }
    } else {
      return { producto : producto }
    }
  }

  actualizarProducto(data : { producto : IntServicio }){
    this._gp.updateProducto(data).subscribe({
      next: (resp) => {
        if (resp.status) {
          this.formProducto.reset();
          this._alerSer.showAlert('Producto',resp.message,'success'); 
        } else {
          this._alerSer.showAlert('Producto',resp.message,'warning'); 
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

  registrarProducto(data : { producto : IntServicio }){
    this._gp.saveProducto(data).subscribe({
      next: (resp) => {
        if (resp.status) {
          this.formProducto.reset();
          this._alerSer.showAlert('Producto',resp.message,'success'); 
        } else {
          this._alerSer.showAlert('Producto',resp.message,'warning'); 
        }        
      },
      error: (err) => { console.log(err) }
    });
  }

  mostrarCategoriaProducto() {
    this._gp.getCategorias().pipe(
      map((resp) => resp.data.filter((categoria) => [ 1,2 ].includes(categoria.id!)).sort((a, b) => a.nombre_categoria.localeCompare(b.nombre_categoria)))
    ).subscribe({
      next: (categoriaFiltradosOrdenados) => {
        this.listaCategoria = categoriaFiltradosOrdenados;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  onSelect(event: NgxDropzoneChangeEvent) {
    if (!this.activeImage) {//
      this.files.push(...event.addedFiles);
      this.activeImage = true;
      this.formProducto.get('imagen')?.setValue(event.addedFiles[0].name);
    } else {
      this._alerSer.showAlert('Archivo','Solo sube 1 imagen !!','warning'); 
    }
  }

  /* onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
    this.activeImage = false;
    this.formProducto.get('imagen')?.setValue('');
  } */

  onRemove(event: File) {
    this.files = this.files.filter(file => file !== event);
    this.activeImage = false;
    this.formProducto.get('imagen')?.setValue('');
  }

  getStockColor(stock: number): object {
    if (stock === 0) {
      return { 'background-color': '#dc3545' };//rojo
    } else if (stock < 10) {
      return { 'background-color': '#ffca2c' };//amarillo
    } else {
      return { 'background-color': '#157347' };//verde
    }
  }

  serviceImagen(imagen: string) {
    this._gs.mostrarArchivoBlod('productos', imagen).subscribe({
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
