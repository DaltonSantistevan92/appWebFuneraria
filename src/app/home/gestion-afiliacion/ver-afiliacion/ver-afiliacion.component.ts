import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Afiliado, Detalleafiliado } from '../interfaces/afiliados.interface';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GeneralService } from '../../../services/general.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-ver-afiliacion',
  templateUrl: './ver-afiliacion.component.html',
  styleUrls: ['./ver-afiliacion.component.scss']
})
export class VerAfiliacionComponent implements OnInit {
  formAfiliado! : FormGroup;
  listaAfiliado! : Afiliado;

  displayedColumnsAfiliadoServicio: string[] = ['id','imagen','servicio','precio_servicio','mes','costo_mensual'];
  dataSourceAfiliadoServicio!: MatTableDataSource<Detalleafiliado>;

  detalle_afiliado = new FormControl();
  totalCostos: number = 0.00;


  constructor(
    public dialog: MatDialogRef<VerAfiliacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Afiliado,
    private fb: FormBuilder,
    private _gs : GeneralService

  ) { }

  ngOnInit(): void {
    this.initFormAfiliado();
    this.changeAfiliado();
  }

  initFormAfiliado(){
    this.formAfiliado = this.fb.group({ 
      cedula : [''],
      nombre_completo : [''],
      celular : [''],
      direccion : [''],
      email : [''],
      estado_civil : [''],
      parentesco : [''],
      nombre_contacto : [''],
      num_celular_contacto : [''],
      fecha : [''],
      estado_id : [''],
      estado : [''],
      detalle_afiliado: this.fb.array([])

    });
  }

  changeAfiliado(){
    if (this.data != null) {
      const {fecha, estado_id, estado, cliente : { persona }, estado_civil, contacto_emergencia, detalle_afiliado } = this.data;
     
      const detalleAfiliadoArray = this.formAfiliado.get('detalle_afiliado') as FormArray;

      detalle_afiliado.forEach((detalle: Detalleafiliado) => {
        const detalleAfiliadoGroup = this.fb.group({    
          imagen : [detalle.servicio.imagen],
          servicio : [detalle.servicio.nombre],
          precio_servicio : [detalle.servicio.precio],
          mes : [detalle.duracion_mes.duracion],
          costo_mensual : [detalle.costo_mensual],
        });
      detalleAfiliadoArray.push(detalleAfiliadoGroup);
    });

      const data = {
        cedula : persona.cedula,
        nombre_completo : `${ this._gs.titlecase(persona.nombres) } ${ this._gs.titlecase(persona.apellidos) }`,
        celular : persona.celular,
        direccion : this._gs.titlecase(persona.direccion) ?? '',
        email : persona.user[0].email,
        estado_civil : estado_civil.status,
        parentesco : this._gs.titlecase(contacto_emergencia[0].parentesco.relacion),
        nombre_contacto : this._gs.titlecase(contacto_emergencia[0].nombre),
        num_celular_contacto : contacto_emergencia[0].num_celular,
        fecha,
        estado_id,
        estado : this._gs.titlecase(estado.detalle),
      }
      this.formAfiliado.patchValue(data);

      this.dataSourceAfiliadoServicio = new MatTableDataSource(detalleAfiliadoArray.value);
      this.calculateTotalCostos();
      
    }
  }

  calculateTotalCostos(): void {
    this.totalCostos = this.dataSourceAfiliadoServicio.data.reduce((total, data: Detalleafiliado) => total + data.costo_mensual, 0);
  }

  getStateColor() {
    const estado_id = this.formAfiliado.get('estado_id')?.value;

    if (estado_id === 4) {
      return 'primary';
    } else if (estado_id === 1) {
      return 'accent';
    } else {
      return 'warn';
    }
  }

  getStateLabel() {
    const estado = this.formAfiliado.get('estado')?.value;
    return estado;
  }

  close() {
    this.dialog.close();
  }

}
