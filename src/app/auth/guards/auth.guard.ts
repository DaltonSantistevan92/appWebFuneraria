import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  _authSer = inject(AuthService);
  router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
     return this._authSer.verificacionAutenticacion()
      .pipe(tap(estaAutenticado => {  
          if (!estaAutenticado) {
              localStorage.removeItem('token_funeraria');
              this.router.navigate(['/login']);
          }
      })
     ); 
  }
  
}
