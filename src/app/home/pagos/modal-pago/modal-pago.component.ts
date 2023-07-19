import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ResponseAfiliado } from '../../reportes/interfaces/afiliados-activos.interface';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { GeneralService } from '../../../../../../appMovilFuneraria/src/app/services/general.service';
import { PagosService } from '../services/pagos.service';
import { AlertService } from 'src/app/services/alert.service';


@Component({
  selector: 'app-modal-pago',
  templateUrl: './modal-pago.component.html',
  styleUrls: ['./modal-pago.component.scss']
})
export class ModalPagoComponent implements OnInit {
  formPago!: FormGroup;

  constructor(
    public dialog: MatDialogRef<ModalPagoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ResponseAfiliado,
    private fb: FormBuilder,
    private _gs: GeneralService,
    private _sp : PagosService,
    private _als : AlertService


  ) { }

  ngOnInit(): void {
    this.initForm();
    this.setearDatos();
    this.valueChangesMes();

  }

  nonNegativeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value;
      if (value === null || value < 0) {
        return { nonNegative: true };
      }
      return { nonNegative: 0 };
    };
  }

  initForm() {
    this.formPago = this.fb.group({
      afiliado_id: [''],
      cliente: [''],
      servicio_id: [''],
      servicio: [''],
      mes: [1, [Validators.required, this.nonNegativeValidator()]],
      duracion_meses: [''],
      monto_mensual: [0],
      total_pagar: [0],
      letras_pendientes: [''],
      letras_pagadas: ['']
    });
  }

  setearDatos() {
    const { afiliado_id, cliente, servicio_id, servicio, duracion_meses, monto_mensual, letras_pendientes, letras_pagadas } = this.data;
    this.formPago.get('letras_pendientes')?.setValue(parseInt(letras_pendientes));

    this.formPago.get('mes')?.setValidators([Validators.max(parseInt(letras_pendientes))]);
    this.formPago.get('mes')?.updateValueAndValidity();

    const total_pagar = Number((monto_mensual * parseInt(this.formPago.value.mes)).toFixed(2));

    const nombrecliente = this._gs.titlecase(cliente);
    this.formPago.patchValue({ afiliado_id, cliente : nombrecliente, servicio_id, servicio, duracion_meses, monto_mensual, total_pagar, letras_pagadas });
  }

  valueChangesMes() {
    this.formPago.get('mes')?.valueChanges.subscribe(mes => {

      const letras_pendientes = parseInt(this.formPago.value.letras_pendientes, 10);

      if (mes === null) {
        this.setearMesYTotaPagarCero();
      } else if (parseInt(mes) <= letras_pendientes) {
        this.calcularTotalAPagar(parseInt(mes));
      } else {
        this.setearMesYTotaPagarCero();
      }
    });
  }

  calcularTotalAPagar(mes: number) {
    this.formPago.get('mes')?.setValue(mes, { emitEvent: false });

    const monto_mensual = parseFloat(this.formPago.value.monto_mensual);
    const total_pagar = monto_mensual * mes;
    this.formPago.patchValue({ total_pagar: Number(total_pagar.toFixed(2)) });
  }

  setearMesYTotaPagarCero() {
    this.formPago.get('mes')?.setValue(0, { emitEvent: false });
    this.formPago.patchValue({ total_pagar: 0 });
  }

  pagar() {
    if (this.formPago.invalid) { return; }

    if (this.formPago.valid) {
      const form = this.formPago.value;

      let json = {
        pagos: { afiliado_id: form.afiliado_id },
        detalle_pago : [ {servicio_id: form.servicio_id, mes : form.mes, total_pagado : form.total_pagar }]
      }
      console.log('pagos',json);
      this.serviciosPagos(json);
    }

  }

  serviciosPagos(json:any){
    this._sp.savePagos(json).subscribe({
      next : (resp) =>{
        //console.log(resp);
        if (resp.status) {
          this._als.showAlert('Pagos', resp.message, 'success');
        } else {
          this._als.showAlert('Pagos!', resp.message, 'warning');  
        }
      },
      error : (err) => {
        console.log(err);
      }
    }); 
  }

  cerrar() {
    this.dialog.close();
  }

}
