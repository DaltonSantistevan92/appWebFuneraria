import { Directive, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[appRuc]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: RucDirective,
      multi: true
    }
  ]
})
export class RucDirective implements Validator {

  validate(control: AbstractControl): { [key: string]: any } | null {
    const ruc = control.value;
  
    // Verificar si el RUC tiene 13 dígitos
    if (ruc && ruc.length !== 13) {
      return { 'rucInvalidLength': true };
    }
  
    // Verificar el formato del RUC
    const pattern = /^\d{10}001$/;
    if (ruc && !pattern.test(ruc)) {
      return { 'rucInvalidFormat': true };
    }
  
    // Validar la cédula ecuatoriana
    const cedula = ruc.substring(0, 10);
    if (!this.validateCedula(cedula)) {
      return { 'rucInvalidCedula': true };
    }
  
    return null;
  }
  

  private validateCedula(cedula: string): boolean {
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2, 1];
    let suma = 0;
  
    for (let i = 0; i < coeficientes.length; i++) {
      let producto = parseInt(cedula.charAt(i)) * coeficientes[i];
      suma += producto >= 10 ? producto - 9 : producto;
    }
  
    const verificador = (suma % 10) === 0 ? 0 : 10 - (suma % 10);
    const digitoVerificador = parseInt(cedula.charAt(9));
  
    return verificador !== digitoVerificador; // Invertir la lógica aquí
  }

}
