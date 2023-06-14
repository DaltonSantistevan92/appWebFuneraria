import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NoPageFoundComponent } from './components/no-page-found/no-page-found.component';

import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptorService } from './interceptor/auth-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    NoPageFoundComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide:HTTP_INTERCEPTORS, useClass:AuthInterceptorService, multi:true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService 
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
