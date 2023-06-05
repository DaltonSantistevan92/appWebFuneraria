import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Proveedor } from '../interface/proveedor.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RucDirective } from 'src/app/directives/ruc.directive';
import { CatalogoProveedorService } from '../services/catalogo-proveedor.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-crear-editar-proveedor',
  templateUrl: './crear-editar-proveedor.component.html',
  styleUrls: ['./crear-editar-proveedor.component.scss']
})
export class CrearEditarProveedorComponent implements OnInit {
  public listadoSeleccionado: any;
  public formProveedor!: FormGroup;

  constructor(
    public dialog: MatDialogRef<CrearEditarProveedorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Proveedor,
    private fb: FormBuilder,
    private _cp: CatalogoProveedorService,
    private _alerSer : AlertService,

  ) { }

  ngOnInit(): void {
    this.initForm();
    this.setProveedor();
  }

  initForm() {
    this.formProveedor = this.fb.group({
      ruc: ['', [Validators.required]],
      razon_social : ['', [Validators.required,Validators.minLength(3)]],
      direccion : ['', [Validators.required]],
      correo : ['', [Validators.required]],
      celular : ['', [Validators.required]],
      telefono : ['', [Validators.required]],
    });
  }

  setProveedor(){
    if (this.data != null) {  
      this.listadoSeleccionado = this.data;
      const { ruc, razon_social, direccion, correo, celular, telefono } = this.data;
      this.formProveedor.patchValue({ ruc, razon_social, direccion, correo, celular, telefono });
    }
  }

  close(){
    this.dialog.close();
  }

  saveUpdateProveedor(){
    this.formProveedor.markAllAsTouched();
    if (this.formProveedor.invalid) { return; }
    
    if (this.listadoSeleccionado) {//editar
      let dataProveedor : Proveedor = {...this.formProveedor.value,id: this.listadoSeleccionado.id}
      const data = this.addObjeto(dataProveedor);
      this.actualizarProveedor(data);
    } else { //guardar
      const form : Proveedor = this.formProveedor.value;
      const data = this.addObjeto(form);
      this.registrarProveedor(data);
    }
  }

  addObjeto(prov : Proveedor) : { proveedor : Proveedor }{
    let proveedor : Proveedor = {
      ruc : prov.ruc,
      razon_social : prov.razon_social,
      direccion : prov.direccion,
      correo : prov.correo,
      celular : prov.celular,
      telefono : prov.telefono
    }

    if (prov.id) {
      let proveedorId : Proveedor = { ...proveedor, id : prov.id  }
      return { proveedor : proveedorId }
    } else {
      return { proveedor : proveedor }
    }
  }

  actualizarProveedor(data : { proveedor : Proveedor }){
    this._cp.updateProveedor(data).subscribe({
      next: (resp) => {
        if (resp.status) {
          this.formProveedor.reset();
          this._alerSer.showAlert('Proveedor',resp.message,'success'); 
        } else {
          this._alerSer.showAlert('Proveedor',resp.message,'warning'); 
        }        
      },
      error: (err) => { console.log(err) }
    });
  }

  registrarProveedor(data : { proveedor : Proveedor }){
    this._cp.saveProveedor(data).subscribe({
      next: (resp) => {
        if (resp.status) {
          this.formProveedor.reset();
          this._alerSer.showAlert('Proveedor',resp.message,'success'); 
        } else {
          this._alerSer.showAlert('Proveedor',resp.message,'warning'); 
        }        
      },
      error: (err) => { console.log(err) }
    });
  }

}
