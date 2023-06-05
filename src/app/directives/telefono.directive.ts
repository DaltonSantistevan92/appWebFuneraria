import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[appTelefono]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: TelefonoDirective,
      multi: true
    }
  ]
})
export class TelefonoDirective implements Validator {

  constructor() { }

  validate(control: AbstractControl): { [key: string]: any } | null {
    const telefono = control.value;

    if (telefono && (!/^\d+$/.test(telefono) || telefono.length !== 10 || !telefono.startsWith('0'))) {
      return { 'telefonoInvalido': true };
    }

    return null;
  }

}
