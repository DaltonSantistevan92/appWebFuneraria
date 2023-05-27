import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { IntDataUser } from '../interfaces/auth-interface';
import { AlertService } from 'src/app/services/alert.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formLogin!: FormGroup;
  hide : boolean = true;

  constructor(
    private fb: FormBuilder,
    private router : Router,
    private _auSer: AuthService,
    private _als : AlertService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.formLogin = this.fb.group({
			email: ['', [Validators.required]],
			password: ['', [Validators.required, Validators.minLength(6)]]
		});
  }

  login(){
    this.formLogin.markAllAsTouched();
    if (this.formLogin.invalid) { return; }

    if (this.formLogin.valid) {
      const form : IntDataUser = this.formLogin.value; 
      this.loginAcceso(form);
    }
  }

  loginAcceso(data: IntDataUser){
    this._auSer.login(data).subscribe({
      next: (resp) => { 
        if (resp.status) {
          this._als.showAlert('Bienvenido', resp.message, 'success');
          this.router.navigate(['/home']);  
        }else {
          this._als.showAlert('Ops..!', resp.message, 'warning');
        }
      }, 
      error: (err) => { 
        this._als.showAlert('Ops..!', 'Error en login', 'error');
      }
    });  
  }



}
