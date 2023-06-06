import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appPrecioTocado]'
})
export class PrecioTocadoDirective {

  @Input() formularioTocado: boolean = false;

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    if (!this.formularioTocado) {
      const transformedValue = this.transformValue(value);
      this.el.nativeElement.value = transformedValue;
    }
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
