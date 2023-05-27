import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/auth/interfaces/auth-interface';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  @Input('user') user!:User;

  constructor(
    private _authSer : AuthService,
    private router : Router,

  ) { }

  ngOnInit(): void {
  }

  salir(){
    this._authSer.deleteLocalStorage('token_funeraria');
    this.router.navigate(['/login']);
  }

}
