import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appDecimalNumber]'
})
export class DecimalNumberDirective {

  constructor(private el: ElementRef<HTMLInputElement>, private control: NgControl) { }

  /* @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const transformedValue = this.transformValue(value);
    this.control.control!.setValue(transformedValue, { emitEvent: false });
  }

  private transformValue(value: string): string {
    // Remover caracteres no numéricos excepto el punto decimal
    const transformed = value.replace(/[^0-9.]/g, '');

    // Limitar a dos dígitos decimales
    const decimalIndex = transformed.indexOf('.');
    if (decimalIndex !== -1 && transformed.length - decimalIndex > 3) {
      return transformed.slice(0, decimalIndex + 3);
    }

    return transformed;
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const allowedChars = ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const inputChar = String.fromCharCode(event.keyCode);

    if (allowedChars.indexOf(inputChar) === -1) {
      event.preventDefault();
    }
  } */

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const transformedValue = this.transformValue(value);
    this.control.control!.setValue(transformedValue, { emitEvent: false });
  }

  private transformValue(value: string): string {
    // Remover caracteres no numéricos excepto el punto decimal
    const transformed = value.replace(/[^0-9.]/g, '');

    // Limitar a un punto decimal y dos dígitos decimales
    const decimalIndex = transformed.indexOf('.');
    if (decimalIndex !== -1) {
      const integerPart = transformed.slice(0, decimalIndex);
      let decimalPart = transformed.slice(decimalIndex + 1);
      decimalPart = decimalPart.replace(/[^0-9]/g, ''); // Remover caracteres no numéricos del decimalPart
      decimalPart = decimalPart.slice(0, 2); // Limitar a dos dígitos decimales
      return integerPart + '.' + decimalPart;
    }

    return transformed;
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.keyCode);

    if (inputChar === '.') {
      const currentValue = this.el.nativeElement.value;
      if (currentValue.includes('.')) {
        event.preventDefault();
      }
    } else {
      const allowedChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      if (allowedChars.indexOf(inputChar) === -1) {
        event.preventDefault();
      }
    }
  }

}
