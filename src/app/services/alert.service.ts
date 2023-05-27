import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  timerInterval :any;
  constructor() {
    
  }
  
  showAlert(title: string, text: string, icon: SweetAlertIcon): Promise<SweetAlertResult> {
    return Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showConfirmButton: false,
      timer: 1500,
      //confirmButtonText: confirmButtonText
    });
  }

  showObservableAlert(title: string, text: string, icon: SweetAlertIcon, confirmButtonText: string): Observable<SweetAlertResult> {
    return new Observable<SweetAlertResult>((observer) => {
      Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: confirmButtonText
      }).then((result) => {
        observer.next(result);
        observer.complete();
      });
    });
  }
}
