import { Injectable } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  constructor(
    private _as : AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   
    const token = this._as.token;

    if (token) {
      req = req.clone({
        setHeaders:{ "Authorization":`Bearer ${token}` }
      });  
    }
    return next.handle(req);
  }
}
